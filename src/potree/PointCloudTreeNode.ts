import EventDispatcher from "./EventDispatcher";
import { Point } from "proj4";

interface PointCloudTreeNode {
  needsTransformUpdate: boolean;
}

class PointCloudTreeNode extends EventDispatcher {
  constructor() {
    super();
    this.needsTransformUpdate = true;
  }

  getChildren() {
    throw new Error("override function");
  }

  getBoundingBox() {
    throw new Error("override function");
  }

  isLoaded() {
    throw new Error("override function");
  }

  isGeometryNode() {
    throw new Error("override function");
  }

  isTreeNode() {
    throw new Error("override function");
  }

  getLevel() {
    throw new Error("override function");
  }

  getBoundingSphere() {
    throw new Error("override function");
  }
}

export default PointCloudTreeNode;
