//! Модуль для работы с эффектами Windows
//! Расширенная версия с поддержкой OKLCH цветов

use serde::{Deserialize, Serialize};
use std::f32::consts::PI;
use std::ffi::c_void;
use tauri::{command, Window};
use windows::core::PCSTR;
use windows::Win32::Foundation::FARPROC;
use windows::Win32::Foundation::HWND;
use windows::Win32::Graphics::Dwm::*;
use windows::Win32::System::LibraryLoader::*;

/// WCAG контрастность уровни
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum WcagLevel {
    /// Соответствует AAA стандарту (7:1)
    AAA,
    /// Соответствует AA стандарту (4.5:1)
    AA,
    /// Соответствует AA для крупного текста (3:1)
    AALarge,
    /// Не соответствует стандартам
    Fail,
}

// Тип ошибки
pub type Error = Box<dyn std::error::Error + Send + Sync>;
// Тип результата
pub type Result<T> = std::result::Result<T, String>;

/// Тип цвета в формате RGBA
pub type Color = (u8, u8, u8, u8);

/// Цветовой формат RGBA (красный, зеленый, синий, альфа)
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RgbaColor {
    pub r: u8,
    pub g: u8,
    pub b: u8,
    pub a: u8,
}

impl Default for RgbaColor {
    fn default() -> Self {
        Self {
            r: 18,
            g: 18,
            b: 18,
            a: 125,
        }
    }
}

impl RgbaColor {
    pub fn new(r: u8, g: u8, b: u8, a: u8) -> Self {
        Self { r, g, b, a }
    }

    /// Преобразует цвет в кортеж для использования в нативных функциях
    pub fn to_tuple(&self) -> Color {
        (self.r, self.g, self.b, self.a)
    }

    /// Создает RgbaColor из HSL значений
    pub fn from_hsl(h: f32, s: f32, l: f32, a: u8) -> Self {
        let c = (1.0 - (2.0 * l - 1.0).abs()) * s;
        let x = c * (1.0 - ((h / 60.0) % 2.0 - 1.0).abs());
        let m = l - c / 2.0;

        let (r, g, b) = match h as u32 {
            0..=59 => (c, x, 0.0),
            60..=119 => (x, c, 0.0),
            120..=179 => (0.0, c, x),
            180..=239 => (0.0, x, c),
            240..=299 => (x, 0.0, c),
            _ => (c, 0.0, x),
        };

        Self {
            r: ((r + m) * 255.0) as u8,
            g: ((g + m) * 255.0) as u8,
            b: ((b + m) * 255.0) as u8,
            a,
        }
    }

    /// Создает цвет из линейного градиента между двумя цветами
    pub fn lerp(color1: &Self, color2: &Self, t: f32) -> Self {
        let t = t.max(0.0).min(1.0);
        Self {
            r: ((1.0 - t) * color1.r as f32 + t * color2.r as f32) as u8,
            g: ((1.0 - t) * color1.g as f32 + t * color2.g as f32) as u8,
            b: ((1.0 - t) * color1.b as f32 + t * color2.b as f32) as u8,
            a: ((1.0 - t) * color1.a as f32 + t * color2.a as f32) as u8,
        }
    }

    /// Преобразует RGB в OKLCH цветовое пространство
    pub fn to_oklch(&self) -> OklchColor {
        // Шаг 1: sRGB -> Linear RGB
        let r_linear = inverse_gamma_correct(self.r as f32 / 255.0);
        let g_linear = inverse_gamma_correct(self.g as f32 / 255.0);
        let b_linear = inverse_gamma_correct(self.b as f32 / 255.0);

        // Шаг 2: Linear RGB -> Oklab
        let l = 0.4122214708 * r_linear + 0.5363325363 * g_linear + 0.0514459929 * b_linear;
        let m = 0.2119034982 * r_linear + 0.6806995451 * g_linear + 0.1073969566 * b_linear;
        let s = 0.0883024619 * r_linear + 0.2817188376 * g_linear + 0.6299787005 * b_linear;

        let l_ = l.cbrt();
        let m_ = m.cbrt();
        let s_ = s.cbrt();

        // Шаг 3: LMS -> Lab
        let lab_l = 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_;
        let lab_a = 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_;
        let lab_b = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_;

        // Шаг 4: Lab -> OKLCH
        let chroma = (lab_a * lab_a + lab_b * lab_b).sqrt();
        let hue = if chroma == 0.0 {
            0.0
        } else {
            let mut h = lab_b.atan2(lab_a) * 180.0 / PI;
            if h < 0.0 {
                h += 360.0;
            }
            h
        };

        OklchColor::new(lab_l, chroma, hue, self.a)
    }

    /// Создает цвет из шестнадцатеричной строки (#RRGGBB или #RRGGBBAA)
    pub fn from_hex(hex: &str) -> Option<Self> {
        let hex = hex.strip_prefix('#').unwrap_or(hex);

        match hex.len() {
            6 => {
                let r = u8::from_str_radix(&hex[0..2], 16).ok()?;
                let g = u8::from_str_radix(&hex[2..4], 16).ok()?;
                let b = u8::from_str_radix(&hex[4..6], 16).ok()?;
                Some(Self::new(r, g, b, 255))
            }
            8 => {
                let r = u8::from_str_radix(&hex[0..2], 16).ok()?;
                let g = u8::from_str_radix(&hex[2..4], 16).ok()?;
                let b = u8::from_str_radix(&hex[4..6], 16).ok()?;
                let a = u8::from_str_radix(&hex[6..8], 16).ok()?;
                Some(Self::new(r, g, b, a))
            }
            _ => None,
        }
    }

