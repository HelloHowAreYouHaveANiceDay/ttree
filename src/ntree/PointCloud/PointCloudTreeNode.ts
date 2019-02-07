import EventDispatcher from '../EventDispatcher';

export default interface PointCloudTreeNode extends EventDispatcher {
  needsTransformUpdate: boolean;
  getChildren: () => any[];
  getBoundingBox: () => THREE.Box3;
  isLoaded: () => boolean;
  isGeometryNode: () => boolean;
  isTreeNode: () => boolean;
  getLevel: () => number;
  getBoundingSphere: () => THREE.Sphere;
}
