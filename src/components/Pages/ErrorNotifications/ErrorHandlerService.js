// services/ErrorHandlerService.js
import { errorStore } from '@/stores/errors';

class ErrorHandlerService {
    initialize() {
        console.log('Initializing error handlers');

        this.originalConsoleError = console.error;
        console.error = (...args) => {
            const errorMessage = args.join(' ');

            if (errorMessage.includes('Lockdown failed')) {
                errorStore.addError({
                                        message: 'Lockdown Error',
                                        type: 'SYSTEM',
                                        details: errorMessage,
                                        level: 'warning'
                                    });
            }

            if (errorMessage.includes('metamask-provider')) {
                errorStore.addError({
                                        message: 'MetaMask Provider Error',
                                        type: 'PROVIDER',
                                        details: errorMessage,
                                        level: 'warning'
                                    });
            }

            this.originalConsoleError.apply(console, args);
        };

        window.onerror = (message, source, lineno, colno, error) => {
            errorStore.addError({
                                    message: String(message),
                                    type: 'RUNTIME',
                                    details: `${source} (${lineno}:${colno})`,
                                    level: 'error'
                                });
            return false;
        };
    }
}

export const errorHandlerService = new ErrorHandlerService();