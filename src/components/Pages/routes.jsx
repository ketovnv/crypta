			import React, { lazy, Suspense } from "react";

const Home = lazy(() => import("./Home")); // Относительные пути к вашим компонентам
const Balance = lazy(() => import("./Balance"));
const Approve = lazy(() => import("./Approve"));
const Transactions = lazy(() => import("./Transactions"));
import {
  IoApertureSharp,
  IoWallet,
  IoFileTrayFullSharp,
  IoSettings,
  IoLogoReact,
} from "react-icons/io5";
import Options from "./Options";

export const ROUTE_URLS = {
  WALLET: "/",
  BALANCE: "/balance  ",
  APPROVE: "/approve",
  TRANSACTIONS: "/transactions",
  // SETTINGS : '/settings',
};

export const ROUTES = {
  WALLET: {
    title: "Кошелёк",  
    icon: <IoWallet size={24} />,
    animation: "fade",
    animationDuration: "LONG_ANIMATION_DURATION", // Замените на реальные значения
  },
  BALANCE: {
    title: "Токены",
    icon: <IoApertureSharp size={24} />,
    animation: "slide-up",
    animationDuration: "LONG_ANIMATION_DURATION",
  },
  APPROVE: {
    title: "Одобрение", 
    icon: <IoLogoReact size={24} />,
    animation: "slide-down",
    animationDuration: "LONG_ANIMATION_DURATION",
  },
  TRANSACTIONS: {
    title: "Транзакции", 
    icon: <IoFileTrayFullSharp size={24} />,
    animation: "slide-left",
    animationDuration: "LONG_ANIMATION_DURATION",
  },
  SETTINGS: {
    title: "Настройки",
    element: <Options />,
    icon: <IoSettings size={24} />,
    animation: "fade",
  },
};

// Обновленный routes (с lazy-загрузкой):
export const ROUTES_LAZY = {
  WALLET: {
    ...ROUTES.WALLET,
    element: Home, // Теперь Home - это функция, возвращающая Promise
  },
  BALANCE: {
    ...ROUTES.BALANCE,
    element: Balance,
  },
  APPROVE: {
    ...ROUTES.APPROVE,
    element: Approve ,
  },
  TRANSACTIONS: {
    ...ROUTES.TRANSACTIONS,
    element: Transactions,
  },
  SETTINGS: {
    ...ROUTES.SETTINGS,
    element: Options
  },
};

// ... (другие маршруты)
