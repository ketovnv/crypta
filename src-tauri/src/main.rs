use tauri::Manager;
use tauri_plugin_decorum::WebviewWindowExt;
mod commands;
fn main() {
    let mut builder = tauri::Builder::default();

    #[cfg(debug_assertions)]
    {
        builder = builder.plugin(tauri_plugin_devtools::init());
    }

    builder
        .invoke_handler(tauri::generate_handler![
            commands::get_monitor_modes,
            commands::set_monitor_resolution,
            commands::set_window_size,
        ])
        .plugin(tauri_plugin_decorum::init()) // initialize the decorum plugin
        .setup(|app| {
            let main_window = app.get_webview_window("main").unwrap();
            main_window.create_overlay_titlebar().unwrap();
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