    /// Преобразует в шестнадцатеричную строку
    pub fn to_hex(&self) -> String {
        if self.a == 255 {
            format!("#{:02X}{:02X}{:02X}", self.r, self.g, self.b)
        } else {
            format!("#{:02X}{:02X}{:02X}{:02X}", self.r, self.g, self.b, self.a)
        }
    }

    /// Вычисляет яркость цвета (luminance)
    pub fn luminance(&self) -> f32 {
        let r = inverse_gamma_correct(self.r as f32 / 255.0);
        let g = inverse_gamma_correct(self.g as f32 / 255.0);
        let b = inverse_gamma_correct(self.b as f32 / 255.0);

        0.2126 * r + 0.7152 * g + 0.0722 * b
    }

    /// Вычисляет контрастность между двумя цветами
    pub fn contrast_ratio(&self, other: &Self) -> f32 {
        let lum1 = self.luminance();
        let lum2 = other.luminance();

        let (lighter, darker) = if lum1 > lum2 {
            (lum1, lum2)
        } else {
            (lum2, lum1)
        };

        (lighter + 0.05) / (darker + 0.05)
    }

    /// Проверяет соответствие WCAG стандартам доступности
    pub fn wcag_contrast(&self, other: &Self) -> WcagLevel {
        let ratio = self.contrast_ratio(other);

        if ratio >= 7.0 {
            WcagLevel::AAA
        } else if ratio >= 4.5 {
            WcagLevel::AA
        } else if ratio >= 3.0 {
            WcagLevel::AALarge
        } else {
            WcagLevel::Fail
        }
    }

    /// Определяет, является ли цвет темным
    pub fn is_dark(&self) -> bool {
        self.luminance() < 0.5
    }

    /// Получает подходящий цвет текста (черный или белый)
    pub fn text_color(&self) -> Self {
        if self.is_dark() {
            Self::new(255, 255, 255, 255) // Белый
        } else {
            Self::new(0, 0, 0, 255) // Черный
        }
    }

    /// Создает цветовую карту для анализа доступности
    pub fn accessibility_report(&self, background: &Self) -> AccessibilityReport {
        let oklch_self = self.to_oklch();
        let oklch_bg = background.to_oklch();

        AccessibilityReport {
            contrast_ratio: self.contrast_ratio(background),
            wcag_level: self.wcag_contrast(background),
            lightness_difference: (oklch_self.l - oklch_bg.l).abs(),
            is_readable: self.contrast_ratio(background) >= 4.5,
            recommended_text_color: background.text_color(),
        }
    }

    /// Получает ближайший web-safe цвет
    pub fn to_web_safe(&self) -> Self {
        let web_safe = |component: u8| -> u8 {
            let rounded = ((component as f32 / 51.0).round() * 51.0) as u8;
            rounded.min(255)
        };

        Self::new(web_safe(self.r), web_safe(self.g), web_safe(self.b), self.a)
    }

    /// Создает оттенки серого на основе яркости
    pub fn to_grayscale(&self) -> Self {
        let gray = (0.299 * self.r as f32 + 0.587 * self.g as f32 + 0.114 * self.b as f32) as u8;
        Self::new(gray, gray, gray, self.a)
    }
}

/// Цветовой формат OKLCH (Lightness, Chroma, Hue, Alpha)
#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
pub struct OklchColor {
    pub l: f32, // Lightness (0.0-1.0)
    pub c: f32, // Chroma (0.0-0.4 обычно)
    pub h: f32, // Hue (0.0-360.0)
    pub a: u8,  // Alpha (0-255)
}

impl Default for OklchColor {
    fn default() -> Self {
        Self {
            l: 0.2,   // Темный оттенок
            c: 0.05,  // Слабо насыщенный
            h: 250.0, // Синеватый оттенок
            a: 125,   // Полупрозрачный
        }
    }
}

impl OklchColor {
    pub fn new(l: f32, c: f32, h: f32, a: u8) -> Self {
        Self {
            l: l.clamp(0.0, 1.0),
            c: c.max(0.0),
            h: if h < 0.0 {
                h % 360.0 + 360.0
            } else {
                h % 360.0
            },
            a,
        }
    }

    /// Создает цвет из RGB
    pub fn from_rgba(rgba: &RgbaColor) -> Self {
        rgba.to_oklch()
    }

    /// Создает цвет из строки в формате "oklch(l c h / a)"
    pub fn from_string(s: &str) -> Option<Self> {
        let s = s.trim();
        if !s.starts_with("oklch(") || !s.ends_with(")") {
            return None;
        }

        let content = &s[6..s.len() - 1];
        let parts: Vec<&str> = content.split('/').collect();

        let lch_part = parts[0].trim();
        let alpha_part = parts.get(1).map(|s| s.trim()).unwrap_or("1.0");

        let lch_values: Vec<f32> = lch_part
            .split_whitespace()
            .filter_map(|s| s.parse().ok())
            .collect();

        if lch_values.len() != 3 {
            return None;
        }

        let alpha = alpha_part.parse::<f32>().unwrap_or(1.0);

        Some(Self::new(
            lch_values[0],
            lch_values[1],
            lch_values[2],
            (alpha * 255.0) as u8,
        ))
    }

