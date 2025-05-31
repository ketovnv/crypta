use chrono; // For chrono::Utc::now()
use log::Level;
use serde_json::json;
use std::sync::{Arc, Mutex, Once};
use std::thread;
use std::time::Duration;
use tungstenite::{connect as ws_connect, Message, WebSocket}; // Aliased connect
use url; // For url::Url

// Define a common error type for connection attempts
type ConnectError = Box<dyn std::error::Error + Send + Sync + 'static>;

#[derive(Clone)]
pub struct WebSocketLogger {
    sender: Arc<Mutex<Option<WebSocket<tungstenite::stream::MaybeTlsStream<std::net::TcpStream>>>>>,
    url: String,
}

impl WebSocketLogger {
    pub fn new(url: String) -> Self {
        let logger = Self {
            sender: Arc::new(Mutex::new(None)),
            url,
        };

        let logger_clone = logger.clone();
        thread::spawn(move || {
            logger_clone.connect_loop();
        });

        logger
    }

    fn connect_loop(&self) {
        loop {
            match self.attempt_connection() {
                Ok(ws_stream) => {
                    println!("[WebSocketLogger] Connected to {}", self.url);
                    let mut sender_guard = self.sender.lock().unwrap();
                    *sender_guard = Some(ws_stream);
                    break;
                }
                Err(e) => {
                    println!(
                        "[WebSocketLogger] Connection error: {}, retrying in 2 sec",
                        e
                    );
                    thread::sleep(Duration::from_secs(2));
                }
            }
        }
    }

    fn attempt_connection(
        &self,
    ) -> Result<
        WebSocket<tungstenite::stream::MaybeTlsStream<std::net::TcpStream>>,
        ConnectError,
    > {
        let parsed_url_obj = url::Url::parse(&self.url).map_err(ConnectError::from)?;
        // Convert url::Url to &str or String for tungstenite
        let (ws, _response) = ws_connect(parsed_url_obj.as_str()).map_err(ConnectError::from)?;
        Ok(ws)
    }

    pub fn send_log(&self, level: Level, message: String, target: Option<String>) {
        let actual_target = target.unwrap_or_else(|| "tauri".to_string());
        let log_entry = json!({
            "level": level.to_string().to_lowercase(),
            "message": message,
            "target": actual_target,
            "timestamp": chrono::Utc::now().to_rfc3339(),
            "source": "tauri"
        });

        let message_text = log_entry.to_string();
        // Use .into() to convert String to Utf8Bytes as expected by Message::Text
        let ws_message = Message::Text(message_text.into());

        let mut sender_guard = self.sender.lock().unwrap();
        if let Some(ref mut ws_stream) = *sender_guard {
            if let Err(e) = ws_stream.write_message(ws_message) {
                println!("[WebSocketLogger] Error sending log (will attempt reconnect): {}", e);
                *sender_guard = None;
                drop(sender_guard);

                let logger_clone = self.clone();
                thread::spawn(move || {
                    logger_clone.connect_loop();
                });
            }
        } else {
            println!("[WebSocketLogger] Log not sent, no active WebSocket connection: {}", message);
        }
    }
}

// Global logger
static mut GLOBAL_WS_LOGGER: Option<WebSocketLogger> = None;
static INIT: Once = Once::new();

pub fn init_websocket_logger(url: &str) {
    INIT.call_once(|| unsafe {
        GLOBAL_WS_LOGGER = Some(WebSocketLogger::new(url.to_string()));
    });
}

pub fn send_websocket_log(level: Level, message: &str, target: Option<&str>) {
    unsafe {
        if let Some(ref logger) = GLOBAL_WS_LOGGER {
            logger.send_log(
                level,
                message.to_string(),
                target.map(|s| s.to_string()),
            );
        }
    }
}

pub fn create_websocket_writer(url: &str) -> WebSocketLogger {
    init_websocket_logger(url);
    WebSocketLogger::new(url.to_string())
}

// Macros
#[macro_export]
macro_rules! ws_log {
    ($level:expr, $($arg:tt)*) => {
        let message = format!($($arg)*);
        $crate::websocket_logger::send_websocket_log($level, &message, None);
        log::log!($level, "{}", message);
    };
}

#[macro_export]
macro_rules! ws_info {
    ($($arg:tt)*) => {
        $crate::ws_log!(log::Level::Info, $($arg)*);
    };
}

#[macro_export]
macro_rules! ws_warn {
    ($($arg:tt)*) => {
        $crate::ws_log!(log::Level::Warn, $($arg)*);
    };
}

#[macro_export]
macro_rules! ws_error {
    ($($arg:tt)*) => {
        $crate::ws_log!(log::Level::Error, $($arg)*);
    };
}

#[macro_export]
macro_rules! ws_debug {
    ($($arg:tt)*) => {
        $crate::ws_log!(log::Level::Debug, $($arg)*);
    };
}