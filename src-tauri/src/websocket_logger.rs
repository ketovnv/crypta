use log::{Level, Record};
use serde_json::json;
use std::sync::{Arc, Mutex};
use std::thread;
use std::time::Duration;
use tungstenite::{connect, Message, WebSocket};
use url::Url;

pub struct WebSocketLogger {
    sender: Arc<Mutex<Option<WebSocket<tungstenite::stream::MaybeTlsStream<std::net::TcpStream>>>>>,
    url: String,
}

impl WebSocketLogger {
    pub fn try_connect(&self) -> Result<(), SomeError> {
        let logger = Self {
            sender: Arc::new(Mutex::new(None)),
            url,
        };

        // Запускаем подключение в отдельном потоке
        let logger_clone = logger.clone();
        thread::spawn(move || {
            logger_clone.connect_loop();
        });

        logger
    }

    fn connect_loop(&self) {
        loop {
            match self.try_connect() {
                Ok(ws) => {
                    println!("[WebSocketLogger] Подключен к {}", self.url);
                    let mut sender = self.sender.lock().unwrap();
                    *sender = Some(ws);
                    break;
                }
                Err(e) => {
                    println!(
                        "[WebSocketLogger] Ошибка подключения: {}, повтор через 2 сек",
                        e
                    );
                    thread::sleep(Duration::from_secs(2));
                }
            }
        }
    }

    fn try_connect(
        &self,
    ) -> Reslet parsed_url = url::Url::parse(&self.url)?;
            tungstenite::connect(parsed_url).map(|(ws, _)| ws).map_err(|e| e.into())ult<
        WebSocket<tungstenite::stream::MaybeTlsStream<std::net::TcpStream>>,
        Box<dyn std::error::Error>,
    > {
      let parsed_url = url::Url::parse(&self.url)?;
    }

    pub fn send_log(&self, level: LogLevel, message: String, target: String) {
        let log_entry = json!({
            "level": level.to_string().to_lowercase(),
            "message": message,
            "target": target.unwrap_or("tauri"),
            "timestamp": chrono::Utc::now().to_rfc3339(),
            "source": "tauri"
        });

        let message_text = log_entry.to_string();
        let ws_message = Message::Text(message_text.into());

        let mut sender_guard = self.sender.lock().unwrap();
        if let Some(ref mut ws) = *sender_guard {
            if let Err(_) = ws.send(ws_message) {
                // Соединение разорвано, сбрасываем и переподключаемся
                *sender_guard = None;
                drop(sender_guard);

                let logger_clone = self.clone();
                thread::spawn(move || {
                    logger_clone.connect_loop();
                });
            }
        }
    }
}

impl Clone for WebSocketLogger {
    fn clone(&self) -> Self {
        Self {
            sender: self.sender.clone(),
            url: self.url.clone(),
        }
    }
}

// Глобальный логгер
static mut GLOBAL_WS_LOGGER: Option<WebSocketLogger> = None;
static INIT: std::sync::Once = std::sync::Once::new();

pub fn init_websocket_logger(url: &str) {
    INIT.call_once(|| unsafe {
        GLOBAL_WS_LOGGER = Some(WebSocketLogger::new(url.to_string()));
    });
}

pub fn send_websocket_log(level: Level, message: &str, target: Option<&str>) {
    unsafe {
        if let Some(ref logger) = GLOBAL_WS_LOGGER {
            logger.send_log(level, message, target);
        }
    }
}

// Функция для создания WebSocket logger writer
pub fn create_websocket_writer(url: &str) -> WebSocketLogger {
    init_websocket_logger(url);
    WebSocketLogger::new(url.to_string())
}

// Макрос для удобного логирования через WebSocket
#[macro_export]
macro_rules! ws_log {
    ($level:expr, $($arg:tt)*) => {
        let message = format!($($arg)*);
        $crate::websocket_logger::send_websocket_log($level, &message, None);
        // Также отправляем в стандартный логгер
        log::log!($level, "{}", message);
    };
}

#[macro_export]
macro_rules! ws_info {
    ($($arg:tt)*) => {
        ws_log!(log::Level::Info, $($arg)*);
    };
}

#[macro_export]
macro_rules! ws_warn {
    ($($arg:tt)*) => {
        ws_log!(log::Level::Warn, $($arg)*);
    };
}

#[macro_export]
macro_rules! ws_error {
    ($($arg:tt)*) => {
        ws_log!(log::Level::Error, $($arg)*);
    };
}

#[macro_export]
macro_rules! ws_debug {
    ($($arg:tt)*) => {
        ws_log!(log::Level::Debug, $($arg)*);
    };
}