    /// Преобразует в строку формата "oklch(l c h / a)"
    pub fn to_string(&self) -> String {
        format!(
            "oklch({:.3} {:.3} {:.1} / {:.3})",
            self.l,
            self.c,
            self.h,
            self.a as f32 / 255.0
        )
    }

    /// Улучшенное преобразование OKLCH в RGB с более точными константами
    pub fn to_rgba(&self) -> RgbaColor {
        // Шаг 1: OKLCH -> Oklab
        let h_rad = self.h * PI / 180.0;
        let a = self.c * h_rad.cos();
        let b = self.c * h_rad.sin();

        // Шаг 2: Oklab -> Linear RGB (обновленные матрицы)
        let l_ = self.l + 0.3963377774 * a + 0.2158037573 * b;
        let m_ = self.l - 0.1055613458 * a - 0.0638541728 * b;
        let s_ = self.l - 0.0894841775 * a - 1.2914855480 * b;

        let l = l_ * l_ * l_;
        let m = m_ * m_ * m_;
        let s = s_ * s_ * s_;

        // Шаг 3: Linear RGB -> sRGB (более точные коэффициенты)
        let r_linear = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
        let g_linear = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
        let b_linear = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;

        // Gamma correction
        let r = gamma_correct(r_linear);
        let g = gamma_correct(g_linear);
        let b = gamma_correct(b_linear);

        RgbaColor {
            r: (r * 255.0).clamp(0.0, 255.0) as u8,
            g: (g * 255.0).clamp(0.0, 255.0) as u8,
            b: (b * 255.0).clamp(0.0, 255.0) as u8,
            a: self.a,
        }
    }

    /// Создает новый цвет с измененной яркостью
    pub fn with_lightness(&self, l: f32) -> Self {
        Self {
            l: l.clamp(0.0, 1.0),
            ..*self
        }
    }

    /// Создает новый цвет с измененной насыщенностью
    pub fn with_chroma(&self, c: f32) -> Self {
        Self {
            c: c.max(0.0),
            ..*self
        }
    }

    /// Создает новый цвет с измененным оттенком
    pub fn with_hue(&self, h: f32) -> Self {
        Self {
            h: h % 360.0,
            ..*self
        }
    }

    /// Создает новый цвет с измененной прозрачностью
    pub fn with_alpha(&self, a: u8) -> Self {
        Self { a, ..*self }
    }

    /// Создает цвет из линейного градиента между двумя цветами OKLCH
    pub fn lerp(color1: &Self, color2: &Self, t: f32) -> Self {
        let t = t.clamp(0.0, 1.0);

        // Для тона нужно выбрать кратчайший путь
        let mut h_diff = color2.h - color1.h;

        // Если разница больше 180 градусов, идем в другую сторону
        if h_diff > 180.0 {
            h_diff -= 360.0;
        } else if h_diff < -180.0 {
            h_diff += 360.0;
        }

        let h = (color1.h + t * h_diff) % 360.0;
        let h = if h < 0.0 { h + 360.0 } else { h };

        Self {
            l: (1.0 - t) * color1.l + t * color2.l,
            c: (1.0 - t) * color1.c + t * color2.c,
            h,
            a: ((1.0 - t) * color1.a as f32 + t * color2.a as f32) as u8,
        }
    }

    /// Создает коллекцию цветов для градиента в OKLCH пространстве
    pub fn gradient_palette(color1: &Self, color2: &Self, steps: usize) -> Vec<RgbaColor> {
        let mut palette = Vec::with_capacity(steps);

        for i in 0..steps {
            let t = if steps == 1 {
                0.0
            } else {
                i as f32 / (steps as f32 - 1.0)
            };
            let oklch = Self::lerp(color1, color2, t);
            palette.push(oklch.to_rgba());
        }

        palette
    }

    /// Создает дополнительный цвет (противоположный по цветовому кругу)
    pub fn complementary(&self) -> Self {
        Self {
            h: (self.h + 180.0) % 360.0,
            ..*self
        }
    }

    /// Создает триаду цветов (разделенных на 120 градусов)
    pub fn triadic(&self) -> [Self; 3] {
        [
            *self,
            Self {
                h: (self.h + 120.0) % 360.0,
                ..*self
            },
            Self {
                h: (self.h + 240.0) % 360.0,
                ..*self
            },
        ]
    }

    /// Создает тетраду цветов (квадратная схема)
    pub fn tetradic(&self) -> [Self; 4] {
        [
            *self,
            Self {
                h: (self.h + 90.0) % 360.0,
                ..*self
            },
            Self {
                h: (self.h + 180.0) % 360.0,
                ..*self
            },
            Self {
                h: (self.h + 270.0) % 360.0,
                ..*self
            },
        ]
    }

    /// Создает аналогичные цвета (близкие по тону)
    pub fn analogous(&self, angle: f32) -> [Self; 3] {
        [
            Self {
                h: (self.h - angle).rem_euclid(360.0),
                ..*self
            },
            *self,
            Self {
                h: (self.h + angle) % 360.0,
                ..*self
            },
        ]
    }

    /// Создает монохромную палитру с различной яркостью
    pub fn monochromatic(&self, steps: usize) -> Vec<Self> {
        let mut palette = Vec::with_capacity(steps);

        for i in 0..steps {
            let lightness = if steps == 1 {
                self.l
            } else {
                i as f32 / (steps as f32 - 1.0)
            };

            palette.push(Self {
                l: lightness,
                ..*self
            });
        }

        palette
    }

