import * as THREE from "three";

class U {
  static toVector3(v, offset) {
    return new THREE.Vector3().fromArray(v, offset || 0);
  }

  static toBox3(b) {
    return new THREE.Box3(U.toVector3(b, 0), U.toVector3(b, 3));
  }

  static findDim(schema, name) {
    var dim = schema.find(dim => dim.name == name);
    if (!dim) throw new Error("Failed to find " + name + " in schema");
    return dim;
  }

  static sphereFrom(b) {
    return b.getBoundingSphere(new THREE.Sphere());
  }
}

export default U;
