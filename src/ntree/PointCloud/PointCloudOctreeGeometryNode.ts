import * as THREE from 'three';

import PointCloudTreeNode from './PointCloudTreeNode';
import { range } from 'd3';

export default class PointCloudOctreeGeometry implements PointCloudTreeNode {
  id: number;
  name: string;
  index: number;
  pcoGeometry: PointCloudOctreeGeometry;
  boundingBox: THREE.Box3;
  boundingSphere: THREE.Sphere;
  children: object;
  numPoints: number;
  level: number;
  loaded: boolean;
  oneTimeDisposeHandlers: any[];

  needsTransformUpdate: boolean = false;
  constructor(
    name: string,
    pcoGeometry: PointCloudOctreeGeometry,
    boundingBox: THREE.Box3
  ) {
    this.needsTransformUpdate = true;
    this.name = name;
    this.index = parseInt(name.charAt(name.length - 1));
    this.pcoGeometry = pcoGeometry;
    this.boundingBox = boundingBox;
    this.boundingSphere = boudingBox.getBoundingSphere(new THREE.Sphere());
    this.children = {};
    this.numPoints = 0;
    this.level = null;
    this.loaded = false;
    this.oneTimeDisposeHandlers = [];
  }

  isGeometryNode: () => true;

  getLevel() {
    return this.level;
  }

  isTreeNode: () => false;

  isLoaded() {
    return this.loaded;
  }

  getBoundingSphere() {
    return this.boundingSphere;
  }

  getBoundingBox() {
    return this.boundingBox;
  }

  getChildren() {
    const children = [];

    for (let i = 0; i < 8; i++) {
      if (this.children[i]) {
        children.push(this.children[i]);
      }
    }

    return children;
  }
}
