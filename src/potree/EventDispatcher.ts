import Action from "./Action";
import { Annotation } from "./Annotation";
import Scene from "./Scene";
import Volume from "./Volume";
import { PointCloud, Camera } from "three";
import Measurement from "./Measurement";
import Profile from "./Profile";
import Viewer from "./Viewer";

interface EventDispatcher {
  _listeners: any;
}

interface dispatchEvent {
  action?: Action;
  icon?: string;
  oldIcon?: string;
  type?: string;
  target?: EventDispatcher;
  annotation?: Annotation;
  scene?: Scene;
  pointcloud?: PointCloud;
  volume?: Volume;
  measurement?: Measurement;
  profile?: Profile;
  viewer?: Viewer;
  selection?: any[];
  keyCode?: any;
  event?: Event;
  oldSelection?: any[];
  oldScene?: Scene;
  speed?: number;
  value?: number;
  previous?: Camera;
  camera?: Camera;
  delta?: any;
  timestamp?: any;
}

class EventDispatcher {
  constructor() {
    this._listeners = {};
  }

  addEventListener: (a: string, b: Function) => void = (type, listener) => {
    const listeners = this._listeners;

    if (listeners[type] === undefined) {
      listeners[type] = [];
    }

    if (listeners[type].indexOf(listener) === -1) {
      listeners[type].push(listener);
    }
  };

  hasEventListener(type, listener) {
    const listeners = this._listeners;

    return (
      listeners[type] !== undefined && listeners[type].indexOf(listener) !== -1
    );
  }

  removeEventListener(type, listener) {
    let listeners = this._listeners;
    let listenerArray = listeners[type];

    if (listenerArray !== undefined) {
      let index = listenerArray.indexOf(listener);

      if (index !== -1) {
        listenerArray.splice(index, 1);
      }
    }
  }

  removeEventListeners(type) {
    if (this._listeners[type] !== undefined) {
      delete this._listeners[type];
    }
  }

  dispatchEvent(event: dispatchEvent) {
    let listeners = this._listeners;
    let listenerArray = listeners[event.type];

    if (listenerArray !== undefined) {
      event.target = this;

      for (let listener of listenerArray.slice(0)) {
        listener.call(this, event);
      }
    }
  }
}

export default EventDispatcher;
