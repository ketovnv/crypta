import { test, expect, beforeEach,toBe } from 'bun:test';
import { uiStore } from '../../src/stores/ui';
import  {animation}  from '../../src/stores/animation';

// Очистка localStorage перед каждым тестом
beforeEach(() => {
    localStorage.clear();
    uiStore.setColorScheme('dark'); // начальное состояние
});

test('UiStore - initial colorScheme should be dark', () => {
    expect(uiStore.colorScheme).toBe('dark');
});

test('UiStore - setColorScheme changes the scheme correctly', () => {
    uiStore.setColorScheme('light');
    expect(uiStore.colorScheme).toBe('light');
    expect(localStorage.getItem('app-color-scheme')).toBe('light');
});

test('UiStore - toggleColorScheme toggles scheme', () => {
    uiStore.toggleColorScheme();
    expect(uiStore.colorScheme).toBe('light');

    uiStore.toggleColorScheme();
    expect(uiStore.colorScheme).toBe('dark');
});