    /// Проверяет, находится ли цвет в видимом спектре (в гамуте sRGB)
    pub fn is_in_gamut(&self) -> bool {
        let rgba = self.to_rgba();
        let r_linear = inverse_gamma_correct(rgba.r as f32 / 255.0);
        let g_linear = inverse_gamma_correct(rgba.g as f32 / 255.0);
        let b_linear = inverse_gamma_correct(rgba.b as f32 / 255.0);

        r_linear >= 0.0
            && r_linear <= 1.0
            && g_linear >= 0.0
            && g_linear <= 1.0
            && b_linear >= 0.0
            && b_linear <= 1.0
    }

    /// Приводит цвет в гамут sRGB, сохраняя оттенок и яркость
    pub fn clamp_to_gamut(&self) -> Self {
        if self.is_in_gamut() {
            return *self;
        }

        // Бинарный поиск подходящей насыщенности
        let mut low = 0.0;
        let mut high = self.c;
        let mut result = *self;

        for _ in 0..20 {
            // 20 итераций должно быть достаточно
            let mid = (low + high) / 2.0;
            let test_color = Self { c: mid, ..*self };

            if test_color.is_in_gamut() {
                result = test_color;
                low = mid;
            } else {
                high = mid;
            }
        }

        result
    }

    /// Вычисляет Delta E (различие цветов) в OKLCH пространстве
    pub fn delta_e(&self, other: &Self) -> f32 {
        let dl = self.l - other.l;
        let dc = self.c - other.c;

        // Для hue разности учитываем кольцевую структуру
        let mut dh = self.h - other.h;
        if dh > 180.0 {
            dh -= 360.0;
        } else if dh < -180.0 {
            dh += 360.0;
        }

        // Упрощенная формула Delta E для OKLCH
        (dl * dl + dc * dc + (dh * PI / 180.0) * (dh * PI / 180.0)).sqrt()
    }

    /// Определяет, является ли цвет темным (для выбора цвета текста)
    pub fn is_dark(&self) -> bool {
        self.l < 0.5
    }

    /// Определяет, является ли цвет светлым
    pub fn is_light(&self) -> bool {
        self.l > 0.7
    }

    /// Создает оттенок цвета (уменьшенная яркость)
    pub fn shade(&self, factor: f32) -> Self {
        let factor = factor.clamp(0.0, 1.0);
        Self {
            l: self.l * factor,
            ..*self
        }
    }

    /// Создает тон цвета (увеличенная яркость)
    pub fn tint(&self, factor: f32) -> Self {
        let factor = factor.clamp(0.0, 1.0);
        Self {
            l: self.l + (1.0 - self.l) * factor,
            ..*self
        }
    }

    /// Создает тон цвета (смешивание с серым)
    pub fn tone(&self, factor: f32) -> Self {
        let factor = factor.clamp(0.0, 1.0);
        Self {
            c: self.c * (1.0 - factor),
            ..*self
        }
    }

    /// Определяет температуру цвета (теплый/холодный)
    pub fn color_temperature(&self) -> ColorTemperature {
        if self.h >= 30.0 && self.h <= 210.0 {
            if self.h >= 60.0 && self.h <= 120.0 {
                ColorTemperature::Neutral
            } else {
                ColorTemperature::Warm
            }
        } else {
            ColorTemperature::Cool
        }
    }

    /// Создает цветовую схему "сплит-комплемент"
    pub fn split_complementary(&self) -> [Self; 3] {
        let comp_hue = (self.h + 180.0) % 360.0;
        [
            *self,
            Self {
                h: (comp_hue - 30.0).rem_euclid(360.0),
                ..*self
            },
            Self {
                h: (comp_hue + 30.0) % 360.0,
                ..*self
            },
        ]
    }

    /// Создает цветовую схему "двойная комплементарная"
    pub fn double_complementary(&self, secondary_hue: f32) -> [Self; 4] {
        let secondary = Self {
            h: secondary_hue % 360.0,
            ..*self
        };
        let secondary_comp = secondary.complementary();
        [*self, self.complementary(), secondary, secondary_comp]
    }

    /// Смешивает два цвета в OKLCH пространстве
    pub fn mix(&self, other: &Self, ratio: f32) -> Self {
        Self::lerp(self, other, ratio)
    }

    /// Создает градиент с настраиваемой интерполацией
    pub fn gradient_with_easing(
        &self,
        target: &Self,
        steps: usize,
        easing: EasingFunction,
    ) -> Vec<Self> {
        let mut gradient = Vec::with_capacity(steps);

        for i in 0..steps {
            let t = if steps == 1 {
                0.0
            } else {
                i as f32 / (steps as f32 - 1.0)
            };

            let eased_t = match easing {
                EasingFunction::Linear => t,
                EasingFunction::EaseIn => t * t,
                EasingFunction::EaseOut => 1.0 - (1.0 - t) * (1.0 - t),
                EasingFunction::EaseInOut => {
                    if t < 0.5 {
                        2.0 * t * t
                    } else {
                        1.0 - 2.0 * (1.0 - t) * (1.0 - t)
                    }
                }
            };

            gradient.push(Self::lerp(self, target, eased_t));
        }

        gradient
    }

    /// Получает доминирующий цвет из палитры
    pub fn dominant_from_palette(colors: &[Self]) -> Option<Self> {
        if colors.is_empty() {
            return None;
        }

        // Простой алгоритм: цвет с наибольшей насыщенностью
        colors
            .iter()
            .max_by(|a, b| a.c.partial_cmp(&b.c).unwrap_or(std::cmp::Ordering::Equal))
            .copied()
    }
}

