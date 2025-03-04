import Layout from '../Layout';
import Options from './Options';
import Network from './Network';
import Tokens from './Tokens';
import Transactions from './Transactions';
import ErrorNotifications from './ErrorNotifications';
import {IoApertureSharp, IoWallet, IoFileTrayFullSharp, IoSettings, IoLogoReact} from "react-icons/io5";
import Home from "./Home/Home";

// Замените на вашу


export enum AppRoutes {
    WALLET = '/',
    TOKENS = '/tokens',
    TRANSACTIONS = '/transactions',
    // SETTINGS = '/settings',
    NETWORK = '/network'
}


export interface RouteMeta {
    title: string;
    icon?: React.ReactNode;
    animation?: string;
    animationDuration?: string;
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
    [AppRoutes.WALLET]: '/',
    [AppRoutes.TOKENS]: '/tokens',
    [AppRoutes.TRANSACTIONS]: '/transactions',
    // [AppRoutes.SETTINGS]: '/settings',
    [AppRoutes.NETWORK]: '/network'
};

// Метаданные маршрутов
export const ROUTE_META: RoutesMetadata = {
    [AppRoutes.WALLET]: {
        title: 'Кошелёк',
        icon: <IoWallet size={24} />,
        animation: 'fade',
        animationDuration: 'LONG_ANIMATION_DURATION'
    },
    [AppRoutes.TOKENS]: {
        title: 'Токены',
        icon: <IoApertureSharp size={24} />,
        animation: 'slide-up',
        animationDuration: 'LONG_ANIMATION_DURATION'
    },
    [AppRoutes.TRANSACTIONS]: {
        title: 'Транзакции',
        icon: <IoFileTrayFullSharp size={24} />,
        animation: 'slide-left',
        animationDuration: 'LONG_ANIMATION_DURATION'
    },
    // [AppRoutes.SETTINGS]: {
    //     title: 'Настройки',
    //     icon: <IoSettings size={24} />,
    //     animation: 'fade'
    // },
    [AppRoutes.NETWORK]: {
        title: 'Сеть',
        icon: <IoLogoReact size={24} />,
        animation: 'slide-down',
        animationDuration: 'LONG_ANIMATION_DURATION'
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
                element: <Home/>,
            },
            {
                path: "settings",
                element: <Options />,
            },
            {
                path: "Tokens",
                element: <Tokens/>,
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