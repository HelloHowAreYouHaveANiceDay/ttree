import * as THREE from 'three';

import PointCloudTreeNode from "./PointCloudTreeNode";
import PointCloudOctree from './PointCloudOctree';


interface PointCloudOctreeNode {
  children: any[];
  sceneNode: any | null;
  octree: any | null;
  geometryNode?: any;
  pointcloud?: PointCloudOctree;
  pcIndex?: number;
}

class PointCloudOctreeNode extends PointCloudTreeNode {
  constructor() {
    super();

    //this.children = {};
    this.children = [];
    this.sceneNode = null;
    this.octree = null;
  }

  getNumPoints() {
    return this.geometryNode.numPoints;
  }

  isLoaded() {
    return true;
  }

  isTreeNode() {
    return true;
  }

  isGeometryNode() {
    return false;
  }

  getLevel() {
    return this.geometryNode.level;
  }

  getBoundingSphere() {
    return this.geometryNode.boundingSphere;
  }

  getBoundingBox() {
    return this.geometryNode.boundingBox;
  }

  getChildren() {
    let children = [];

    for (let i = 0; i < 8; i++) {
      if (this.children[i]) {
        children.push(this.children[i]);
      }
    }

    return children;
  }

  getPointsInBox(boxNode) {
    if (!this.sceneNode) {
      return null;
    }

    let buffer = this.geometryNode.buffer;

    let posOffset = buffer.offset("position");
    let stride = buffer.stride;
    let view = new DataView(buffer.data);

    let worldToBox = new THREE.Matrix4().getInverse(boxNode.matrixWorld);
    let objectToBox = new THREE.Matrix4().multiplyMatrices(
      worldToBox,
      this.sceneNode.matrixWorld
    );

    let inBox = [];

    let pos = new THREE.Vector4();
    for (let i = 0; i < buffer.numElements; i++) {
      let x = view.getFloat32(i * stride + posOffset + 0, true);
      let y = view.getFloat32(i * stride + posOffset + 4, true);
      let z = view.getFloat32(i * stride + posOffset + 8, true);

      pos.set(x, y, z, 1);
      pos.applyMatrix4(objectToBox);

      if (-0.5 < pos.x && pos.x < 0.5) {
        if (-0.5 < pos.y && pos.y < 0.5) {
          if (-0.5 < pos.z && pos.z < 0.5) {
            pos.set(x, y, z, 1).applyMatrix4(this.sceneNode.matrixWorld);
            inBox.push(new THREE.Vector3(pos.x, pos.y, pos.z));
          }
        }
      }
    }

    return inBox;
  }

  get name() {
    return this.geometryNode.name;
  }
}

export default PointCloudOctreeNode;
