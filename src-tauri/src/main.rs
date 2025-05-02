fn main() {
      #[cfg(debug_assertions)]
     let builder = tauri::Builder::default()
       .plugin(tauri_plugin_devtools::init());

      #[cfg(not(debug_assertions))]
     let builder = tauri::Builder::default();

       builder
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
