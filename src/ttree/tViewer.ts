import EventDispatcher from "./tEventDispatcher";
import Scene from "../potree/Scene";

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

  constructor(domElement: HTMLElement, args: ViewerArgs = {}) {
    super();

    this.renderArea = domElement;
  }

  setScene(scene) {
    if (scene === this.scene) {
      return;
    }

    const oldScene = this.scene;
    this.scene = scene;

    this.dispatchEvent({
      type: "scene_changed",
      oldScene,
      scene
    });

    // unimplemented annotation code
  }
}

export default Viewer;
