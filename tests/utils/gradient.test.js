import { test, expect } from 'bun:test';
import chalk from 'chalk';
import gradient from 'gradient-string';

// Функция для генерации градиентной строки
function createGradientString(text, colors) {
    return gradient(colors)(text);
}

// Тесты
test('Gradient string generation', () => {
    const inputText = 'Test Gradient';
    const colors = ['red', 'yellow', 'green'];
    const result = createGradientString(inputText, colors);

    console.log(chalk.blue('Generated Gradient:'), result);
    expect(result).toContain('\u001b');
});

test('Gradient string length consistency', () => {
    const inputText = 'Consistency Check';
    const colors = ['cyan', 'magenta'];
    const result = createGradientString(inputText, colors);

    console.log(chalk.green('Checking length:'), result.length);
    expect(result.length).toBeGreaterThan(inputText.length);
});

test('Gradient string with empty input', () => {
    const inputText = '';
    const colors = ['#FF0000', '#00FF00'];
    const result = createGradientString(inputText, colors);

    console.log(chalk.yellow('Result for empty input:'), `'${result}'`);
    expect(result).toBe('');
});