/// Температура цвета
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum ColorTemperature {
    Warm,
    Neutral,
    Cool,
}

/// Функция интерполации для градиентов
#[derive(Debug, Clone, Copy)]
pub enum EasingFunction {
    Linear,
    EaseIn,
    EaseOut,
    EaseInOut,
}

/// Утилиты для работы с цветовыми палитрами
pub struct ColorPalette;

impl ColorPalette {
    /// Создает материал дизайн палитру из базового цвета
    pub fn material_design(base: &OklchColor) -> Vec<OklchColor> {
        let shades = vec![0.05, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9];

        shades
            .into_iter()
            .map(|lightness| OklchColor::new(lightness, base.c, base.h, base.a))
            .collect()
    }

    /// Создает аналогичную палитру с вариациями
    pub fn analogous_variations(base: &OklchColor, count: usize) -> Vec<OklchColor> {
        let angle_step = 30.0;
        let mut palette = Vec::with_capacity(count);

        for i in 0..count {
            let offset =
                (i as f32 - (count as f32 - 1.0) / 2.0) * angle_step / (count as f32 - 1.0);
            palette.push(OklchColor::new(
                base.l,
                base.c,
                (base.h + offset).rem_euclid(360.0),
                base.a,
            ));
        }

        palette
    }

    /// Создает монохромную палитру с различными вариациями
    pub fn monochrome_extended(base: &OklchColor, variations: usize) -> Vec<OklchColor> {
        let mut palette = Vec::new();

        // Создаем вариации по яркости
        for i in 0..variations {
            let lightness = i as f32 / (variations as f32 - 1.0);
            palette.push(OklchColor::new(lightness, base.c, base.h, base.a));
        }

        // Добавляем вариации по насыщенности
        for i in 1..variations {
            let chroma = base.c * (i as f32 / (variations as f32 - 1.0));
            palette.push(OklchColor::new(base.l, chroma, base.h, base.a));
        }

        palette
    }
}

/// Отчет о доступности цвета
#[derive(Debug, Clone)]
pub struct AccessibilityReport {
    pub contrast_ratio: f32,
    pub wcag_level: WcagLevel,
    pub lightness_difference: f32,
    pub is_readable: bool,
    pub recommended_text_color: RgbaColor,
}

// Вспомогательная функция для гамма-коррекции (линейный RGB -> sRGB)
fn gamma_correct(linear: f32) -> f32 {
    if linear <= 0.0031308 {
        linear * 12.92
    } else {
        1.055 * linear.powf(1.0 / 2.4) - 0.055
    }
}

// Обратная гамма-коррекция (sRGB -> линейный RGB)
fn inverse_gamma_correct(srgb: f32) -> f32 {
    if srgb <= 0.04045 {
        srgb / 12.92
    } else {
        ((srgb + 0.055) / 1.055).powf(2.4)
    }
}

/// Типы эффектов окна
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum WindowEffect {
    /// Эффект размытия (Blur)
    Blur,
    /// Эффект акрила (Acrylic)
    Acrylic,
    /// Эффект Mica (только для Windows 11)
    Mica,
    /// Эффект вкладок (Tabbed, только для Windows 11)
    Tabbed,
    /// Без эффекта
    None,
}

impl Default for WindowEffect {
    fn default() -> Self {
        WindowEffect::Blur
    }
}

/// Тип цвета, который может быть задан в разных форматах
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum ColorType {
    /// Цвет в формате RGBA
    Rgba(RgbaColor),
    /// Цвет в формате OKLCH
    Oklch(OklchColor),
}

impl Default for ColorType {
    fn default() -> Self {
        ColorType::Rgba(RgbaColor::default())
    }
}

impl ColorType {
    /// Преобразует в RGBA для использования в нативных функциях
    pub fn to_rgba(&self) -> RgbaColor {
        match self {
            ColorType::Rgba(rgba) => rgba.clone(),
            ColorType::Oklch(oklch) => oklch.to_rgba(),
        }
    }

    /// Получает кортеж для использования в нативных функциях
    pub fn to_tuple(&self) -> Color {
        self.to_rgba().to_tuple()
    }
}

/// Настройки эффектов окна
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EffectSettings {
    pub effect_type: WindowEffect,
    pub color: ColorType,
    pub dark_mode: bool,
}

impl Default for EffectSettings {
    fn default() -> Self {
        Self {
            effect_type: WindowEffect::default(),
            color: ColorType::default(),
            dark_mode: true,
        }
    }
}

/// Конфигурация анимации для эффектов
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AnimationConfig {
    /// Начальный цвет анимации
    pub from_color: ColorType,
    /// Конечный цвет анимации
    pub to_color: ColorType,
    /// Длительность анимации в миллисекундах
    pub duration_ms: u32,
    /// Количество шагов анимации
    pub steps: usize,
    /// Тип кривой анимации
    pub easing: EasingType,
}

/// Типы кривых анимации
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum EasingType {
    /// Линейная
    Linear,
    /// Ускорение в начале
    EaseIn,
    /// Замедление в конце
    EaseOut,
    /// Ускорение и замедление
    EaseInOut,
}

#[derive(PartialEq)]
#[repr(C)]
enum AccentState {
    AccentDisabled = 0,
    AccentEnableBlurbehind = 3,
    AccentEnableAcrylicblurbehind = 4,
}

