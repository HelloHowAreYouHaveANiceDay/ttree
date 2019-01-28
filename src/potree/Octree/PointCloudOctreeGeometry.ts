import PointAttributes from "../PointAttributes";

interface PointCloudOctreeGeometry {
  url: any;
  octreeDir: any;
  spacing: number;
  boundingBox: any;
  root: any;
  nodes: any;
  pointAttributes: PointAttributes;
  hierarchyStepSize: number;
  //TODO: loader type
  loader: any;
  projection?: any;
  tightBoundingBox?: THREE.Box3;
  boundingSphere?: THREE.Sphere;
  tightBoundingSphere?: THREE.Sphere;
  offset?: THREE.Vector3;
}

class PointCloudOctreeGeometry {
  constructor() {
    this.url = null;
    this.octreeDir = null;
    this.spacing = 0;
    this.boundingBox = null;
    this.root = null;
    this.nodes = null;
    this.pointAttributes = null;
    this.hierarchyStepSize = -1;
    this.loader = null;
  }
}

export default PointCloudOctreeGeometry;
