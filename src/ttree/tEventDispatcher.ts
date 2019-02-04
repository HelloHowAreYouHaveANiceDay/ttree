class EventDispatcher {
  private listeners = {};
  constructor() {}

  addEventListener: (a: string, b: Function) => void = (type, listener) => {
    if (this.listeners[type] === undefined) {
      this.listeners[type] = [];
    }

    if (this.listeners[type].indexOf(listener) === -1) {
      this.listeners[type].push(listener);
    }
  };

  hasEventListener: (a: string, b: Function) => void = (type, listener) => {
    const listeners = this.listeners;

    return (
      listeners[type] !== undefined && listeners[type].indexOf(listener) !== -1
    );
  };
}

export default EventDispatcher;
