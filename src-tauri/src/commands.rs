use serde::Serialize;
use tauri::{command, Manager, Window};
use windows::core::PCSTR;
use windows::Win32::Foundation::FALSE;
use windows::Win32::Graphics::Gdi::*;

#[derive(Serialize)]
pub struct MonitorMode {
    width: u32,
    height: u32,
    refresh_rate: u32,
    is_current: bool,
}

#[command]
pub fn get_monitor_modes() -> Vec<MonitorMode> {
    let mut modes = vec![];
    let mut i = 0;
    let mut current_mode = DEVMODEA::default();
    current_mode.dmSize = std::mem::size_of::<DEVMODEA>() as u16;

    let _ = unsafe {
        EnumDisplaySettingsA(
            PCSTR(std::ptr::null()),
            ENUM_CURRENT_SETTINGS,
            &mut current_mode,
        )
    };

    loop {
        let mut devmode = DEVMODEA::default();
        devmode.dmSize = std::mem::size_of::<DEVMODEA>() as u16;

        if unsafe {
            EnumDisplaySettingsA(
                PCSTR(std::ptr::null()),
                ENUM_DISPLAY_SETTINGS_MODE(i),
                &mut devmode,
            )
        } == FALSE
        {
            break;
        }

        let is_current = devmode.dmPelsWidth == current_mode.dmPelsWidth
            && devmode.dmPelsHeight == current_mode.dmPelsHeight
            && devmode.dmDisplayFrequency == current_mode.dmDisplayFrequency;

        modes.push(MonitorMode {
            width: devmode.dmPelsWidth,
            height: devmode.dmPelsHeight,
            refresh_rate: devmode.dmDisplayFrequency,
            is_current,
        });

        i += 1;
    }

    modes
}

#[command]
pub fn set_window_size(window: Window, width: u32, height: u32) -> Result<(), String> {
    if let Err(e) = window.set_size(tauri::Size::Logical(tauri::LogicalSize {
        width: width as f64,
        height: height as f64,
    })) {
        return Err(format!("Failed to set window size: {}", e));
    }
    Ok(())
}

#[command]
pub fn my_custom_command(name: &str) -> String {
    format!("Hello, {}!", name)
}

#[command]
pub fn close_splashscreen(window: Window) -> Result<(), String> {
    if let Some(splashscreen) = window.get_webview_window("splashscreen") {
        splashscreen.close().map_err(|e| e.to_string())?;
    }
    Ok(())
}

#[command]
pub fn open_devtools(window: Window) -> Result<(), String> {
    #[cfg(debug_assertions)]
    {
        if let Some(webview_window) = window.get_webview_window(window.label()) {
            webview_window.open_devtools();
        }
    }
    Ok(())
}

#[command]
pub fn set_always_on_top(window: Window, always_on_top: bool) -> Result<(), String> {
    window
        .set_always_on_top(always_on_top)
        .map_err(|e| format!("Failed to set always on top: {}", e))
}

#[command]
pub fn toggle_menu(_window: Window) -> Result<(), String> {
    // В Tauri 2.x меню управляется через app handle
    // Здесь можно добавить логику для показа/скрытия меню
    Ok(())
}

#[command]
pub fn set_monitor_resolution(width: u32, height: u32, refresh_rate: u32) -> Result<(), String> {
    let mut devmode = DEVMODEA::default();
    devmode.dmSize = std::mem::size_of::<DEVMODEA>() as u16;
    devmode.dmPelsWidth = width;
    devmode.dmPelsHeight = height;
    devmode.dmDisplayFrequency = refresh_rate;
    devmode.dmFields = DM_PELSWIDTH | DM_PELSHEIGHT | DM_DISPLAYFREQUENCY;

    // Теперь используем Some() для правильного типа
    let result = unsafe { ChangeDisplaySettingsA(Some(&devmode), CDS_UPDATEREGISTRY) };
    if result != DISP_CHANGE_SUCCESSFUL {
        return Err(format!("Failed to change resolution: code {}", result.0));
    }

    Ok(())
}