#[repr(C)]
struct AccentPolicy {
    accent_state: u32,
    accent_flags: u32,
    gradient_color: u32,
    animation_id: u32,
}

type WindowCompositionAttrib = u32;

#[repr(C)]
struct WindowCompositionAttribData {
    attrib: WindowCompositionAttrib,
    pv_data: *mut c_void,
    cb_data: usize,
}

#[allow(unused)]
const DWMWA_MICA_EFFECT: DWMWINDOWATTRIBUTE = DWMWINDOWATTRIBUTE(1029);
#[allow(unused)]
const DWMWA_SYSTEMBACKDROP_TYPE: DWMWINDOWATTRIBUTE = DWMWINDOWATTRIBUTE(38);

#[allow(unused)]
#[repr(C)]
enum DwmSystembackdropType {
    DwmsbtDisable = 1,         // None
    DwmsbtMainwindow = 2,      // Mica
    DwmsbtTransientwindow = 3, // Acrylic
    DwmsbtTabbedwindow = 4,    // Tabbed
}

/// Применяет эффект размытия к окну
pub fn apply_blur(hwnd: HWND, color: Option<Color>) -> Result<()> {
    if is_win10_or_newer() {
        unsafe {
            set_window_composition_attribute(hwnd, AccentState::AccentEnableBlurbehind, color);
        }
    } else {
        return Err("Эффект blur поддерживается только на Windows 10 и новее".into());
    }
    Ok(())
}

/// Очищает эффект размытия
pub fn clear_blur(hwnd: HWND) -> Result<()> {
    if is_win10_or_newer() {
        unsafe {
            set_window_composition_attribute(hwnd, AccentState::AccentDisabled, None);
        }
    } else {
        return Err("Эффект blur поддерживается только на Windows 10 и новее".into());
    }
    Ok(())
}

/// Применяет эффект акрила
pub fn apply_acrylic(hwnd: HWND, color: Option<Color>) -> Result<()> {
    if is_win10_or_newer() {
        unsafe {
            set_window_composition_attribute(
                hwnd,
                AccentState::AccentEnableAcrylicblurbehind,
                color,
            );
        }
    } else {
        return Err("Эффект acrylic поддерживается только на Windows 10 и новее".into());
    }
    Ok(())
}

/// Очищает эффект акрила
pub fn clear_acrylic(hwnd: HWND) -> Result<()> {
    if is_win10_or_newer() {
        unsafe {
            set_window_composition_attribute(hwnd, AccentState::AccentDisabled, None);
        }
    } else {
        return Err("Эффект acrylic поддерживается только на Windows 10 и новее".into());
    }
    Ok(())
}

/// Применяет эффект Mica
pub fn apply_mica(hwnd: HWND, dark: Option<bool>) -> Result<()> {
    if let Some(dark) = dark {
        unsafe {
            let dark_mode = if dark { 1 } else { 0 };
            let _ = DwmSetWindowAttribute(
                hwnd,
                DWMWA_USE_IMMERSIVE_DARK_MODE,
                &dark_mode as *const _ as *const _,
                std::mem::size_of::<i32>() as u32,
            );
        }
    }

    if is_win11_or_newer() {
        unsafe {
            let value = 1u32;
            let _ = DwmSetWindowAttribute(
                hwnd,
                DWMWA_MICA_EFFECT,
                &value as *const _ as *const _,
                std::mem::size_of::<u32>() as u32,
            );
        }
    } else {
        return Err("Эффект Mica поддерживается только на Windows 11".into());
    }
    Ok(())
}

/// Очищает эффект Mica
pub fn clear_mica(hwnd: HWND) -> Result<()> {
    if is_win11_or_newer() {
        unsafe {
            let value = 0u32;
            let _ = DwmSetWindowAttribute(
                hwnd,
                DWMWA_MICA_EFFECT,
                &value as *const _ as *const _,
                std::mem::size_of::<u32>() as u32,
            );
        }
    } else {
        return Err("Эффект Mica поддерживается только на Windows 11".into());
    }
    Ok(())
}

/// Применяет эффект Tabbed (вкладок)
pub fn apply_tabbed(hwnd: HWND, dark: Option<bool>) -> Result<()> {
    if let Some(dark) = dark {
        unsafe {
            let dark_mode = if dark { 1 } else { 0 };
            let _ = DwmSetWindowAttribute(
                hwnd,
                DWMWA_USE_IMMERSIVE_DARK_MODE,
                &dark_mode as *const _ as *const _,
                std::mem::size_of::<i32>() as u32,
            );
        }
    }

    if is_win11_newer_build() {
        unsafe {
            let value = DwmSystembackdropType::DwmsbtTabbedwindow as u32;
            let _ = DwmSetWindowAttribute(
                hwnd,
                DWMWA_SYSTEMBACKDROP_TYPE,
                &value as *const _ as *const _,
                std::mem::size_of::<u32>() as u32,
            );
        }
    } else {
        return Err(
            "Эффект Tabbed поддерживается только на Windows 11 сборки 22523 и новее".into(),
        );
    }
    Ok(())
}

