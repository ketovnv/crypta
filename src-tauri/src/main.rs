#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::process::Command;
use tauri::Manager;

mod commands;
mod websocket_logger;
mod win_effects;

// Импорты из наших модулей
use crate::win_effects::{ColorType, EffectSettings, OklchColor, WindowEffect};

// Команда для запуска лог-сервера Bun
#[tauri::command]
async fn start_log_server() -> Result<String, String> {
    let output = Command::new("bun")
        .args(&["run", "log-server"])
        .current_dir(".")
        .spawn();

    match output {
        Ok(_) => {
            log::info!("Лог-сервер запущен успешно");
            Ok("Лог-сервер запущен".to_string())
        }
        Err(e) => {
            let error_msg = format!("Ошибка запуска лог-сервера: {}", e);
            log::error!("{}", error_msg);
            Err(error_msg)
        }
    }
}

// Команда для отправки тестового лога
#[tauri::command]
async fn send_test_log(level: String, message: String) -> Result<(), String> {
    match level.as_str() {
        "error" => log::error!("{}", message),
        "warn" => log::warn!("{}", message),
        "info" => log::info!("{}", message),
        "debug" => log::debug!("{}", message),
        _ => log::info!("{}", message),
    }
    Ok(())
}

// Команда для получения console.log из фронтенда
#[tauri::command]
async fn console_log(level: String, message: String, source: Option<String>) -> Result<(), String> {
    websocket_logger::send_console_message(&level, &message, source.as_deref());
    Ok(())
}

// Команда для отправки структурированных логов из фронтенда
#[tauri::command]
async fn frontend_log(
    level: String,
    message: String,
    file: Option<String>,
    line: Option<u32>,
    component: Option<String>,
) -> Result<(), String> {
    let source_info = match (file, line, component) {
        (Some(f), Some(l), Some(c)) => Some(format!("{}:{}:{}", c, f, l)),
        (Some(f), Some(l), None) => Some(format!("{}:{}", f, l)),
        (None, None, Some(c)) => Some(c),
        _ => None,
    };

    websocket_logger::send_console_message(&level, &message, source_info.as_deref());
    Ok(())
}

// Команда для управления заголовком окна
#[tauri::command]
fn toggle_titlebar(window: tauri::Window, enabled: bool) -> Result<(), String> {
    window
        .set_decorations(!enabled)
        .map_err(|e| format!("Ошибка управления заголовком окна: {}", e))?;
    Ok(())
}

// Команда для получения информации о OKLCH цвете
#[tauri::command]
fn get_oklch_info(l: f32, c: f32, h: f32, a: u8) -> Result<serde_json::Value, String> {
    let oklch = OklchColor::new(l, c, h, a);
    let rgba = oklch.to_rgba();

    Ok(serde_json::json!({
        "oklch": {
            "l": oklch.l,
            "c": oklch.c,
            "h": oklch.h,
            "a": oklch.a,
            "string": oklch.to_string()
        },
        "rgba": {
            "r": rgba.r,
            "g": rgba.g,
            "b": rgba.b,
            "a": rgba.a,
            "hex": rgba.to_hex()
        },
        "properties": {
            "is_dark": oklch.is_dark(),
            "is_light": oklch.is_light(),
            "temperature": format!("{:?}", oklch.color_temperature()),
            "in_gamut": oklch.is_in_gamut()
        }
    }))
}

// Команда для создания цветовых гармоний
#[tauri::command]
fn create_color_harmony(
    l: f32,
    c: f32,
    h: f32,
    a: u8,
    harmony_type: String,
) -> Result<serde_json::Value, String> {
    let base_color = OklchColor::new(l, c, h, a);

    let colors = match harmony_type.as_str() {
        "complementary" => vec![base_color, base_color.complementary()],
        "triadic" => base_color.triadic().to_vec(),
        "tetradic" => base_color.tetradic().to_vec(),
        "analogous" => base_color.analogous(30.0).to_vec(),
        "split_complementary" => base_color.split_complementary().to_vec(),
        _ => vec![base_color],
    };

    let result: Vec<serde_json::Value> = colors
        .iter()
        .map(|color| {
            let rgba = color.to_rgba();
            serde_json::json!({
                "oklch": {
                    "l": color.l,
                    "c": color.c,
                    "h": color.h,
                    "a": color.a
                },
                "rgba": {
                    "r": rgba.r,
                    "g": rgba.g,
                    "b": rgba.b,
                    "a": rgba.a
                },
                "hex": rgba.to_hex()
            })
        })
        .collect();

    Ok(serde_json::json!({
        "type": harmony_type,
        "colors": result
    }))
}

