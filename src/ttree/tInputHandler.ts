import * as THREE from 'three';

import EventDispatcher from './tEventDispatcher';
import Viewer from './tViewer';
import Renderer from '../potree/Renderer';

export default class InputHandler extends EventDispatcher {
  viewer: Viewer = null;
  renderer: Renderer = null;
  domElement: HTMLElement = null;
  enabled: boolean;
  scene: any;
  interactiveScenes: any[] = [];
  interactiveObjects: Set<any> = new Set();
  inputListeners: any[] = [];
  blacklist: Set<any> = new Set();

  drag: any = null;
  mouse: THREE.Vector2 = new THREE.Vector2(0, 0);

  selection: any[] = [];

  hoveredElements: any[] = [];
  pressedKeys: object = {};

  wheelData: number = 0;

  speed: number = 1;

  logMessages: boolean = false;

  constructor(viewer: Viewer) {
    super();

    this.viewer = viewer;
    this.renderer = viewer.renderer;
    this.domElement = this.renderer.domElement;
    this.enabled = true;

    if (this.domElement.tabIndex === -1) {
      this.domElement.tabIndex = 2222;
    }

    this.domElement.addEventListener('contextmenu', e => {
      e.preventDefault();
    });

    // this.domElement.addEventListener('mousedown', this.onMouseDown.bind(this));
    // this.domElement.addEventListener('mouseup', this.onMouseUp.bind(this));
    // this.domElement.addEventListener('click', this.onMouseClick.bind(this));
    // this.domElement.addEventListener(
    //   'mousewheel',
    //   this.onMouseWheel.bind(this)
    // );
    // this.domElement.addEventListener('mousemove', this.onMouseMove.bind(this));

    // this.domElement.addEventListener(
    //   "DOMMouseScroll",
    //   this.onMouseWheel.bind(this),
    //   false
    // ); // Firefox
    // this.domElement.addEventListener("dblclick", this.onDoubleClick.bind(this));
    // this.domElement.addEventListener("keydown", this.onKeyDown.bind(this));
    // this.domElement.addEventListener("keyup", this.onKeyUp.bind(this));
    // this.domElement.addEventListener(
    //   "touchstart",
    //   this.onTouchStart.bind(this)
    // );
    // this.domElement.addEventListener("touchend", this.onTouchEnd.bind(this));
    // this.domElement.addEventListener("touchmove", this.onTouchMove.bind(this));
  }
}