/// Очищает эффект Tabbed
pub fn clear_tabbed(hwnd: HWND) -> Result<()> {
    if is_win11_newer_build() {
        unsafe {
            let value = DwmSystembackdropType::DwmsbtDisable as u32;
            let _ = DwmSetWindowAttribute(
                hwnd,
                DWMWA_SYSTEMBACKDROP_TYPE,
                &value as *const _ as *const _,
                std::mem::size_of::<u32>() as u32,
            );
        }
    } else {
        return Err(
            "Эффект Tabbed поддерживается только на Windows 11 сборки 22523 и новее".into(),
        );
    }
    Ok(())
}

/// Функции для работы с эффектами через tauri::Window или WebviewWindow
/// Применяет эффект к окну согласно настройкам
pub fn apply_effect(window: &Window, settings: EffectSettings) -> Result<()> {
    #[cfg(target_os = "windows")]
    {
        if let Ok(hwnd) = window.hwnd() {
            log::info!(
                "Применение эффекта {:?} с цветом {:?}",
                settings.effect_type,
                settings.color
            );

            // Преобразуем цвет в RGBA
            let rgba_color = settings.color.to_rgba();

            match settings.effect_type {
                WindowEffect::Blur => {
                    apply_blur(hwnd, Some(rgba_color.to_tuple()))?;
                }
                WindowEffect::Acrylic => {
                    apply_acrylic(hwnd, Some(rgba_color.to_tuple()))?;
                }
                WindowEffect::Mica => {
                    apply_mica(hwnd, Some(settings.dark_mode))?;
                }
                WindowEffect::Tabbed => {
                    apply_tabbed(hwnd, Some(settings.dark_mode))?;
                }
                WindowEffect::None => {
                    clear_effect(window)?;
                }
            }
        }
    }

    Ok(())
}

/// Удаляет все эффекты с окна
pub fn clear_effect(window: &Window) -> Result<()> {
    #[cfg(target_os = "windows")]
    if let Ok(hwnd) = window.hwnd() {
        let _ = clear_blur(hwnd);
        let _ = clear_acrylic(hwnd);
        let _ = clear_mica(hwnd);
        let _ = clear_tabbed(hwnd);
    }

    Ok(())
}

/// Таури-команда для установки эффекта окна
#[command]
pub fn set_window_effect(window: Window, settings: EffectSettings) -> Result<()> {
    apply_effect(&window, settings)
}

/// Таури-команда для простой установки эффекта окна по имени
#[command]
pub fn set_simple_effect(
    window: Window,
    effect_type: String,
    color_str: Option<String>,
) -> Result<()> {
    let effect = match effect_type.to_lowercase().as_str() {
        "blur" => WindowEffect::Blur,
        "acrylic" => WindowEffect::Acrylic,
        "mica" => WindowEffect::Mica,
        "tabbed" => WindowEffect::Tabbed,
        "none" => WindowEffect::None,
        _ => return Err(format!("Неизвестный тип эффекта: {}", effect_type)),
    };

    // Если передан цвет в формате строки, пытаемся его распарсить
    let color = if let Some(color_str) = color_str {
        if color_str.starts_with("oklch") {
            // Формат: oklch(0.7, 0.2, 180, 200)
            let parts: Vec<&str> = color_str
                .trim_start_matches("oklch(")
                .trim_end_matches(')')
                .split(',')
                .map(|s| s.trim())
                .collect();

            if parts.len() >= 3 {
                let l = parts[0].parse::<f32>().unwrap_or(0.5);
                let c = parts[1].parse::<f32>().unwrap_or(0.1);
                let h = parts[2].parse::<f32>().unwrap_or(240.0);
                let a = if parts.len() > 3 {
                    parts[3].parse::<u8>().unwrap_or(255)
                } else {
                    255
                };

                ColorType::Oklch(OklchColor::new(l, c, h, a))
            } else {
                ColorType::default()
            }
        } else if color_str.starts_with("rgba") {
            // Формат: rgba(255, 100, 50, 200)
            let parts: Vec<&str> = color_str
                .trim_start_matches("rgba(")
                .trim_end_matches(')')
                .split(',')
                .map(|s| s.trim())
                .collect();

            if parts.len() >= 3 {
                let r = parts[0].parse::<u8>().unwrap_or(0);
                let g = parts[1].parse::<u8>().unwrap_or(0);
                let b = parts[2].parse::<u8>().unwrap_or(0);
                let a = if parts.len() > 3 {
                    parts[3].parse::<u8>().unwrap_or(255)
                } else {
                    255
                };

                ColorType::Rgba(RgbaColor::new(r, g, b, a))
            } else {
                ColorType::default()
            }
        } else {
            ColorType::default()
        }
    } else {
        ColorType::default()
    };

    let settings = EffectSettings {
        effect_type: effect,
        color,
        dark_mode: true,
    };

    apply_effect(&window, settings)
}

/// Таури-команда для очистки всех эффектов окна
#[command]
pub fn clear_window_effect(window: Window) -> Result<()> {
    clear_effect(&window)
}

