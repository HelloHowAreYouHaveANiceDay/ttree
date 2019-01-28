import * as THREE from 'three';

import PathAnimation from './PathAnimation';

interface AnimationPath {
	points: Array<any>;
	spline: any;
	tween?: any;
}

class AnimationPath {
  constructor(points = []) {
    this.points = points;
    this.spline = new THREE.CatmullRomCurve3(points);
    //this.spline.reparametrizeByArcLength(1 / this.spline.getLength().total);
  }

  get(t) {
    return this.spline.getPoint(t);
  }

  getLength() {
    return this.spline.getLength();
  }

  animate(start, end, speed, callback) {
    let animation = new PathAnimation(this, start, end, speed, callback);
    animation.start();

    return animation;
  }

  pause() {
    if (this.tween) {
      this.tween.stop();
    }
  }

  resume() {
    if (this.tween) {
      this.tween.start();
    }
  }

  getGeometry() {
    let geometry = new THREE.Geometry();

    let samples = 500;
    let i = 0;
    for (let u = 0; u <= 1; u += 1 / samples) {
      let position = this.spline.getPoint(u);
      geometry.vertices[i] = new THREE.Vector3(
        position.x,
        position.y,
        position.z
      );

      i++;
    }

    if (this.closed) {
      let position = this.spline.getPoint(0);
      geometry.vertices[i] = new THREE.Vector3(
        position.x,
        position.y,
        position.z
      );
    }

    return geometry;
  }

  get closed() {
    return this.spline.closed;
  }

  set closed(value) {
    this.spline.closed = value;
  }
}

export default AnimationPath;