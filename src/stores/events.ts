import { action, makeAutoObservable } from "mobx";
import { PublicStateControllerState } from "@reown/appkit";

interface EventInterface {
  timestamp: number;
  reportedErrors: Record<string, boolean>;
  data: import("@reown/appkit-core").Event;
  time?: string;
}

class EventsStore {
  private readonly events: EventInterface[] = [];
  private state: PublicStateControllerState;

  constructor() {
    makeAutoObservable(this, {
      addEvent: action,
      setCurrentState: action,
    });
  }

  get eventsList() {
    return this.events
  }

  getErrors() {
    return this.eventsList
      .filter((e) => e.reportedErrors !== undefined)
      .map((e) => {
        e.time = new Date(e.timestamp).toLocaleString();
        return e;
      });
  }

  addEvent(event: EventInterface) {
    this.events.push(event);
  }

  setCurrentState(state: PublicStateControllerState) {
    this.state = state;
  }

  getState() {
    return this.state;
  }
}

export const eventsStore = new EventsStore();
