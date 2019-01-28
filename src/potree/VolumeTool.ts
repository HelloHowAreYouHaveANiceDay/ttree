import * as THREE from "three";

import EventDispatcher from "./EventDispatcher";
import Viewer from "./Viewer";
import Renderer from "./Renderer";
import BoxVolume from "./BoxVolume";
import Volume from "./Volume";

import Utils from "./Utils";

interface VolumeTool {
  viewer: Viewer;
  scene: THREE.Scene;
  renderer: Renderer;
  onAdd: Function;
  onRemove: Function;
}

class VolumeTool extends EventDispatcher {
  constructor(viewer) {
    super();

    this.viewer = viewer;
    this.renderer = viewer.renderer;

    this.addEventListener("start_inserting_volume", e => {
      this.viewer.dispatchEvent({
        type: "cancel_insertions"
      });
    });

    this.scene = new THREE.Scene();
    this.scene.name = "scene_volume";

    this.viewer.inputHandler.registerInteractiveScene(this.scene);

    this.onRemove = e => {
      this.scene.remove(e.volume);
    };

    this.onAdd = e => {
      this.scene.add(e.volume);
    };

    for (let volume of viewer.scene.volumes) {
      this.onAdd({ volume: volume });
    }

    this.viewer.inputHandler.addEventListener("delete", e => {
      let volumes = e.selection.filter(e => e instanceof Volume);
      volumes.forEach(e => this.viewer.scene.removeVolume(e));
    });

    viewer.addEventListener("update", this.update.bind(this));
    viewer.addEventListener("render.pass.scene", e => this.render(e));
    viewer.addEventListener("scene_changed", this.onSceneChange.bind(this));

    viewer.scene.addEventListener("volume_added", this.onAdd);
    viewer.scene.addEventListener("volume_removed", this.onRemove);
  }

  onSceneChange(e) {
    if (e.oldScene) {
      e.oldScene.removeEventListeners("volume_added", this.onAdd);
      e.oldScene.removeEventListeners("volume_removed", this.onRemove);
    }

    e.scene.addEventListener("volume_added", this.onAdd);
    e.scene.addEventListener("volume_removed", this.onRemove);
  }

  startInsertion(args = {}) {
    let volume;
    //@ts-ignore
    if (args.type) {
      //@ts-ignore
      volume = new args.type();
    } else {
      volume = new BoxVolume();
    }

    //@ts-ignore
    volume.clip = args.clip || false;
    //@ts-ignore
    volume.name = args.name || "Volume";

    this.dispatchEvent({
      type: "start_inserting_volume",
      volume: volume
    });

    this.viewer.scene.addVolume(volume);
    this.scene.add(volume);

    let cancel = {
      callback: null
    };

    let drag = e => {
      let camera = this.viewer.scene.getActiveCamera();

      let I = Utils.getMousePointCloudIntersection(
        e.drag.end,
        this.viewer.scene.getActiveCamera(),
        this.viewer,
        this.viewer.scene.pointclouds,
        { pickClipped: false }
      );

      if (I) {
        volume.position.copy(I.location);

        let wp = volume
          .getWorldPosition(new THREE.Vector3())
          .applyMatrix4(camera.matrixWorldInverse);
        // let pp = new THREE.Vector4(wp.x, wp.y, wp.z).applyMatrix4(camera.projectionMatrix);
        let w = Math.abs(wp.z / 5);
        volume.scale.set(w, w, w);
      }
    };

    let drop = e => {
      volume.removeEventListener("drag", drag);
      volume.removeEventListener("drop", drop);

      cancel.callback();
    };

    cancel.callback = e => {
      volume.removeEventListener("drag", drag);
      volume.removeEventListener("drop", drop);
      this.viewer.removeEventListener("cancel_insertions", cancel.callback);
    };

    volume.addEventListener("drag", drag);
    volume.addEventListener("drop", drop);
    this.viewer.addEventListener("cancel_insertions", cancel.callback);

    this.viewer.inputHandler.startDragging(volume);

    return volume;
  }

  update() {
    if (!this.viewer.scene) {
      return;
    }

    let camera = this.viewer.scene.getActiveCamera();
    let clientWidth = this.viewer.renderer.getSize().width;
    let clientHeight = this.viewer.renderer.getSize().height;

    let volumes = this.viewer.scene.volumes;
    for (let volume of volumes) {
      let label = volume.label;

      {
        let distance = label.position.distanceTo(camera.position);
        let pr = Utils.projectedRadius(
          1,
          camera,
          distance,
          clientWidth,
          clientHeight
        );

        let scale = 70 / pr;
        label.scale.set(scale, scale, scale);
      }

      let calculatedVolume = volume.getVolume();
      calculatedVolume =
      //@ts-ignore
        (calculatedVolume / Math.pow(this.viewer.lengthUnit.unitspermeter, 3)) *
      //@ts-ignore
        Math.pow(this.viewer.lengthUnitDisplay.unitspermeter, 3); //convert to cubic meters then to the cubic display unit
      let text =
        Utils.addCommas(calculatedVolume.toFixed(3)) +
        " " +
        //@ts-ignore
        this.viewer.lengthUnitDisplay.code +
        "\u00B3";
      label.setText(text);
    }
  }

  render(params) {
    this.viewer.renderer.render(
      this.scene,
      this.viewer.scene.getActiveCamera(),
      params.renderTarget
    );
  }
}

export default VolumeTool;
