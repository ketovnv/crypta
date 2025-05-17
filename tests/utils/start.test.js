import { test, expect } from 'bun:test';
import chalk from 'chalk';
import gradient from 'gradient-string';

// Примерная функция, которая возвращает градиентную строку
function createGradientString(text, colors) {
    return gradient(colors)(text);
}


// Тест для проверки длины строки (важно при стилизованном выводе)
test('Gradient string length consistency', () => {
    const inputText = 'Consistency Check';
    const colors = ['cyan', 'magenta'];

    const result = createGradientString(inputText, colors);

    console.log(chalk.green('Checking length:'), result.length);

    // ANSI-коды удлиняют строку, поэтому проверка идёт на превышение исходной длины
    expect(result.length).toBeGreaterThan(inputText.length);
});

// Проверка границ (пустая строка)
test('Gradient string with empty input', () => {
    const inputText = '';
    const colors = ['#FF0000', '#00FF00'];

    const result = createGradientString(inputText, colors);

    console.log(chalk.yellow('Result for empty input:'), `'${result}'`);

    expect(result).toBe('');
});
