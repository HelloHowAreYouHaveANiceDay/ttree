import U from "../U";

import PointCloudTreeNode from "../PointCloudTreeNode";
import Potree from "../potree";

import EptKey from "./EptKey";
import PointCloudEptGeometry from "./PointCloudEptGeometry";

interface PointCloudEptGeometryNode {
  ept: any;
  key: EptKey;
  id: number;
  geometry: any | null;
  //TODO: add a boundingbox type
  boundingBox: any;
  tightBoundingBox: any;
  spacing: number;
  boundingSphere: any;
  //TODO: IDCount raises property error but cannot be declared
  IDCount: number;
  hasChildren: boolean;
  children: object;
  numPoints: number;

  level: any;

  loaded: boolean;
  loading: boolean;
  oneTimeDisposeHandlers: Array<any>;
  name: string;
  index: number;
  parent: any;

  mean: number;
}

class PointCloudEptGeometryNode extends PointCloudTreeNode {
  constructor(ept: PointCloudEptGeometry, b, d, x, y, z) {
    super();

    this.ept = ept;
    this.key = new EptKey(this.ept, b || this.ept.boundingBox, d || 0, x, y, z);

    //@ts-ignore
    this.id = PointCloudEptGeometryNode.IDCount++;
    this.geometry = null;
    this.boundingBox = this.key.b;
    this.tightBoundingBox = this.boundingBox;
    this.spacing = this.ept.spacing / Math.pow(2, this.key.d);
    this.boundingSphere = U.sphereFrom(this.boundingBox);

    // These are set during hierarchy loading.
    this.hasChildren = false;
    this.children = {};
    this.numPoints = -1;

    this.level = this.key.d;
    this.loaded = false;
    this.loading = false;
    this.oneTimeDisposeHandlers = [];

    let k = this.key;
    this.name = this.toPotreeName(k.d, k.x, k.y, k.z);
    this.index = parseInt(this.name.charAt(this.name.length - 1));
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
  url() {
    return this.ept.url + "ept-data/" + this.filename();
  }
  getNumPoints() {
    return this.numPoints;
  }

  filename() {
    return this.key.name();
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

  addChild(child) {
    this.children[child.index] = child;
    child.parent = this;
  }

  load() {
    if (this.loaded || this.loading) return;
    if (Potree.numNodesLoading >= Potree.maxNodesLoading) return;

    this.loading = true;
    ++Potree.numNodesLoading;

    if (this.numPoints == -1) this.loadHierarchy();
    this.loadPoints();
  }

  loadPoints() {
    this.ept.loader.load(this);
  }

  async loadHierarchy() {
    let nodes = {};
    nodes[this.filename()] = this;
    this.hasChildren = false;

    let eptHierarchyFile = `${
      this.ept.url
    }ept-hierarchy/${this.filename()}.json`;

    let response = await fetch(eptHierarchyFile);
    let hier = await response.json();

    // Since we want to traverse top-down, and 10 comes
    // lexicographically before 9 (for example), do a deep sort.
    var keys = Object.keys(hier).sort((a, b) => {
      let [da, xa, ya, za] = a.split("-").map(n => parseInt(n, 10));
      let [db, xb, yb, zb] = b.split("-").map(n => parseInt(n, 10));
      if (da < db) return -1;
      if (da > db) return 1;
      if (xa < xb) return -1;
      if (xa > xb) return 1;
      if (ya < yb) return -1;
      if (ya > yb) return 1;
      if (za < zb) return -1;
      if (za > zb) return 1;
      return 0;
    });

    keys.forEach(v => {
      let [d, x, y, z] = v.split("-").map(n => parseInt(n, 10));
      let a = x & 1,
        b = y & 1,
        c = z & 1;
      let parentName = d - 1 + "-" + (x >> 1) + "-" + (y >> 1) + "-" + (z >> 1);

      let parentNode = nodes[parentName];
      if (!parentNode) return;
      parentNode.hasChildren = true;

      let key = parentNode.key.step(a, b, c);

      let node = new PointCloudEptGeometryNode(
        this.ept,
        key.b,
        key.d,
        key.x,
        key.y,
        key.z
      );

      node.level = d;
      node.numPoints = hier[v];

      parentNode.addChild(node);
      nodes[key.name()] = node;
    });
  }

  doneLoading(bufferGeometry, tightBoundingBox, np, mean) {
    bufferGeometry.boundingBox = this.boundingBox;
    this.geometry = bufferGeometry;
    this.tightBoundingBox = tightBoundingBox;
    this.numPoints = np;
    this.mean = mean;
    this.loaded = true;
    this.loading = false;
    --Potree.numNodesLoading;
  }

  toPotreeName(d, x, y, z) {
    var name = "r";

    for (var i = 0; i < d; ++i) {
      var shift = d - i - 1;
      var mask = 1 << shift;
      var step = 0;

      if (x & mask) step += 4;
      if (y & mask) step += 2;
      if (z & mask) step += 1;

      name += step;
    }

    return name;
  }

  dispose() {
    if (this.geometry && this.parent != null) {
      this.geometry.dispose();
      this.geometry = null;
      this.loaded = false;

      // this.dispatchEvent( { type: 'dispose' } );
      for (let i = 0; i < this.oneTimeDisposeHandlers.length; i++) {
        let handler = this.oneTimeDisposeHandlers[i];
        handler();
      }
      this.oneTimeDisposeHandlers = [];
    }
  }
}

//@ts-ignore
PointCloudEptGeometryNode.IDCount = 0;

export default PointCloudEptGeometryNode;
