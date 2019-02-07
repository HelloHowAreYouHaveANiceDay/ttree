import * as THREE from 'three';

import PointCloudOctreeGeometry from './PointCloudOctreeGeometry';

import PointCloudTreeNode from './PointCloudTreeNode';

import ntree from '../ntree';

export default class PointCloudOctreeGeometryNode
  implements PointCloudTreeNode {
  id: number;
  name: string;
  index: number;
  pcoGeometry: PointCloudOctreeGeometry;
  boundingBox: THREE.Box3;
  boundingSphere: THREE.Sphere;
  pointAttributes?: string[] | string;
  children: object;
  numPoints: number;
  level: number;
  loader?: any;
  loaded: boolean;
  loading?: boolean;
  oneTimeDisposeHandlers: any[];
  hierarchyStepSize?: number;
  octreeDir?: string;
  geometry?: PointCloudOctreeGeometry;
  parent?: PointCloudOctreeGeometryNode;

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
    this.boundingSphere = boundingBox.getBoundingSphere(new THREE.Sphere());
    this.children = {};
    this.numPoints = 0;
    this.level = null;
    this.loaded = false;
    this.oneTimeDisposeHandlers = [];
  }

  isGeometryNode() {
    return true;
  }

  getLevel() {
    return this.level;
  }

  isTreeNode() {
    return false;
  }
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

  getURL() {
    const url =
      this.pcoGeometry.octreeDir +
      '/' +
      this.getHierarchyPath() +
      '/' +
      this.name;

    return url;
  }

  getHierarchyPath() {
    let path = 'r/';

    const hierarchyStepSize = this.pcoGeometry.hierarchyStepSize;
    const indices = this.name.substr(1);

    const numParts = Math.floor(indices.length / hierarchyStepSize);

    for (let i = 0; i < numParts; i++) {
      path += indices.substr(i * hierarchyStepSize, hierarchyStepSize) + '/';
    }

    path = path.slice(0, -1);

    return path;
  }

  addChild(child: PointCloudOctreeGeometryNode) {
    this.children[child.index] = child;
    child.parent = this;
  }

  load() {
    if (
      this.loading === true ||
      this.loaded === true ||
      ntree.numNodesLoading >= ntree.maxNodesLoading
    ) {
      return;
    }

    this.loading = true;

    ntree.numNodesLoading++;
  }

  loadPoints() {
    this.pcoGeometry.loader.load(this);
  }

  getNumPoints() {
    return this.numPoints;
  }
  // not sure if this is called
  // loadHierarchyThenPoints() {}

  dispose() {
    if (this.geometry && this.parent != null) {
      this.geometry.dispose();
      this.geometry = null;
      this.loaded = false;
    }
  }
}
