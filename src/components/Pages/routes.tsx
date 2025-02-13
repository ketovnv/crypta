import Layout             from '../Layout';
import Home               from './Home';
import Options            from './Options';
import Network            from './Network';
import Wallet             from './Wallet';
import Transactions             from './Transactions';
import ErrorNotifications from './ErrorNotifications';
import { IoHome,IoWallet,IoFileTrayFullSharp,IoSettings,IoLogoReact } from "react-icons/io5";// Замените на вашу


export enum AppRoutes {
    HOME = '/',
    WALLET = '/wallet',
    TRANSACTIONS = '/transactions',
    SETTINGS = '/settings',
    NETWORK = '/network'
}


export interface RouteMeta {
    title: string;
    icon?: React.ReactNode;
    animation?: string;
}
// Тип для объекта маршрутов
export type Routes = {
    [key in AppRoutes]: string;
};

// Тип для метаданных маршрутов
export type RoutesMetadata = {
    [key in AppRoutes]: RouteMeta;
};



export const ROUTES: Routes = {
    [AppRoutes.HOME]: '/',
    [AppRoutes.WALLET]: '/wallet',
    [AppRoutes.TRANSACTIONS]: '/transactions',
    [AppRoutes.SETTINGS]: '/settings',
    [AppRoutes.NETWORK]: '/network'
};

// Метаданные маршрутов
export const ROUTE_META: RoutesMetadata = {
    [AppRoutes.HOME]: {
        title: 'Главная',
        icon: <IoHome size={24} />,
        animation: 'slide-right'
    },
    [AppRoutes.WALLET]: {
        title: 'Кошелек',
        icon: <IoWallet size={24} />,
        animation: 'slide-up'
    },
    [AppRoutes.TRANSACTIONS]: {
        title: 'Транзакции',
        icon: <IoFileTrayFullSharp  size={24} />,
        animation: 'slide-left'
    },
    [AppRoutes.SETTINGS]: {
        title: 'Настройки',
        icon: <IoSettings size={24} />,
        animation: 'fade'
    },
    [AppRoutes.NETWORK]: {
        title: 'Сеть',
        icon: <IoLogoReact size={24} />,
        animation: 'slide-down'
    }
};


export const routes = [
    {
        path: "/",
        element: <Layout />,
        errorElement: <ErrorNotifications />,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: "options",
                element: <Options />,
            },
            {
                path: "wallet",
                element: <Wallet />,
            },
            {
                path: "network",
                element: <Network />,
            },
            {
                path: "Transactions",
                element: <Transactions />,
            },
        ],
    },
];