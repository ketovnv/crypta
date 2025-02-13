import {makeAutoObservable, runInAction} from 'mobx';

class ErrorStore {
    // Храним активные ошибки в виде Map, где ключ - это уникальный идентификатор ошибки
    errors = new Map();

    // Настройки для разных типов ошибок
    errorConfig = {
        NETWORK: {timeout: 5000, level: 'error'},
        VALIDATION: {timeout: 3000, level: 'warning'},
        AUTH: {timeout: null, level: 'error'}, // null означает, что ошибка не исчезнет автоматически
        BUSINESS: {timeout: 4000, level: 'info'},
        ROUTING: {
            timeout: null, // Ошибки маршрутизации не исчезают автоматически
            level: 'error',
        },
        RUNTIME: { timeout: 5000, level: 'error' },
        PROMISE: { timeout: 5000, level: 'error' },
        SYSTEM: { timeout: 3000, level: 'warning'},
    };

    setupGlobalErrorHandlers() {
        // Перехватываем все ошибки в консоли
        const originalConsoleError = console.error;
        console.error = (...args) => {
            const errorMessage = args.join(' ');

            // Проверяем различные типы ошибок
            if (errorMessage.includes('Lockdown failed')) {
                this.addError({
                                  message: 'Система безопасности: предупреждение',
                                  type: 'SYSTEM',
                                  details: errorMessage,
                                  level: 'warning'
                              });
            } else if (errorMessage.includes('metamask-provider')) {
                this.addError({
                                  message: 'MetaMask: проблема подключения',
                                  type: 'PROVIDER',
                                  details: errorMessage,
                                  level: 'warning'
                              });
            } else if (errorMessage.includes('Could not establish connection')) {
                this.addError({
                                  message: 'Проблема с подключением',
                                  type: 'CONNECTION',
                                  details: errorMessage,
                                  level: 'error'
                              });
            } else if (errorMessage.includes('Lost connection')) {
                this.addError({
                                  message: 'Потеряно соединение с MetaMask',
                                  type: 'METAMASK',
                                  details: errorMessage,
                                  level: 'warning'
                              });
            }

            // Вызываем оригинальный console.error
            originalConsoleError.apply(console, args);
        };

        // Добавляем обработчик необработанных ошибок
        window.onerror = (message, source, lineno, colno, error) => {
            this.addError({
                              message: String(message),
                              type: 'RUNTIME',
                              details: `${source} (${lineno}:${colno})`,
                              stack: error?.stack,
                              level: 'error'
                          });
            return false;
        };

        // Добавляем обработчик для Promise
        window.onunhandledrejection = (event) => {
            this.addError({
                              message: event.reason?.message || 'Необработанная ошибка Promise',
                              type: 'PROMISE',
                              details: event.reason?.stack,
                              level: 'error'
                          });
        };
    }



    constructor() {
        makeAutoObservable(this),
        this.setupGlobalErrorHandlers();
    }





    // Метод для добавления новой ошибки
    addError = (error) => {
        console.log('Adding error:', error);  // Отладка
        const errorId = Date.now().toString();

        try {
            runInAction(() => {
                this.errors.set(errorId, {
                    ...error,
                    id: errorId,
                    timestamp: new Date()
                });
                console.log('Current errors after adding:', this.errors);  // Отладка
            });
        } catch (e) {
            console.error('Failed to add error to store:', e);
        }

        return errorId;
    };


    // Метод для определения типа ошибки
    determineErrorType(error) {
        if (error.type) return error.type; // Если тип уже определен
        if (error.name === 'LockdownError' || error.message?.includes('Lockdown')) {
            return 'SYSTEM';
        }
        if (error.name === 'RoutingError') {
            return 'ROUTING';
        }
        if (error.name === 'NetworkError'||error.message.includes('network')) {
            return 'NETWORK';
        }
        if (error.name === 'ValidationError') {
            return 'VALIDATION';
        }
        if (error.status === 401||error.status === 403) {
            return 'AUTH';
        }
        return 'BUSINESS';
    }

    // Форматирование сообщения об ошибке
    formatErrorMessage(error) {
        if (typeof error === 'string') return error;
        return error.message||'An unexpected error occurred';
    }

    // Удаление ошибки
    removeError = (errorId) => {
        runInAction(() => {
            this.errors.delete(errorId);
            console.log('Error removed:', errorId);  // Отладка
        });
    };

    // Очистка всех ошибок
    clearAllErrors() {
        runInAction(() => {
            this.errors.clear();
        });
    }

    // Геттер для получения массива активных ошибок

    get activeErrors() {
        const errors = Array.from(this.errors.values());
        console.log('Getting active errors:', errors);  // Отладка
        return errors;
    }

    // Геттер для проверки наличия критических ошибок


    handleErrorSideEffects(errorObject) {
        if (errorObject.type === 'ROUTING') {
            // Например, можем логировать ошибки навигации
            if (process.env.NODE_ENV === 'development') {
                console.group('Routing Error');
                console.error(errorObject);
                console.groupEnd();
            }

            // Можем выполнять специфичные действия для разных ошибок
            if (errorObject.message.includes('авторизация')) {
                // Например, перенаправлять на страницу входа
                window.location.href = '/login';
            }
        }
    }

}

export const errorStore = new ErrorStore();

// Добавляем глобальную ссылку для отладки
if (process.env.NODE_ENV === 'development') {
    window._errorStore = errorStore;
}