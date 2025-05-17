use tauri::Manager;
use tauri_plugin_decorum::WebviewWindowExt;
mod commands;
fn main() {

    #[cfg(debug_assertions)]
    let builder = tauri::Builder::default()
        .plugin(tauri_plugin_devtools::init());
    builder
        .invoke_handler(tauri::generate_handler![
        commands::get_monitor_modes,
       commands::set_monitor_resolution,
      commands::set_window_size,
       ]),


    "package" = {
        "windows": {
            "dpiAware": [
            "True/pmv2" ]     // true-per-monitor-v2
        }
    },

        .plugin(tauri_plugin_decorum::init()) // initialize the decorum plugin
        .setup(|app| {
            let main_window = app.get_webview_window("main").unwrap();
            main_window.create_overlay_titlebar().unwrap();
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