// Команда для создания градиента
#[tauri::command]
fn create_oklch_gradient(
    l1: f32,
    c1: f32,
    h1: f32,
    a1: u8,
    l2: f32,
    c2: f32,
    h2: f32,
    a2: u8,
    steps: usize,
) -> Result<serde_json::Value, String> {
    let color1 = OklchColor::new(l1, c1, h1, a1);
    let color2 = OklchColor::new(l2, c2, h2, a2);

    let palette = OklchColor::gradient_palette(&color1, &color2, steps);

    let result: Vec<serde_json::Value> = palette
        .iter()
        .map(|rgba| {
            serde_json::json!({
                "r": rgba.r,
                "g": rgba.g,
                "b": rgba.b,
                "a": rgba.a,
                "hex": rgba.to_hex()
            })
        })
        .collect();

    Ok(serde_json::json!({
        "steps": steps,
        "colors": result
    }))
}

fn main() {
    tauri::Builder::default()
        .plugin(
            tauri_plugin_log::Builder::new()
                .targets([
                    tauri_plugin_log::Target::new(tauri_plugin_log::TargetKind::Stdout),
                    tauri_plugin_log::Target::new(tauri_plugin_log::TargetKind::LogDir {
                        file_name: Some("app.log".to_string()),
                    }),
                    tauri_plugin_log::Target::new(tauri_plugin_log::TargetKind::Webview),
                ])
                .level(log::LevelFilter::Info)
                .build(),
        )
        .invoke_handler(tauri::generate_handler![
            // Команды из commands.rs
            commands::get_monitor_modes,
            commands::set_window_size,
            commands::my_custom_command,
            commands::close_splashscreen,
            commands::open_devtools,
            commands::set_always_on_top,
            commands::toggle_menu,
            commands::set_monitor_resolution,
            // Команды из win_effects.rs (OKLCH плагин)
            win_effects::set_window_effect,
            win_effects::set_simple_effect,
            win_effects::clear_window_effect,
            win_effects::animate_window_effect,
            // OKLCH утилиты
            get_oklch_info,
            create_color_harmony,
            create_oklch_gradient,
            // Логирование
            start_log_server,
            send_test_log,
            console_log,
            frontend_log,
            // Интерфейс
            toggle_titlebar
        ])
        .setup(|app| {
            log::info!("🚀 Crypta приложение запускается...");

            // Инициализируем WebSocket логгер
            websocket_logger::init_websocket_logger("ws://localhost:9999/ws");

            // Запускаем лог-сервер автоматически
            tauri::async_runtime::spawn(async {
                // Небольшая задержка перед запуском лог-сервера
                tokio::time::sleep(tokio::time::Duration::from_millis(500)).await;

                if let Err(e) = start_log_server().await {
                    crate::ws_error!("Не удалось запустить лог-сервер: {}", e);
                } else {
                    crate::ws_info!("📊 Лог-сервер доступен по адресу: http://localhost:9999");

                    // Отправляем тестовые логи после запуска сервера
                    tokio::time::sleep(tokio::time::Duration::from_secs(2)).await;
                    crate::ws_info!("😺 WebSocket логгер подключен");
                    crate::ws_warn!("👾️ Тестовое предупреждение");
                    crate::ws_error!("☠️ Тестовая ошибка");
                    crate::ws_debug!("👻 Тестовое отладочное сообщение");
                }
            });

            // Применяем эффект по умолчанию к главному окну
            if let Some(webview_window) = app.get_webview_window("main") {
                let window = webview_window.as_ref().window();

                // Настройки эффекта по умолчанию, используя супер-OKLCH
                let default_effect = EffectSettings {
                    effect_type: WindowEffect::Acrylic,
                    color: ColorType::Oklch(OklchColor::new(0.4, 0.1, 240.0, 200)),
                    dark_mode: true,
                };

                // Применяем эффект
                if let Err(e) = win_effects::apply_effect(&window, default_effect) {
                    crate::ws_error!("Не удалось применить эффект к окну: {}", e);
                } else {
                    crate::ws_info!(
                        "🎨 Применен OKLCH эффект: L={:.2} C={:.2} H={:.0}°",
                        0.4,
                        0.1,
                        240.0
                    );
                }

                // Отображаем DevTools только в режиме разработки
                #[cfg(debug_assertions)]
                {
                    webview_window.open_devtools();
                    crate::ws_debug!("🔧 DevTools открыты");
                }
            }

            crate::ws_info!("✅ Crypta приложение готово к работе!");
            crate::ws_info!("🌈 Супер-OKLCH плагин активирован");

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
