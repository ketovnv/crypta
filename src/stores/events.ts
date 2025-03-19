import { action, makeAutoObservable } from "mobx";
import {Notifications} from "@mantine/notifications";

import { PublicStateControllerState } from "@reown/appkit";



class EventsStore {

  private state: PublicStateControllerState;


  constructor() {
    makeAutoObservable(this, {
      addEvent: action,
      setCurrentState: action,
    });
  }

  // get eventsList() {
  //   return this.events;
  // }

  // getErrors() {
  //   return this.eventsList
  //     .filter((e) => e.reportedErrors !== undefined)
  //     .map((e) => {
  //       e.time = new Date(e.timestamp).toLocaleString();
  //       return e;
  //     });
  // }

  addEvent(event) {
    // console.warn("Event", JSON.stringify(event));
  }

  setCurrentState(state: PublicStateControllerState) {
    this.state = state;
  }

  getState() {
    return this.state;
  }
}

export const eventsStore = new EventsStore();
