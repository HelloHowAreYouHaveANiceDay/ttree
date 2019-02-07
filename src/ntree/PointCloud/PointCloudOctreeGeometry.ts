import PointCloudOctreeGeometryNode from './PointCloudOctreeGeometryNode';

export default class PointCloudOctreeGeometry {
  url: string = null;
  octreeDir: string = null;
  spacing: number = 0;
  boundingBox: THREE.Box3 = null;
  hierarchyStepSize: number;
  root: PointCloudOctreeGeometryNode;
  projection: string;
  pointAttributes?: string[] | string;
  tightBoudingBox: THREE.Box3;
  boundingSphere: THREE.Sphere;
  tightBoundingSphere: THREE.Sphere;
  offset: THREE.Vector3;
  nodes: object;
  // subsitute with loader types
  loader: any;
  constructor() {}
}