/// Таури-команда для применения градиентной анимации эффекта
#[command]
pub fn animate_window_effect(window: Window, config: AnimationConfig) -> Result<()> {
    let handle = window.clone();

    // Запускаем анимацию в отдельном потоке
    std::thread::spawn(move || {
        let start_time = std::time::Instant::now();
        let duration = std::time::Duration::from_millis(config.duration_ms as u64);

        for _step in 0..config.steps {
            let elapsed = start_time.elapsed();
            if elapsed >= duration {
                break;
            }

            // Вычисляем прогресс (0.0 - 1.0)
            let progress = elapsed.as_secs_f32() / duration.as_secs_f32();

            // Применяем функцию сглаживания
            let eased_progress = match config.easing {
                EasingType::Linear => progress,
                EasingType::EaseIn => progress * progress,
                EasingType::EaseOut => 1.0 - (1.0 - progress) * (1.0 - progress),
                EasingType::EaseInOut => {
                    if progress < 0.5 {
                        2.0 * progress * progress
                    } else {
                        1.0 - (-2.0 * progress + 2.0).powi(2) / 2.0
                    }
                }
            };

            // Создаем промежуточный цвет
            let color = match (&config.from_color, &config.to_color) {
                (ColorType::Rgba(from), ColorType::Rgba(to)) => {
                    ColorType::Rgba(RgbaColor::lerp(from, to, eased_progress))
                }
                (ColorType::Oklch(from), ColorType::Oklch(to)) => {
                    ColorType::Oklch(OklchColor::lerp(from, to, eased_progress))
                }
                (ColorType::Rgba(from), ColorType::Oklch(to)) => {
                    // Преобразуем RGBA в RGBA для интерполяции
                    ColorType::Rgba(RgbaColor::lerp(from, &to.to_rgba(), eased_progress))
                }
                (ColorType::Oklch(from), ColorType::Rgba(to)) => {
                    // Преобразуем OKLCH в RGBA для интерполяции
                    ColorType::Rgba(RgbaColor::lerp(&from.to_rgba(), to, eased_progress))
                }
            };

            // Применяем эффект с новым цветом
            let settings = EffectSettings {
                effect_type: WindowEffect::Acrylic, // Наиболее заметный эффект для анимации
                color,
                dark_mode: true,
            };

            if let Err(e) = apply_effect(&handle, settings) {
                log::error!("Ошибка анимации: {}", e);
                break;
            }

            // Пауза между кадрами
            std::thread::sleep(std::time::Duration::from_millis(
                duration.as_millis() as u64 / config.steps as u64,
            ));
        }

        // Применяем конечный эффект
        let final_settings = EffectSettings {
            effect_type: WindowEffect::Acrylic,
            color: config.to_color,
            dark_mode: true,
        };

        if let Err(e) = apply_effect(&handle, final_settings) {
            log::error!("Ошибка применения конечного эффекта: {}", e);
        }
    });

    Ok(())
}

// Вспомогательные функции

fn get_function_impl(library: &str, function: &str) -> FARPROC {
    let library_name = format!("{}\0", library);
    let function_name = format!("{}\0", function);

    unsafe {
        if let Ok(module) = LoadLibraryA(PCSTR(library_name.as_ptr())) {
            GetProcAddress(module, PCSTR(function_name.as_ptr()))
        } else {
            None
        }
    }
}

unsafe fn set_window_composition_attribute(
    hwnd: HWND,
    accent_state: AccentState,
    color: Option<Color>,
) {
    // Тип функции SetWindowCompositionAttribute
    type SetWindowCompositionAttributeFn =
        unsafe extern "system" fn(HWND, *mut WindowCompositionAttribData) -> i32;

    // Получаем функцию из user32.dll
    if let Some(func_ptr) = get_function_impl("user32.dll", "SetWindowCompositionAttribute") {
        let set_window_composition_attribute = unsafe {
            std::mem::transmute::<
                unsafe extern "system" fn() -> isize,
                SetWindowCompositionAttributeFn,
            >(func_ptr)
        };
        let mut color = color.unwrap_or((0, 0, 0, 0));

        // Акрил не работает с нулевой альфой
        let is_acrylic = accent_state == AccentState::AccentEnableAcrylicblurbehind;
        if is_acrylic && color.3 == 0 {
            color.3 = 1;
        }

        let mut policy = AccentPolicy {
            accent_state: accent_state as u32,
            accent_flags: if is_acrylic { 0 } else { 2 },
            gradient_color: (color.0 as u32)
                | ((color.1 as u32) << 8)
                | ((color.2 as u32) << 16)
                | ((color.3 as u32) << 24),
            animation_id: 0,
        };

        let mut data = WindowCompositionAttribData {
            attrib: 0x13, // WCA_ACCENT_POLICY
            pv_data: &mut policy as *mut _ as *mut c_void,
            cb_data: std::mem::size_of_val(&policy),
        };

        let _ = set_window_composition_attribute(hwnd, &mut data as *mut _);
    }
}

fn is_win10_or_newer() -> bool {
    let v = windows_version::get_os_version();
    v.dwMajorVersion >= 10
}

fn is_win11_or_newer() -> bool {
    let v = windows_version::get_os_version();
    v.dwMajorVersion >= 10 && v.dwBuildNumber >= 22000
}

fn is_win11_newer_build() -> bool {
    let v = windows_version::get_os_version();
    v.dwMajorVersion >= 10 && v.dwBuildNumber >= 22523
}

// Модуль для определения версии Windows
mod windows_version {
    use windows::Win32::System::SystemInformation::{GetVersionExA, OSVERSIONINFOA};

    pub fn get_os_version() -> OSVERSIONINFOA {
        let mut version_info = OSVERSIONINFOA {
            dwOSVersionInfoSize: std::mem::size_of::<OSVERSIONINFOA>() as u32,
            dwMajorVersion: 0,
            dwMinorVersion: 0,
            dwBuildNumber: 0,
            dwPlatformId: 0,
            szCSDVersion: [0; 128],
        };

        unsafe {
            let _ = GetVersionExA(&mut version_info as *mut _);
        }

        version_info
    }
}
