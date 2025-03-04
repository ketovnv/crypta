import type { AccountType, AccountControllerState } from "@reown/appkit/react";
import type { CaipAddress } from "@reown/appkit-common";
import { action, makeAutoObservable } from "mobx";
import { PublicStateControllerState } from "@reown/appkit";

interface event {
  timestamp: number;
  reportedErrors: Record<string, boolean>;
  data: import("@reown/appkit-core").Event;
}

class EventsStore {
  private events: event[] = [];

  private state: PublicStateControllerState;

  constructor() {
    makeAutoObservable(this, {
      addEvent: action,
    });
  }

  get eventsList() {
    return this.events.map((e) => {
      e.timestamp = new Date(e.timestamp).getTime();
      return e;
    });
  }

  getErrors() {
    return this.eventsList
      .filter((e) => e.reportedErrors !== undefined)
      .map((e) => {
        e.timestamp = new Date(e.timestamp).getTime();
        return e;
      });
  }

  addEvent(event: event) {
    this.events.push(event);
  }

  addState(state: PublicStateControllerState) {
    this.state = state;
  }

  getState() {
    return this.state;
  }
}

export const eventsStore = new EventsStore();
