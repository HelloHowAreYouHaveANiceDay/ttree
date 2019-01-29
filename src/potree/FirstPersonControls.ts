import * as THREE from "three";
import TWEEN from "./tween";
import EventDispatcher from "./EventDispatcher";

import Scene from "./Scene";
import Viewer from "./Viewer";
import Renderer from "./Renderer";
import { MOUSE } from "./Presets";
import Utils from "./Utils";

/**
 * @author chrisl / Geodan
 *
 * adapted from Potree.FirstPersonControls by
 *
 * @author mschuetz / http://mschuetz.at
 *
 * and THREE.DeviceOrientationControls  by
 *
 * @author richt / http://richt.me
 * @author WestLangley / http://github.com/WestLangley
 *
 *
 *
 */

interface FirstPersonControls {
  viewer: Viewer;
  renderer: Renderer;
  scene: Scene;
  sceneControls: THREE.Scene;
  rotationSpeed: number;
  moveSpeed: number;
  lockElevation: boolean;
  keys: {
    FORWARD: [number, number];
    BACKWARD: [number, number];
    LEFT: [number, number];
    RIGHT: [number, number];
    UP: [number, number];
    DOWN: [number, number];
  };
  fadeFactor: number;
  yawDelta: number;
  pitchDelta: number;
  translationDelta: THREE.Vector3;
  translationWorldDelta: THREE.Vector3;
  tweens: any[];
  enabled?: boolean;
}

class FirstPersonControls extends EventDispatcher {
  constructor(viewer) {
    super();

    this.viewer = viewer;
    this.renderer = viewer.renderer;

    this.scene = null;
    this.sceneControls = new THREE.Scene();

    this.rotationSpeed = 200;
    this.moveSpeed = 10;
    this.lockElevation = false;

    this.keys = {
      FORWARD: ["W".charCodeAt(0), 38],
      BACKWARD: ["S".charCodeAt(0), 40],
      LEFT: ["A".charCodeAt(0), 37],
      RIGHT: ["D".charCodeAt(0), 39],
      UP: ["R".charCodeAt(0), 33],
      DOWN: ["F".charCodeAt(0), 34]
    };

    this.fadeFactor = 50;
    this.yawDelta = 0;
    this.pitchDelta = 0;
    this.translationDelta = new THREE.Vector3(0, 0, 0);
    this.translationWorldDelta = new THREE.Vector3(0, 0, 0);

    this.tweens = [];

    let drag = e => {
      if (e.drag.object !== null) {
        return;
      }

      if (e.drag.startHandled === undefined) {
        e.drag.startHandled = true;

        this.dispatchEvent({ type: "start" });
      }

      let moveSpeed = this.viewer.getMoveSpeed();

      let ndrag = {
        x: e.drag.lastDrag.x / this.renderer.domElement.clientWidth,
        y: e.drag.lastDrag.y / this.renderer.domElement.clientHeight
      };

      if (e.drag.mouse === MOUSE.LEFT) {
        this.yawDelta += ndrag.x * this.rotationSpeed;
        this.pitchDelta += ndrag.y * this.rotationSpeed;
      } else if (e.drag.mouse === MOUSE.RIGHT) {
        this.translationDelta.x -= ndrag.x * moveSpeed * 100;
        this.translationDelta.z += ndrag.y * moveSpeed * 100;
      }
    };

    let drop = e => {
      this.dispatchEvent({ type: "end" });
    };

    let scroll = e => {
      let speed = this.viewer.getMoveSpeed();

      if (e.delta < 0) {
        speed = speed * 0.9;
      } else if (e.delta > 0) {
        speed = speed / 0.9;
      }

      speed = Math.max(speed, 0.1);

      this.viewer.setMoveSpeed(speed);
    };

    let dblclick = e => {
      this.zoomToLocation(e.mouse);
    };

    this.addEventListener("drag", drag);
    this.addEventListener("drop", drop);
    this.addEventListener("mousewheel", scroll);
    this.addEventListener("dblclick", dblclick);
  }

  setScene(scene) {
    this.scene = scene;
  }

  stop() {
    this.yawDelta = 0;
    this.pitchDelta = 0;
    this.translationDelta.set(0, 0, 0);
  }

