import { action, makeAutoObservable } from "mobx";
import { logger } from "@stores/logger.js";
import {walletStore} from "@stores/wallet.js";

const EVENTS = {
  INITIALIZE: {
    title: "Добро пожаловать!",
    message: "Приложение готово к работе",
  },
  MODAL_OPEN: "empty",
  MODAL_CLOSE: "empty",
  SOCIAL_LOGIN_STARTED: "empty",
  SOCIAL_LOGIN_REQUEST_USER_DATA: "empty",
  DISCONNECT_SUCCESS: {
    title: "Кошелёк успешно отключён",
    message: "Подключайтесь к доступным кошелькам",
  },
  SOCIAL_LOGIN_CANCELED: {
    title: "Социальный аккаунт отключен",
    message: ["provider"],
  },
  SOCIAL_LOGIN_SUCCESS: {
    title: "Подключён cоциальный аккаунт",
    message: ["provider"],
  },
  CONNECT_SUCCESS: {
    title: "Подключён кошелёк",
    message: ["name"],
  },
};

class EventsStore {
  state = {};

  constructor() {
    makeAutoObservable(this, {
      addEvent: action,
      setCurrentState: action,
    });
  }

  get eventsList() {
    return this.events;
  }

  get getState() {
    return this.state;
  }

  getErrors() {
    return this.eventsList
      .filter((e) => e.reportedErrors !== undefined)
      .map((e) => {
        e.time = new Date(e.timestamp).toLocaleString();
        return e;
      });
  }

  addEvent(event) {
    console.log(event?.data?.event, JSON.stringify(event?.data?.properties));
    if(event?.data?.event === "INITIALIZE") walletStore.setChains(event?.data?.properties?.networks)

    if (EVENTS[event?.data?.event] === "empty")
      return { title: null, message: null };

    if (
      EVENTS[event?.data?.event]?.message &&
      logger.whatIs(EVENTS[event?.data?.event]?.message) !== "String"
    ) {
      const property = EVENTS[event.data.event].message[0];
      const propertyValue = event?.data?.properties[property] ?? "";
      if (propertyValue)
        EVENTS[event.data.event].message = propertyValue.toUpperCase();
    }

    return EVENTS[event?.data?.event]?.title
      ? {
          title: EVENTS[event.data.event].title,
          message: EVENTS[event.data.event].message,
        }
      : {
          title: event?.data?.event,
          message: event?.data?.properties,
          jsonMessage: true,
        };
  }

  setCurrentState(state) {
    this.state = state;
  }
}

export const eventsStore = new EventsStore();
