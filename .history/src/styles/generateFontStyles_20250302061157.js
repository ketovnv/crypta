// scripts/generateFontStyles.js
import fs from "fs";
import path from 'path';

import {fontFamilies} from './fontFamilies.js';

// Базовые стили для контейнера и текста
const baseStyles = `
.container {
  padding: 16px;
  margin-bottom: 8px;
  border: 1px solid #333;
  border-radius: 8px;
}`;

// Генерация стилей для каждого шрифта
const fontStyles = fontFamilies.map((font, index) =>
    `.font${index} {
  font-family: "${font}" !important;
}`
).join('\n');

// Объединяем базовые и шрифтовые стили
const cssContent = baseStyles + '\n' + fontStyles;

// Исправленный путь - записываем файл в тот же каталог, где находится скрипт


const outputPath = path.resolve('C:\\projects\\crypta\\src\\components\\logger\\fonts.module.css')


// Создаем директорию, если её нет
const outputDir = path.dirname(outputPath);
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}


fs.writeFileSync(outputPath, cssContent);


console.log(`CSS-модуль для ${fontFamilies.length} шрифтов создан: ${outputPath}`);