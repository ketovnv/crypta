import {createContext, useContext, useMemo} from 'react';
import { rootStore } from './root';


export const StoreContext = createContext(null);

export const useStores = () => {
    const context = useContext(StoreContext);
    if (!context) {
        throw new Error('useStores must be used within StoreProvider');
    }
    return context;
};

// Создаем провайдер
export const StoreProvider = ({children}) => {
    const store = useMemo(() => rootStore(), []);

    return (
        <StoreContext.Provider value={store}>
            {children}
        </StoreContext.Provider>
    );
};