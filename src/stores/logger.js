import { makeAutoObservable, runInAction } from 'mobx';

// Предопределенные стили для разных типов логов
const LOG_STYLES = {
    info: 'color: #2196F3; font-weight: bold;',
    success: 'color: #4CAF50; font-weight: bold;',
    warning: 'color: #FFC107; font-weight: bold;',
    error: 'color: #F44336; font-weight: bold;',
    debug: 'color: #9C27B0; font-weight: bold;',
    system: 'color: #607D8B; font-weight: bold;',
};

// Утилита для форматирования времени
const formatTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('ru-RU', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        fractionalSecondDigits: 3
    });
};

class LoggerStore {
    logs = [];
    isEnabled = true;
    // logLevel = 'info'; // 'debug' | 'info' | 'warning' | 'error'
    groupStack = [];

    constructor() {
        makeAutoObservable(this);

        // Перехватываем стандартные методы консоли
        // this.interceptConsoleMethods();
    }

    // Основной метод логирования
    log = (type, message, data = null, style = null) => {
        if (!this.isEnabled
            // || !this.shouldLog(type)
        ) return;

        const timestamp = formatTime();
        const logEntry = {
            id: Date.now(),
            timestamp,
            type,
            message,
            data,
            style: style || LOG_STYLES[type] || LOG_STYLES.info
        };

        runInAction(() => {
            this.logs.push(logEntry);
        });

        // Применяем стили в консоли
        if (data) {
            console.log(
                `%c[${timestamp}] ${message}`,
                logEntry.style,
                '\n',
                data
            );
        } else {
            console.log(`%c[${timestamp}] ${message}`, logEntry.style);
        }
    };

    // Методы для разных типов логов
    info = (message, data) => this.log('info', message, data);
    success = (message, data) => this.log('success', message, data);
    warning = (message, data) => this.log('warning', message, data);
    error = (message, data) => this.log('error', message, data);
    debug = (message, data) => this.log('debug', message, data);

    // Группировка логов
    group = (label) => {
        if (!this.isEnabled) return;

        console.group(`%c${label}`, LOG_STYLES.system);
        this.groupStack.push(label);

        this.log('system', `Начало группы: ${label}`);
    };

    groupEnd = () => {
        if (!this.isEnabled || this.groupStack.length === 0) return;

        const label = this.groupStack.pop();
        console.groupEnd();

        this.log('system', `Конец группы: ${label}`);
    };

    // Измерение времени выполнения
    time = (label) => {
        if (!this.isEnabled) return;

        console.time(label);
        this.log('system', `Начало замера времени: ${label}`);
    };

    timeEnd = (label) => {
        if (!this.isEnabled) return;

        console.timeEnd(label);
        this.log('system', `Конец замера времени: ${label}`);
    };

    // Логирование JSON с форматированием
    logJSON = (label, data) => {
        const formattedJSON = JSON.stringify(data, null, 2);
        this.log('info', label, formattedJSON, 'color: #333; background: #f4f4f4; padding: 5px; border-radius: 3px;');
    };

    // Логирование таблицы
    table = (data, columns) => {
        if (!this.isEnabled) return;

        console.table(data, columns);
        this.log('system', 'Таблица данных', data);
    };

    // Очистка истории логов
    clearLogs = () => {
        runInAction(() => {
            this.logs = [];
        });
        console.clear();
    };

    // Включение/выключение логирования
    setEnabled = (enabled) => {
        runInAction(() => {
            this.isEnabled = enabled;
        });
    };

    // Установка уровня логирования
    // setLogLevel = (level) => {
    //     runInAction(() => {
    //         this.logLevel = level;
    //     });
    // };

    // Проверка необходимости логирования для данного уровня
    shouldLog = (type) => {
        const levels = ['debug', 'info', 'warning', 'error'];
        const currentLevel = levels.indexOf(this.logLevel);
        const messageLevel = levels.indexOf(type);
        return messageLevel >= currentLevel;
    };

    // Перехват стандартных методов консоли
    // interceptConsoleMethods = () => {
    //     const originalConsole = { ...console };
    //
    //     // Перехватываем основные методы
    //     ['log', 'info', 'warn', 'error', 'debug'].forEach(method => {
    //         console[method] = (...args) => {
    //             if (this.isEnabled) {
    //                 originalConsole[method](...args);
    //                 this.log(method === 'warn' ? 'warning' : method, args[0], args.slice(1));
    //             }
    //         };
    //     });
    // };

    // Экспорт логов
    exportLogs = () => {
        const exportData = {
            logs: this.logs,
            exportTime: new Date().toISOString(),
            // logLevel: this.logLevel
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `logs-${new Date().toISOString()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };
}

export const loggerStore = new LoggerStore();