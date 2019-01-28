import TWEEN from './Tween';

interface PathAnimation {
  path: {
    spline: any
  };
  length: number;
  speed: number;
  callback: Function;
  tween: any;
  startPoint: number;
  endPoint: number;
  t: number
  repeat?: boolean;
}

class PathAnimation {
  constructor(path, start, end, speed, callback) {
    this.path = path;
    this.length = this.path.spline.getLength();
    this.speed = speed;
    this.callback = callback;
    this.tween = null;
    this.startPoint = Math.max(start, 0);
    this.endPoint = Math.min(end, this.length);
    this.t = 0.0;
  }

  start(resume = false) {
    if (this.tween) {
      this.tween.stop();
      this.tween = null;
    }

    let tStart;
    if (resume) {
      tStart = this.t;
    } else {
      tStart = this.startPoint / this.length;
    }
    let tEnd = this.endPoint / this.length;
    let animationDuration = ((tEnd - tStart) * this.length * 1000) / this.speed;

    let progress = { t: tStart };
    this.tween = new TWEEN.Tween(progress).to({ t: tEnd }, animationDuration);
    this.tween.easing(TWEEN.Easing.Linear.None);
    this.tween.onUpdate(e => {
      this.t = progress.t;
      this.callback(progress.t);
    });
    this.tween.onComplete(() => {
      // TODO: repeat not used or set in anything
      if (this.repeat) {
        this.start();
      }
    });

    setTimeout(() => {
      this.tween.start();
    }, 0);
  }

  stop() {
    if (!this.tween) {
      return;
    }
    this.tween.stop();
    this.tween = null;
    this.t = 0;
  }

  pause() {
    if (!this.tween) {
      return;
    }

    this.tween.stop();
    TWEEN.remove(this.tween);
    this.tween = null;
  }

  resume() {
    this.start(true);
  }

  getPoint(t) {
    return this.path.spline.getPoint(t);
  }
}

export default PathAnimation;