  zoomToLocation(mouse) {
    let camera = this.scene.getActiveCamera();

    let I = Utils.getMousePointCloudIntersection(
      mouse,
      camera,
      this.viewer,
      this.scene.pointclouds
    );

    if (I === null) {
      return;
    }

    let targetRadius = 0;
    {
      let minimumJumpDistance = 0.2;

      let domElement = this.renderer.domElement;
      let ray = Utils.mouseToRay(
        mouse,
        camera,
        domElement.clientWidth,
        domElement.clientHeight
      );

      let nodes = I.pointcloud.nodesOnRay(I.pointcloud.visibleNodes, ray);
      let lastNode = nodes[nodes.length - 1];
      let radius = lastNode.getBoundingSphere(new THREE.Sphere()).radius;
      targetRadius = Math.min(this.scene.view.radius, radius);
      targetRadius = Math.max(minimumJumpDistance, targetRadius);
    }

    let d = this.scene.view.direction.multiplyScalar(-1);
    let cameraTargetPosition = new THREE.Vector3().addVectors(
      I.location,
      d.multiplyScalar(targetRadius)
    );
    // TODO Unused: let controlsTargetPosition = I.location;

    let animationDuration = 600;
    let easing = TWEEN.Easing.Quartic.Out;

    {
      // animate
      let value = { x: 0 };
      let tween = new TWEEN.Tween(value).to({ x: 1 }, animationDuration);
      tween.easing(easing);
      this.tweens.push(tween);

      let startPos = this.scene.view.position.clone();
      let targetPos = cameraTargetPosition.clone();
      let startRadius = this.scene.view.radius;
      let targetRadius = cameraTargetPosition.distanceTo(I.location);

      tween.onUpdate(() => {
        let t = value.x;
        this.scene.view.position.x = (1 - t) * startPos.x + t * targetPos.x;
        this.scene.view.position.y = (1 - t) * startPos.y + t * targetPos.y;
        this.scene.view.position.z = (1 - t) * startPos.z + t * targetPos.z;

        this.scene.view.radius = (1 - t) * startRadius + t * targetRadius;
        this.viewer.setMoveSpeed(this.scene.view.radius / 2.5);
      });

      tween.onComplete(() => {
        this.tweens = this.tweens.filter(e => e !== tween);
      });

      tween.start();
    }
  }

  update(delta) {
    let view = this.scene.view;

    {
      // cancel move animations on user input
      let changes = [
        this.yawDelta,
        this.pitchDelta,
        this.translationDelta.length(),
        this.translationWorldDelta.length()
      ];
      let changeHappens = changes.some(e => Math.abs(e) > 0.001);
      if (changeHappens && this.tweens.length > 0) {
        this.tweens.forEach(e => e.stop());
        this.tweens = [];
      }
    }

    {
      // accelerate while input is given
      let ih = this.viewer.inputHandler;

      let moveForward = this.keys.FORWARD.some(e => ih.pressedKeys[e]);
      let moveBackward = this.keys.BACKWARD.some(e => ih.pressedKeys[e]);
      let moveLeft = this.keys.LEFT.some(e => ih.pressedKeys[e]);
      let moveRight = this.keys.RIGHT.some(e => ih.pressedKeys[e]);
      let moveUp = this.keys.UP.some(e => ih.pressedKeys[e]);
      let moveDown = this.keys.DOWN.some(e => ih.pressedKeys[e]);

      if (this.lockElevation) {
        let dir = view.direction;
        dir.z = 0;
        dir.normalize();

        if (moveForward && moveBackward) {
          this.translationWorldDelta.set(0, 0, 0);
        } else if (moveForward) {
          this.translationWorldDelta.copy(
            dir.multiplyScalar(this.viewer.getMoveSpeed())
          );
        } else if (moveBackward) {
          this.translationWorldDelta.copy(
            dir.multiplyScalar(-this.viewer.getMoveSpeed())
          );
        }
      } else {
        if (moveForward && moveBackward) {
          this.translationDelta.y = 0;
        } else if (moveForward) {
          this.translationDelta.y = this.viewer.getMoveSpeed();
        } else if (moveBackward) {
          this.translationDelta.y = -this.viewer.getMoveSpeed();
        }
      }

      if (moveLeft && moveRight) {
        this.translationDelta.x = 0;
      } else if (moveLeft) {
        this.translationDelta.x = -this.viewer.getMoveSpeed();
      } else if (moveRight) {
        this.translationDelta.x = this.viewer.getMoveSpeed();
      }

      if (moveUp && moveDown) {
        this.translationWorldDelta.z = 0;
      } else if (moveUp) {
        this.translationWorldDelta.z = this.viewer.getMoveSpeed();
      } else if (moveDown) {
        this.translationWorldDelta.z = -this.viewer.getMoveSpeed();
      }
    }

    {
      // apply rotation
      let yaw = view.yaw;
      let pitch = view.pitch;

      yaw -= this.yawDelta * delta;
      pitch -= this.pitchDelta * delta;

      view.yaw = yaw;
      view.pitch = pitch;
    }

    {
      // apply translation
      view.translate(
        this.translationDelta.x * delta,
        this.translationDelta.y * delta,
        this.translationDelta.z * delta
      );

      view.translateWorld(
        this.translationWorldDelta.x * delta,
        this.translationWorldDelta.y * delta,
        this.translationWorldDelta.z * delta
      );
    }

    {
      // set view target according to speed
      view.radius = 3 * this.viewer.getMoveSpeed();
    }

    {
      // decelerate over time
      let attenuation = Math.max(0, 1 - this.fadeFactor * delta);
      this.yawDelta *= attenuation;
      this.pitchDelta *= attenuation;
      this.translationDelta.multiplyScalar(attenuation);
      this.translationWorldDelta.multiplyScalar(attenuation);
    }
  }
}

export default FirstPersonControls;
