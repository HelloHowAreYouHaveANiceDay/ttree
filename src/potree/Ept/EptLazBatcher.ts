import * as THREE from "three";

import Potree from "../potree";
import PointCloudEptGeometryNode from "./PointCloudEptGeometryNode";

interface EptLazBatcher {
  node: PointCloudEptGeometryNode;
}

class EptLazBatcher {
  constructor(node) {
    this.node = node;
  }

  push(las) {
    // let workerPath = Potree.scriptPath + "/workers/EptLaszipDecoderWorker.js";
    let workerPath = "./workers/EptLaszipDecoderWorker.js";
    let worker = Potree.workerPool.getWorker(workerPath);

    worker.onmessage = e => {
      let g = new THREE.BufferGeometry();
      let numPoints = las.pointsCount;

      let positions = new Float32Array(e.data.position);
      let colors = new Uint8Array(e.data.color);

      let intensities = new Float32Array(e.data.intensity);
      let classifications = new Uint8Array(e.data.classification);
      let returnNumbers = new Uint8Array(e.data.returnNumber);
      let numberOfReturns = new Uint8Array(e.data.numberOfReturns);
      let pointSourceIDs = new Uint16Array(e.data.pointSourceID);
      let indices = new Uint8Array(e.data.indices);

      g.addAttribute("position", new THREE.BufferAttribute(positions, 3));
      g.addAttribute("color", new THREE.BufferAttribute(colors, 4, true));
      g.addAttribute("intensity", new THREE.BufferAttribute(intensities, 1));
      g.addAttribute(
        "classification",
        new THREE.BufferAttribute(classifications, 1)
      );
      g.addAttribute(
        "returnNumber",
        new THREE.BufferAttribute(returnNumbers, 1)
      );
      g.addAttribute(
        "numberOfReturns",
        new THREE.BufferAttribute(numberOfReturns, 1)
      );
      g.addAttribute(
        "pointSourceID",
        new THREE.BufferAttribute(pointSourceIDs, 1)
      );
      g.addAttribute("indices", new THREE.BufferAttribute(indices, 4));

      g.attributes.indices.normalized = true;

      let tightBoundingBox = new THREE.Box3(
        new THREE.Vector3().fromArray(e.data.tightBoundingBox.min),
        new THREE.Vector3().fromArray(e.data.tightBoundingBox.max)
      );

      this.node.doneLoading(
        g,
        tightBoundingBox,
        numPoints,
        new THREE.Vector3(...e.data.mean)
      );

      Potree.workerPool.returnWorker(workerPath, worker);
    };

    let message = {
      buffer: las.arrayb,
      numPoints: las.pointsCount,
      pointSize: las.pointSize,
      pointFormatID: las.pointsFormatId,
      scale: las.scale,
      offset: las.offset,
      mins: las.mins,
      maxs: las.maxs
    };

    worker.postMessage(message, [message.buffer]);
  }
}

export default EptLazBatcher;
