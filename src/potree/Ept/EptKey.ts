import * as THREE from "three";

import Potree from "../potree";
import PointCloudEptGeometry from "./PointCloudEptGeometry";

interface EptKey {
  ept: PointCloudEptGeometry;
  b: any;
  d: any;
  x: number;
  y: number;
  z: number;
}

class EptKey {
  constructor(ept, b, d, x, y, z) {
    this.ept = ept;
    this.b = b;
    this.d = d;
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
  }

  name() {
    return this.d + "-" + this.x + "-" + this.y + "-" + this.z;
  }

  step(a, b, c) {
    let min = this.b.min.clone();
    let max = this.b.max.clone();
    let dst = new THREE.Vector3().subVectors(max, min);

    if (a) min.x += dst.x / 2;
    else max.x -= dst.x / 2;

    if (b) min.y += dst.y / 2;
    else max.y -= dst.y / 2;

    if (c) min.z += dst.z / 2;
    else max.z -= dst.z / 2;

    return new Potree.EptKey(
      this.ept,
      new THREE.Box3(min, max),
      this.d + 1,
      this.x * 2 + a,
      this.y * 2 + b,
      this.z * 2 + c
    );
  }

  children() {
    var result = [];
    for (var a = 0; a < 2; ++a) {
      for (var b = 0; b < 2; ++b) {
        for (var c = 0; c < 2; ++c) {
          var add = this.step(a, b, c).name();
          if (!result.includes(add)) result = result.concat(add);
        }
      }
    }
    return result;
  }
}

export default EptKey;
