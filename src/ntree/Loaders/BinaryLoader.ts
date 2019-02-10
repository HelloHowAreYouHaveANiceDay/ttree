import * as THREE from 'three';
import PointCloudOctreeGeometryNode from '../PointCloud/PointCloudOctreeGeometryNode';
import ntree from '../ntree';
import BinaryDecoderWorker from './workers/BinaryDecoderWorker.worker.js';
import WorkerPool from './WorkerPool';
import { buffer } from 'd3';

export default class BinaryLoader {
  boundingBox: THREE.Box3;
  scale: number;
  constructor(boundingBox: THREE.Box3, scale: number) {
    this.boundingBox = boundingBox;
    this.scale = scale;
  }

  async load(node: PointCloudOctreeGeometryNode) {
    if (node.loaded) {
      return;
    }

    const url = node.getURL() + '.bin';

    // TODO: need to pass return type arraybuffer to xhr
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    this.parse(node, buffer);
  }

  parse(node: PointCloudOctreeGeometryNode, buffer: ArrayBuffer) {
    const pointAttributes = node.pcoGeometry.pointAttributes;
    const numPoints =
      buffer.byteLength / node.pcoGeometry.pointAttributes.byteSize;

    const worker: Worker = WorkerPool.getWorker('Binary');

    worker.onmessage = e => {
      const data = e.data;
      const buffers = data.attributeBuffers;
      const tightBoundingBox = new THREE.Box3(
        new THREE.Vector3().fromArray(data.tightBoundingBox.min),
        new THREE.Vector3().fromArray(data.tightBoundingBox.max),
      );

      WorkerPool.returnWorker('Binary', worker);

      const geometry = new THREE.BufferGeometry();

      for (const key in buffers) {
        const buffer = buffers[key].buffer;
        const adders = [
          addPositionCartesian,
          addColorPacked,
          null,
          null,
          null,
          null,
          addIntensity,
          addClassification,
          addNormalSpheremapped,
          addNormalOct16,
          addNormal,
          addReturnNumber,
          addNumberOfReturns,
          addSourceId,
          addIndicies,
          addSpacing,
          addGpsTime,
        ];

        if (adders[key]) {
          adders[key](geometry)(buffer);
        }
      }

      tightBoundingBox.max.sub(tightBoundingBox.min);
      tightBoundingBox.min.set(0, 0, 0);

      let numPoints = e.data.buffer.byteLength / pointAttributes.byteSize;

      node.numPoints = numPoints;
      node.geometry = geometry;
      node.mean = new THREE.Vector3(...data.mean);
      node.tightBoundingBox = tightBoundingBox;
      node.loaded = true;
      node.loading = false;
      node.estimatedSpacing = data.estimatedSpacing;
      ntree.numNodesLoading--;
    };

    const message = {
      buffer: buffer,
      pointAttributes: pointAttributes,
      min: [
        node.boundingBox.min.x,
        node.boundingBox.min.y,
        node.boundingBox.min.z,
      ],
      offset: [
        node.pcoGeometry.offset.x,
        node.pcoGeometry.offset.y,
        node.pcoGeometry.offset.z,
      ],
      scale: this.scale,
      // spacing: node.spacing,
      hasChildren: node.hasChildren,
      name: node.name,
    };

    worker.postMessage(message, [message.buffer]);
  }
}

const addPositionCartesian = (geometry: THREE.BufferGeometry) => buffer => {
  geometry.addAttribute(
    'position',
    new THREE.BufferAttribute(new Float32Array(buffer), 3),
  );
};

const addColorPacked = (geometry: THREE.BufferGeometry) => buffer => {
  geometry.addAttribute(
    'color',
    new THREE.BufferAttribute(new Uint8Array(buffer), 4, true),
  );
};

const addIntensity = (geometry: THREE.BufferGeometry) => buffer => {
  geometry.addAttribute(
    'intensity',
    new THREE.BufferAttribute(new Float32Array(buffer), 1),
  );
};

const addClassification = (geometry: THREE.BufferGeometry) => buffer => {
  geometry.addAttribute(
    'classification',
    new THREE.BufferAttribute(new Uint8Array(buffer), 1),
  );
};

const addReturnNumber = (geometry: THREE.BufferGeometry) => buffer => {
  geometry.addAttribute(
    'returnNumber',
    new THREE.BufferAttribute(new Uint8Array(buffer), 1),
  );
};

const addNumberOfReturns = (geometry: THREE.BufferGeometry) => buffer => {
  geometry.addAttribute(
    'numberOfReturns',
    new THREE.BufferAttribute(new Uint8Array(buffer), 1),
  );
};

const addSourceId = (geometry: THREE.BufferGeometry) => buffer => {
  geometry.addAttribute(
    'pointSourceID',
    new THREE.BufferAttribute(new Uint16Array(buffer), 1),
  );
};

const addNormalSpheremapped = (geometry: THREE.BufferGeometry) => buffer => {
  geometry.addAttribute(
    'normal',
    new THREE.BufferAttribute(new Float32Array(buffer), 3),
  );
};

const addNormalOct16 = (geometry: THREE.BufferGeometry) => buffer => {
  geometry.addAttribute(
    'normal',
    new THREE.BufferAttribute(new Float32Array(buffer), 3),
  );
};

const addNormal = (geometry: THREE.BufferGeometry) => buffer => {
  geometry.addAttribute(
    'normal',
    new THREE.BufferAttribute(new Float32Array(buffer), 3),
  );
};

const addIndicies = (geometry: THREE.BufferGeometry) => buffer => {
  const bufferAttribute = new THREE.BufferAttribute(new Uint8Array(buffer), 4);
  bufferAttribute.normalized = true;
  geometry.addAttribute('indices', bufferAttribute);
};

const addSpacing = (geometry: THREE.BufferGeometry) => buffer => {
  let bufferAttribute = new THREE.BufferAttribute(new Float32Array(buffer), 1);
  geometry.addAttribute('spacing', bufferAttribute);
};

const addGpsTime = (geometry: THREE.BufferGeometry) => buffer => {
  const bufferAttribute = new THREE.BufferAttribute(
    new Float32Array(buffer),
    1,
  );
  geometry.addAttribute('gpsTime', bufferAttribute);
  // TODO: inject dependency on gps time
  // node.gpsTime = {
  //   offset: buffers[property].offset,
  //   range: buffers[property].range,
  // };
};
