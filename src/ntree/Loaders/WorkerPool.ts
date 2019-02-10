import Binary from './workers/BinaryDecoderWorker.worker.js';
import EptBinary from './workers/EptBinaryDecoderWorker.worker.js';
import EptLaszip from './workers/EptLaszipDecoderWorker.worker.js';
import Greyhound from './workers/GreyhoundBinaryDecoderWorker.worker.js';

export default class WorkerPool {
  private static instance: WorkerPool;
  private static workers = {};
  private static workerConstructors = {
    Binary,
    EptBinary,
    EptLaszip,
    Greyhound
  };
  private constructor() {}

  static getWorker(type) {
    if (!WorkerPool.instance) {
      WorkerPool.instance = new WorkerPool();
    }
    if (WorkerPool.workers[type].length === 0) {
      const worker = new WorkerPool.workerConstructors[type]();
      WorkerPool[type].push(worker);
    }
    return WorkerPool.workers[type].pop();
  }

  static returnWorker(type, worker) {
    WorkerPool.workers[type].push(worker);
  }
}
