import * as THREE from 'three';

import PointCloudOctreeGeometry from './PointCloud/PointCloudOctreeGeometry';
import Cloud from './PointCloud/Cloud';
import { request } from './XHR';
import PointCloudOctreeGeometryNode from '../potree/Octree/PointCloudOctreeGeometryNode';

export default class POCLoader {
  static async load(url: string): Promise<PointCloudOctreeGeometry> {
    // PointCloudOctreeGeometry
    try {
      const pco = new PointCloudOctreeGeometry();
      pco.url = url;

      const response = await request('get', url);

      const fMno: Cloud = response.json;
      // if path is absolute
      if (fMno.octreeDir.indexOf('http') === 0) {
        pco.octreeDir = fMno.octreeDir;
      } else {
        // if path is relative
        pco.octreeDir = url + '/../' + fMno.octreeDir;
      }

      pco.spacing = fMno.spacing;
      pco.hierarchyStepSize = fMno.hierarchyStepSize;
      pco.pointAttributes = fMno.pointAttributes;

      const min = new THREE.Vector3(
        fMno.boundingBox.lx,
        fMno.boundingBox.ly,
        fMno.boundingBox.lz
      );

      const max = new THREE.Vector3(
        fMno.boundingBox.ux,
        fMno.boundingBox.uy,
        fMno.boundingBox.uz
      );

      const boundingBox = new THREE.Box3(min, max);
      let tightBoundingBox;
      // const tightBoundingBox = boundingBox.clone();
      if (fMno.tightBoundingBox) {
        const min = new THREE.Vector3(
          fMno.tightBoundingBox.lx,
          fMno.tightBoundingBox.ly,
          fMno.tightBoundingBox.lz
        );

        const max = new THREE.Vector3(
          fMno.tightBoundingBox.ux,
          fMno.tightBoundingBox.uy,
          fMno.tightBoundingBox.uz
        );

        tightBoundingBox = new THREE.Box3(min, max);
      } else {
        tightBoundingBox = boundingBox.clone();
      }

      const offset = min.clone();

      //subtract offset from bouding boxes
      boundingBox.min.sub(offset);
      boundingBox.max.sub(offset);

      tightBoundingBox.min.sub(offset);
      tightBoundingBox.max.sub(offset);

      pco.projection = fMno.projection;
      pco.boundingBox = boundingBox;
      pco.tightBoudingBox = tightBoundingBox;

      pco.boundingSphere = boundingBox.getBoundingSphere(new THREE.Sphere());
      pco.tightBoundingSphere = boundingBox.getBoundingSphere(
        new THREE.Sphere()
      );

      pco.offset = offset;

      if (fMno.pointAttributes === 'LAS' || fMno.pointAttributes === 'LAZ') {
        // laslazloader
      } else {
        // Binary Loader
        // PointAttributes
      }

      const nodes = {};

      //load root

      const name = 'r';
      const root = new PointCloudOctreeGeometryNode(name, pco, boundingBox);
      root.level = 0;
      root.hasChildren = true;
      root.spacing = pco.spacing;

      pco.root = root;
      pco.root.load();
      nodes[name] = root;

      pco.nodes = nodes;

      return pco;
    } catch (err) {
      throw err;
    }
    // XHRFactory
    // Point Attributes
    // PointCloudOctreeGeometryNode
  }
}
