import * as THREE from 'three';
import EventDispatcher from './tEventDispatcher';
import Scene from '../potree/Scene';
import OrbitControls from '../potree/OrbitControls';
import FirstPersonControls from '../potree/FirstPersonControls';
import DeviceOrientationControls from '../potree/DeviceOrientationControls';
import { ClipTask, ClipMethod } from '../potree/Presets';
import Renderer from '../potree/Renderer';
import Features from '../potree/Features';

interface ViewerArgs {
  onPointCloudLoaded?: Function;
  useDefaultRenderLoop?: boolean;
}

class Viewer extends EventDispatcher {
  guiLoaded = false;
  guiLoadTasks = [];

  messages = [];
  renderArea: HTMLElement = null;
  scene: Scene = null;

  orbitControls: OrbitControls = null;
  fpControls: FirstPersonControls = null;
  deviceControls: DeviceOrientationControls = null;

  fov: number = 60;
  isFlipYZ: boolean = false;
  useDEMCollisions: boolean = false;
  generateDEM: boolean = false;

  private minNodeSize: number = 30;

  edlStrength: number = 1.0;
  edlRadius: number = 1.4;
  useEDL: boolean = false;

  classifications: object = {
    0: {
      visible: true,
      name: 'never classified'
    },
    1: { visible: true, name: 'unclassified' },
    2: { visible: true, name: 'ground' },
    3: { visible: true, name: 'low vegetation' },
    4: { visible: true, name: 'medium vegetation' },
    5: { visible: true, name: 'high vegetation' },
    6: { visible: true, name: 'building' },
    7: { visible: true, name: 'low point(noise)' },
    8: { visible: true, name: 'key-point' },
    9: { visible: true, name: 'water' },
    // classifications skip 10 and 11?
    // 10: { visible: true, name: 'ground' },
    // 11: { visible: true, name: 'ground' },
    12: { visible: true, name: 'overlap' }
  };

  LENGTH_UNITS = {
    METER: { code: 'm', unitspermeter: 1.0 },
    FEET: { code: 'ft', unitspermeter: 3.28084 },
    INCH: { code: '\u2033', unitspermeter: 39.3701 }
  };

  moveSpeed: number = 10;

  lengthUnit: object = this.LENGTH_UNITS.METER;
  lengthUnitDisplay: object = this.LENGTH_UNITS.METER;

  showBoundingBox: boolean = false;
  showAnnotations: boolean = true;
  freeze: boolean = false;

  clipTask: number = ClipTask.HIGHLIGHT;
  clipMethod: number = ClipMethod.INSIDE_ANY;

  filterReturnNumberRange: [number, number] = [0, 7];
  filterNumberOfReturnsRange: [number, number] = [0, 7];
  filterGPSTimeRange: [number, number] = [0, Infinity];
  filterGPSTimeExtent: [number, number] = [0, 1];

  potreeRenderer: Renderer = null;
  edlRenderer: any = null;
  renderer: any = null;
  pRenderer: Renderer = null;

  overlay: THREE.Scene = null;
  overlayCamera: THREE.OrthographicCamera = null;

  shadowTestCam: THREE.PerspectiveCamera = null;

  constructor(domElement: HTMLElement, args: ViewerArgs = {}) {
    super();

    this.renderArea = domElement;
    this.initThree();
    this.addContextLostListener();

    this.overlay = new THREE.Scene();
    this.overlayCamera = new THREE.OrthographicCamera(0, 1, 1, 0, -1000, 1000);

    this.pRenderer = new Renderer(this.renderer);

    const near = 2.5;
    const far = 10.0;

    this.shadowTestCam = new THREE.PerspectiveCamera(90, 1, near, far);
    //TODO: why these number
    this.shadowTestCam.position.set(3.5, -2.8, 8.561);
    this.shadowTestCam.lookAt(new THREE.Vector3(0, 0, 4.87));

    // const scene = new Scene();
    // this.setScene(scene);

    // this.inputHandler = new InputHandler(this);
  }

  addContextLostListener() {
    const canvas = this.renderer.domElement;
    canvas.addEventListener('webglcontextlost', e => {
      this.post('webglcontextlost', e);

      const gl = this.renderer.getContext();
      const error = gl.getError();
      this.post('webglcontextlostErrorl', error);
    });
  }

  setScene(scene) {
    if (scene === this.scene) {
      return;
    }

    const oldScene = this.scene;
    this.scene = scene;

    this.dispatchEvent({
      type: 'scene_changed',
      oldScene,
      scene
    });

    // TODO: Annotation Code
    // unimplemented annotation code
  }

  getControls(navigationMode) {
    if (navigationMode === OrbitControls) {
      return this.orbitControls;
    } else if (navigationMode === FirstPersonControls) {
      return this.fpControls;
    } else if (navigationMode === DeviceOrientationControls) {
      return this.deviceControls;
    } else {
      return null;
    }
  }

  getMinNodSize() {
    return this.minNodeSize;
  }

  initThree() {
    const width = this.renderArea.clientWidth;
    const height = this.renderArea.clientHeight;

    const contextAttributes = {
      alpha: true,
      depth: true,
      stencil: false,
      antialias: false,
      preserveDrawingBuffer: true,
      powerPreference: 'high-performance'
    };

    const canvas = document.createElement('canvas');

    const context = canvas.getContext('webgl', contextAttributes);
    Features.WEBGL2.isSupported = () => false;

    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      premultipliedAlpha: false,
      canvas,
      context: <WebGLRenderingContext>context
    });

    this.renderer.sortObjects = false;
    this.renderer.setSize(width, height);
    this.renderer.autoClear = false;
    this.renderArea.appendChild = this.renderer.domElement;
    //TODO: figure out when this is used;
    this.renderer.domElement.tabIndex = '2222';
    this.renderer.domElement.style.position = 'absolute';

    this.renderer.domElement.addEventListener('mousedown', e => {
      this.post('mousedown', e);
      this.renderer.domElement.focus();
    });

    // enable frag_depth extension for the interpolation shader, if available
    const gl = this.renderer.context;
    gl.getExtension('EXT_frag_dept');
    gl.getExtension('WEBGL_DEPTH_texture');

    if (gl instanceof WebGLRenderingContext) {
      const extVAO = gl.getExtension('OES_vertex_array_object');

      if (!extVAO) {
        console.error('OES_vertex_array_object extension not supported');
        //iffy type support on WebGL2 rendering context
        //@ts-ignore
        gl.createVertexArray = extVAO.createVertexArrayOES.bind(extVAO);
        //@ts-ignore
        gl.bindVertexArray = extVAO.bindVertexArrayOES.bind(extVAO);
        //@ts-ignore
        //webGL2 only supported on some browsers
      } else if (gl instanceof WebGL2RenderingContext) {
        gl.getExtension('EXT_color_buffer_float');
      }
    }
  }
}

export default Viewer;
