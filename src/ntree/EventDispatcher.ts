interface dispatchEvent {
  target?: EventDispatcher;
  type: string;
  [key: string]: any;
}

export default class EventDispatcher {
  debug?: boolean = true;
  private listeners = {};
  constructor() {}

  post(msg, pl) {
    if (this.debug) {
      console.log(msg, pl);
    }
  }

  addEventListener: (a: string, b: Function) => void = (type, listener) => {
    if (this.listeners[type] === undefined) {
      this.listeners[type] = [];
    }

    if (this.listeners[type].indexOf(listener) === -1) {
      this.listeners[type].push(listener);
    }
  };

  hasEventListener: (a: string, b: Function) => void = (type, listener) => {
    return (
      this.listeners[type] !== undefined &&
      this.listeners[type].indexOf(listener) !== -1
    );
  };

  removeEventListener: (a: string, b: Function) => void = (type, listener) => {
    const listenerArray = this.listeners[type];

    if (listenerArray !== undefined) {
      const index = listenerArray.indexOf(listener);

      if (index !== -1) {
        listenerArray.splice(index, 1);
      }
    }
  };

  removeEventListeners(type: string) {
    if (this.listeners[type] !== undefined) {
      delete this.listeners[type];
    }
  }

  dispatchEvent(event: dispatchEvent) {
    const listenerArray = this.listeners[event.type];

    if (listenerArray !== undefined) {
      event.target = this;

      for (let listener of listenerArray.slice(0)) {
        listener.call(this, event);
      }
    }
  }
}
