import Potree from "../potree";

// LAZ Loader
// Uses NaCL module to load LAZ files
interface LAZLoader {
  arraybuffer: ArrayBuffer;
  ww?: Worker;
  nextCB: any;
}

class LAZLoader {
  constructor(arraybuffer) {
    this.arraybuffer = arraybuffer;

    // let workerPath = Potree.scriptPath + "/workers/LASLAZWorker.js";
    let workerPath = "./workers/LASLAZWorker.js";
    this.ww = Potree.workerPool.getWorker(workerPath);

    this.nextCB = null;
    // var o = this;

    // this.ww.onmessage = function(e) {
    //   if (o.nextCB !== null) {
    //     o.nextCB(e.data);
    //     o.nextCB = null;
    //   }
    // };

    // this.dorr = function(req, cb) {
    //   o.nextCB = cb;
    //   o.ww.postMessage(req);
    // };
  }

  dorr(req, cb) {
      this.nextCB = cb;
      this.ww.postMessage(req);
  }

  open() {
    // nothing needs to be done to open this file
    return new Promise(function(res, rej) {
      this.dorr({ type: "open", arraybuffer: this.arraybuffer }, function(r) {
        if (r.status !== 1) return rej(new Error("Failed to open file"));

        res(true);
      });
    });
  }

  getHeader() {
    return new Promise(function(res, rej) {
      this.dorr({ type: "header" }, function(r) {
        if (r.status !== 1) return rej(new Error("Failed to get header"));
        res(r.header);
      });
    });
  }

  readData(count, offset, skip) {
    return new Promise(function(res, rej) {
      this.dorr(
        { type: "read", count: count, offset: offset, skip: skip },
        function(r) {
          if (r.status !== 1) return rej(new Error("Failed to read data"));
          res({
            buffer: r.buffer,
            count: r.count,
            hasMoreData: r.hasMoreData
          });
        }
      );
    });
  }

  close() {
    var o = this;

    return new Promise(function(res, rej) {
      o.dorr({ type: "close" }, function(r) {
        let workerPath = Potree.scriptPath + "/workers/LASLAZWorker.js";
        Potree.workerPool.returnWorker(workerPath, o.ww);

        if (r.status !== 1) return rej(new Error("Failed to close file"));

        res(true);
      });
    });
  }
}

export default LAZLoader;
