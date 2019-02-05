import proj4 from 'proj4';
import Action from './Action';

import PathAnimation from './PathAnimation';
import AnimationPath from './AnimationPath';

import {
  ClipTask,
  ClipMethod,
  PointSizeType,
  PointColorType,
  TreeType
} from './Presets';

import { LRU } from './LRU';

import Utils from './Utils';

import PointCloudTree from './PointCloudTree';

//TODO: Why a dollar sign?
import GreyhoundLoader from './Greyhound/GreyhoundLoader';
import PointAttribute from './PointAttribute';

import PointCloudMaterial from './Material/PointCloudMaterial';
import PointCloudOctree from './PointCloudOctree';
import Box3Helper from './Box3Helper';

import PointCloudArena4DNode from './PointCloudArena4DNode';

import WorkerPool from './WorkerPool';
import POCLoader from './Loaders/POCLoader';

import Viewer from './Viewer';

const Potree = {};

(function(global, factory) {
  // typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  // typeof define === 'function' && define.amd ? define(['exports'], factory) :
  factory(Potree);
})(this, exports => {
  // 'use strict';

  /**
   * @author mrdoob / http://mrdoob.com/ https://github.com/mrdoob/eventdispatcher.js
   *
   * with slight modifications by mschuetz, http://potree.org
   *
   */

  // The MIT License
  //
  // Copyright (c) 2011 Mr.doob
  //
  // Permission is hereby granted, free of charge, to any person obtaining a copy
  // of this software and associated documentation files (the "Software"), to deal
  // in the Software without restriction, including without limitation the rights
  // to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  // copies of the Software, and to permit persons to whom the Software is
  // furnished to do so, subject to the following conditions:
  //
  // The above copyright notice and this permission notice shall be included in
  // all copies or substantial portions of the Software.
  //
  // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  // IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  // FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  // AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  // LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  // OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  // THE SOFTWARE.

  //Potree.Actions = {};
  //
  //Potree.Actions.ToggleAnnotationVisibility = class ToggleAnnotationVisibility extends Potree.Action {
  //	constructor (args = {}) {
  //		super(args);
  //
  //		this.icon = Potree.resourcePath + '/icons/eye.svg';
  //		this.showIn = 'sidebar';
  //		this.tooltip = 'toggle visibility';
  //	}
  //
  //	pairWith (annotation) {
  //		if (annotation.visible) {
  //			this.setIcon(Potree.resourcePath + '/icons/eye.svg');
  //		} else {
  //			this.setIcon(Potree.resourcePath + '/icons/eye_crossed.svg');
  //		}
  //
  //		annotation.addEventListener('visibility_changed', e => {
  //			let annotation = e.annotation;
  //
  //			if (annotation.visible) {
  //				this.setIcon(Potree.resourcePath + '/icons/eye.svg');
  //			} else {
  //				this.setIcon(Potree.resourcePath + '/icons/eye_crossed.svg');
  //			}
  //		});
  //	}
  //
  //	onclick (event) {
  //		let annotation = event.annotation;
  //
  //		annotation.visible = !annotation.visible;
  //
  //		if (annotation.visible) {
  //			this.setIcon(Potree.resourcePath + '/icons/eye.svg');
  //		} else {
  //			this.setIcon(Potree.resourcePath + '/icons/eye_crossed.svg');
  //		}
  //	}
  //};

  /*
		{
			let target = new THREE.Vector3(589854.34, 231411.19, 692.77);
			let points = [
				new THREE.Vector3(589815.52, 231738.31, 959.48 ),
				new THREE.Vector3(589604.73, 231615.00, 968.10 ),
				new THREE.Vector3(589579.11, 231354.41, 1010.06),
				new THREE.Vector3(589723.00, 231169.95, 1015.57),
				new THREE.Vector3(589960.76, 231116.87, 978.60 ),
				new THREE.Vector3(590139.29, 231268.71, 972.33 )
			];
		
			let path = new Potree.AnimationPath(points);
		
			let geometry = path.getGeometry();
			let material = new THREE.LineBasicMaterial();
			let line = new THREE.Line(geometry, material);
			viewer.scene.scene.add(line);
		
			let [start, end, speed] = [0, path.getLength(), 10];
			path.animate(start, end, speed, t => {
				viewer.scene.view.position.copy(path.spline.getPoint(t));
			});
		
		}
		*/

  /**
   * adapted from http://stemkoski.github.io/Three.js/Sprite-Text-Labels.html
   */

  // TODO: figure out the execution context
  Utils.screenPass = new function() {
    this.screenScene = new THREE.Scene();
    this.screenQuad = new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 2, 0));
    this.screenQuad.material.depthTest = true;
    this.screenQuad.material.depthWrite = true;
    this.screenQuad.material.transparent = true;
    this.screenScene.add(this.screenQuad);
    this.camera = new THREE.Camera();

    this.render = function(renderer, material, target) {
      this.screenQuad.material = material;

      if (typeof target === 'undefined') {
        renderer.render(this.screenScene, this.camera);
      } else {
        renderer.render(this.screenScene, this.camera, target);
      }
    };
  }();

  //
  //
  // how to calculate the radius of a projected sphere in screen space
  // http://stackoverflow.com/questions/21648630/radius-of-projected-sphere-in-screen-space
  // http://stackoverflow.com/questions/3717226/radius-of-projected-sphere
  //

  /**
   *
   * code adapted from three.js BoxHelper.js
   * https://github.com/mrdoob/three.js/blob/dev/src/helpers/BoxHelper.js
   *
   * @author mrdoob / http://mrdoob.com/
   * @author Mugen87 / http://github.com/Mugen87
   * @author mschuetz / http://potree.org
   */

  function updatePointClouds(pointclouds, camera, renderer) {
    for (let pointcloud of pointclouds) {
      let start = performance.now();

      for (let profileRequest of pointcloud.profileRequests) {
        profileRequest.update();

        let duration = performance.now() - start;
        if (duration > 5) {
          break;
        }
      }

      let duration = performance.now() - start;
    }

    let result = updateVisibility(pointclouds, camera, renderer);

    for (let pointcloud of pointclouds) {
      pointcloud.updateMaterial(
        pointcloud.material,
        pointcloud.visibleNodes,
        camera,
        renderer
      );
      pointcloud.updateVisibleBounds();
    }

    exports.lru.freeMemory();

    return result;
  }

  function updateVisibilityStructures(pointclouds, camera, renderer) {
    let frustums = [];
    let camObjPositions = [];
    let priorityQueue = new BinaryHeap(function(x) {
      return 1 / x.weight;
    });

    for (let i = 0; i < pointclouds.length; i++) {
      let pointcloud = pointclouds[i];

      if (!pointcloud.initialized()) {
        continue;
      }

      pointcloud.numVisibleNodes = 0;
      pointcloud.numVisiblePoints = 0;
      pointcloud.deepestVisibleLevel = 0;
      pointcloud.visibleNodes = [];
      pointcloud.visibleGeometry = [];

      // frustum in object space
      camera.updateMatrixWorld();
      let frustum = new THREE.Frustum();
      let viewI = camera.matrixWorldInverse;
      let world = pointcloud.matrixWorld;

      // use close near plane for frustum intersection
      let frustumCam = camera.clone();
      frustumCam.near = Math.min(camera.near, 0.1);
      frustumCam.updateProjectionMatrix();
      let proj = camera.projectionMatrix;

      let fm = new THREE.Matrix4()
        .multiply(proj)
        .multiply(viewI)
        .multiply(world);
      frustum.setFromMatrix(fm);
      frustums.push(frustum);

      // camera position in object space
      let view = camera.matrixWorld;
      let worldI = new THREE.Matrix4().getInverse(world);
      let camMatrixObject = new THREE.Matrix4().multiply(worldI).multiply(view);
      let camObjPos = new THREE.Vector3().setFromMatrixPosition(
        camMatrixObject
      );
      camObjPositions.push(camObjPos);

      if (pointcloud.visible && pointcloud.root !== null) {
        priorityQueue.push({
          pointcloud: i,
          node: pointcloud.root,
          weight: Number.MAX_VALUE
        });
      }

      // hide all previously visible nodes
      // if(pointcloud.root instanceof PointCloudOctreeNode){
      //	pointcloud.hideDescendants(pointcloud.root.sceneNode);
      // }
      if (pointcloud.root.isTreeNode()) {
        pointcloud.hideDescendants(pointcloud.root.sceneNode);
      }

      for (let j = 0; j < pointcloud.boundingBoxNodes.length; j++) {
        pointcloud.boundingBoxNodes[j].visible = false;
      }
    }

    return {
      frustums: frustums,
      camObjPositions: camObjPositions,
      priorityQueue: priorityQueue
    };
  }

  function updateVisibility(pointclouds, camera, renderer) {
    let numVisibleNodes = 0;
    let numVisiblePoints = 0;

    let numVisiblePointsInPointclouds = new Map(pointclouds.map(pc => [pc, 0]));

    let visibleNodes = [];
    let visibleGeometry = [];
    let unloadedGeometry = [];

    let lowestSpacing = Infinity;

    // calculate object space frustum and cam pos and setup priority queue
    let s = updateVisibilityStructures(pointclouds, camera, renderer);
    let frustums = s.frustums;
    let camObjPositions = s.camObjPositions;
    let priorityQueue = s.priorityQueue;

    let loadedToGPUThisFrame = 0;

    let domWidth = renderer.domElement.clientWidth;
    let domHeight = renderer.domElement.clientHeight;

    // check if pointcloud has been transformed
    // some code will only be executed if changes have been detected
    if (!Potree._pointcloudTransformVersion) {
      Potree._pointcloudTransformVersion = new Map();
    }
    let pointcloudTransformVersion = Potree._pointcloudTransformVersion;
    for (let pointcloud of pointclouds) {
      if (!pointcloud.visible) {
        continue;
      }

      pointcloud.updateMatrixWorld();

      if (!pointcloudTransformVersion.has(pointcloud)) {
        pointcloudTransformVersion.set(pointcloud, {
          number: 0,
          transform: pointcloud.matrixWorld.clone()
        });
      } else {
        let version = pointcloudTransformVersion.get(pointcloud);

        if (!version.transform.equals(pointcloud.matrixWorld)) {
          version.number++;
          version.transform.copy(pointcloud.matrixWorld);

          pointcloud.dispatchEvent({
            type: 'transformation_changed',
            target: pointcloud
          });
        }
      }
    }

    while (priorityQueue.size() > 0) {
      let element = priorityQueue.pop();
      let node = element.node;
      let parent = element.parent;
      let pointcloud = pointclouds[element.pointcloud];

      // { // restrict to certain nodes for debugging
      //	let allowedNodes = ["r", "r0", "r4"];
      //	if(!allowedNodes.includes(node.name)){
      //		continue;
      //	}
      // }

      let box = node.getBoundingBox();
      let frustum = frustums[element.pointcloud];
      let camObjPos = camObjPositions[element.pointcloud];

      let insideFrustum = frustum.intersectsBox(box);
      let maxLevel = pointcloud.maxLevel || Infinity;
      let level = node.getLevel();
      let visible = insideFrustum;
      visible =
        visible &&
        !(numVisiblePoints + node.getNumPoints() > Potree.pointBudget);
      visible =
        visible &&
        !(
          numVisiblePointsInPointclouds.get(pointcloud) + node.getNumPoints() >
          pointcloud.pointBudget
        );
      visible = visible && level < maxLevel;
      //visible = visible && node.name !== "r613";

      if (!window.warned125) {
        console.log('TODO');
        window.warned125 = true;
      }

      let clipBoxes = pointcloud.material.clipBoxes;
      if (true && clipBoxes.length > 0) {
        //node.debug = false;

        let numIntersecting = 0;
        let numIntersectionVolumes = 0;

        //if(node.name === "r60"){
        //	var a = 10;
        //}

        for (let clipBox of clipBoxes) {
          let pcWorldInverse = new THREE.Matrix4().getInverse(
            pointcloud.matrixWorld
          );
          let toPCObject = pcWorldInverse.multiply(clipBox.box.matrixWorld);

          let px = new THREE.Vector3(+0.5, 0, 0).applyMatrix4(pcWorldInverse);
          let nx = new THREE.Vector3(-0.5, 0, 0).applyMatrix4(pcWorldInverse);
          let py = new THREE.Vector3(0, +0.5, 0).applyMatrix4(pcWorldInverse);
          let ny = new THREE.Vector3(0, -0.5, 0).applyMatrix4(pcWorldInverse);
          let pz = new THREE.Vector3(0, 0, +0.5).applyMatrix4(pcWorldInverse);
          let nz = new THREE.Vector3(0, 0, -0.5).applyMatrix4(pcWorldInverse);

          let pxN = new THREE.Vector3().subVectors(nx, px).normalize();
          let nxN = pxN.clone().multiplyScalar(-1);
          let pyN = new THREE.Vector3().subVectors(ny, py).normalize();
          let nyN = pyN.clone().multiplyScalar(-1);
          let pzN = new THREE.Vector3().subVectors(nz, pz).normalize();
          let nzN = pzN.clone().multiplyScalar(-1);

          let pxPlane = new THREE.Plane().setFromNormalAndCoplanarPoint(
            pxN,
            px
          );
          let nxPlane = new THREE.Plane().setFromNormalAndCoplanarPoint(
            nxN,
            nx
          );
          let pyPlane = new THREE.Plane().setFromNormalAndCoplanarPoint(
            pyN,
            py
          );
          let nyPlane = new THREE.Plane().setFromNormalAndCoplanarPoint(
            nyN,
            ny
          );
          let pzPlane = new THREE.Plane().setFromNormalAndCoplanarPoint(
            pzN,
            pz
          );
          let nzPlane = new THREE.Plane().setFromNormalAndCoplanarPoint(
            nzN,
            nz
          );

          //if(window.debugdraw !== undefined && window.debugdraw === true && node.name === "r60"){

          //	Potree.utils.debugPlane(viewer.scene.scene, pxPlane, 1, 0xFF0000);
          //	Potree.utils.debugPlane(viewer.scene.scene, nxPlane, 1, 0x990000);
          //	Potree.utils.debugPlane(viewer.scene.scene, pyPlane, 1, 0x00FF00);
          //	Potree.utils.debugPlane(viewer.scene.scene, nyPlane, 1, 0x009900);
          //	Potree.utils.debugPlane(viewer.scene.scene, pzPlane, 1, 0x0000FF);
          //	Potree.utils.debugPlane(viewer.scene.scene, nzPlane, 1, 0x000099);

          //	Potree.utils.debugBox(viewer.scene.scene, box, new THREE.Matrix4(), 0x00FF00);
          //	Potree.utils.debugBox(viewer.scene.scene, box, pointcloud.matrixWorld, 0xFF0000);
          //	Potree.utils.debugBox(viewer.scene.scene, clipBox.box.boundingBox, clipBox.box.matrixWorld, 0xFF0000);

          //	window.debugdraw = false;
          //}

          let frustum = new THREE.Frustum(
            pxPlane,
            nxPlane,
            pyPlane,
            nyPlane,
            pzPlane,
            nzPlane
          );
          let intersects = frustum.intersectsBox(box);

          if (intersects) {
            numIntersecting++;
          }
          numIntersectionVolumes++;
        }

        let insideAny = numIntersecting > 0;
        let insideAll = numIntersecting === numIntersectionVolumes;

        if (pointcloud.material.clipTask === ClipTask.SHOW_INSIDE) {
          if (
            pointcloud.material.clipMethod === ClipMethod.INSIDE_ANY &&
            insideAny
          ) {
            //node.debug = true
          } else if (
            pointcloud.material.clipMethod === ClipMethod.INSIDE_ALL &&
            insideAll
          ) {
            //node.debug = true;
          } else {
            visible = false;
          }
        } else if (pointcloud.material.clipTask === ClipTask.SHOW_OUTSIDE) {
          //if(pointcloud.material.clipMethod === ClipMethod.INSIDE_ANY && !insideAny){
          //	//visible = true;
          //	let a = 10;
          //}else if(pointcloud.material.clipMethod === ClipMethod.INSIDE_ALL && !insideAll){
          //	//visible = true;
          //	let a = 20;
          //}else{
          //	visible = false;
          //}
        }
      }

      // visible = ["r", "r0", "r06", "r060"].includes(node.name);
      // visible = ["r"].includes(node.name);

      if (node.spacing) {
        lowestSpacing = Math.min(lowestSpacing, node.spacing);
      } else if (node.geometryNode && node.geometryNode.spacing) {
        lowestSpacing = Math.min(lowestSpacing, node.geometryNode.spacing);
      }

      if (numVisiblePoints + node.getNumPoints() > Potree.pointBudget) {
        break;
      }

      if (!visible) {
        continue;
      }

      // TODO: not used, same as the declaration?
      // numVisibleNodes++;
      numVisiblePoints += node.getNumPoints();
      let numVisiblePointsInPointcloud = numVisiblePointsInPointclouds.get(
        pointcloud
      );
      numVisiblePointsInPointclouds.set(
        pointcloud,
        numVisiblePointsInPointcloud + node.getNumPoints()
      );

      pointcloud.numVisibleNodes++;
      pointcloud.numVisiblePoints += node.getNumPoints();

      if (node.isGeometryNode() && (!parent || parent.isTreeNode())) {
        if (node.isLoaded() && loadedToGPUThisFrame < 2) {
          node = pointcloud.toTreeNode(node, parent);
          loadedToGPUThisFrame++;
        } else {
          unloadedGeometry.push(node);
          visibleGeometry.push(node);
        }
      }

      if (node.isTreeNode()) {
        exports.lru.touch(node.geometryNode);
        node.sceneNode.visible = true;
        node.sceneNode.material = pointcloud.material;

        visibleNodes.push(node);
        pointcloud.visibleNodes.push(node);

        if (node._transformVersion === undefined) {
          node._transformVersion = -1;
        }
        let transformVersion = pointcloudTransformVersion.get(pointcloud);
        if (node._transformVersion !== transformVersion.number) {
          node.sceneNode.updateMatrix();
          node.sceneNode.matrixWorld.multiplyMatrices(
            pointcloud.matrixWorld,
            node.sceneNode.matrix
          );
          node._transformVersion = transformVersion.number;
        }

        if (
          pointcloud.showBoundingBox &&
          !node.boundingBoxNode &&
          node.getBoundingBox
        ) {
          let boxHelper = new Box3Helper(node.getBoundingBox());
          boxHelper.matrixAutoUpdate = false;
          pointcloud.boundingBoxNodes.push(boxHelper);
          node.boundingBoxNode = boxHelper;
          node.boundingBoxNode.matrix.copy(pointcloud.matrixWorld);
        } else if (pointcloud.showBoundingBox) {
          node.boundingBoxNode.visible = true;
          node.boundingBoxNode.matrix.copy(pointcloud.matrixWorld);
        } else if (!pointcloud.showBoundingBox && node.boundingBoxNode) {
          node.boundingBoxNode.visible = false;
        }
      }

      // add child nodes to priorityQueue
      let children = node.getChildren();
      for (let i = 0; i < children.length; i++) {
        let child = children[i];

        let weight = 0;
        if (camera.isPerspectiveCamera) {
          let sphere = child.getBoundingSphere();
          let center = sphere.center;
          //let distance = sphere.center.distanceTo(camObjPos);

          let dx = camObjPos.x - center.x;
          let dy = camObjPos.y - center.y;
          let dz = camObjPos.z - center.z;

          let dd = dx * dx + dy * dy + dz * dz;
          let distance = Math.sqrt(dd);

          let radius = sphere.radius;

          let fov = (camera.fov * Math.PI) / 180;
          let slope = Math.tan(fov / 2);
          let projFactor = (0.5 * domHeight) / (slope * distance);
          let screenPixelRadius = radius * projFactor;

          if (screenPixelRadius < pointcloud.minimumNodePixelSize) {
            continue;
          }

          weight = screenPixelRadius;

          if (distance - radius < 0) {
            weight = Number.MAX_VALUE;
          }
        } else {
          // TODO ortho visibility
          let bb = child.getBoundingBox();
          let distance = child.getBoundingSphere().center.distanceTo(camObjPos);
          let diagonal = bb.max
            .clone()
            .sub(bb.min)
            .length();
          //weight = diagonal / distance;

          weight = diagonal;
        }

        priorityQueue.push({
          pointcloud: element.pointcloud,
          node: child,
          parent: node,
          weight: weight
        });
      }
    } // end priority queue loop

    {
      // update DEM
      let maxDEMLevel = 4;
      let candidates = pointclouds.filter(
        p => p.generateDEM && p.dem instanceof Potree.DEM
      );
      for (let pointcloud of candidates) {
        let updatingNodes = pointcloud.visibleNodes.filter(
          n => n.getLevel() <= maxDEMLevel
        );
        pointcloud.dem.update(updatingNodes);
      }
    }

    for (
      let i = 0;
      i < Math.min(Potree.maxNodesLoading, unloadedGeometry.length);
      i++
    ) {
      unloadedGeometry[i].load();
    }

    return {
      visibleNodes: visibleNodes,
      numVisiblePoints: numVisiblePoints,
      lowestSpacing: lowestSpacing
    };
  }

  class PointCloudArena4D$1 extends PointCloudTree {
    constructor(geometry) {
      super();

      this.root = null;
      if (geometry.root) {
        this.root = geometry.root;
      } else {
        geometry.addEventListener('hierarchy_loaded', () => {
          this.root = geometry.root;
        });
      }

      this.visiblePointsTarget = 2 * 1000 * 1000;
      this.minimumNodePixelSize = 150;

      this.position.sub(geometry.offset);
      this.updateMatrix();

      this.numVisibleNodes = 0;
      this.numVisiblePoints = 0;

      this.boundingBoxNodes = [];
      this.loadQueue = [];
      this.visibleNodes = [];

      this.pcoGeometry = geometry;
      this.boundingBox = this.pcoGeometry.boundingBox;
      this.boundingSphere = this.pcoGeometry.boundingSphere;
      this.material = new PointCloudMaterial({
        vertexColors: THREE.VertexColors,
        size: 0.05,
        treeType: TreeType.KDTREE
      });
      this.material.sizeType = PointSizeType.ATTENUATED;
      this.material.size = 0.05;
      this.profileRequests = [];
      this.name = '';
    }

    getBoundingBoxWorld() {
      this.updateMatrixWorld(true);
      let box = this.boundingBox;
      let transform = this.matrixWorld;
      let tBox = Utils.computeTransformedBoundingBox(box, transform);

      return tBox;
    }

    setName(name) {
      if (this.name !== name) {
        this.name = name;
        this.dispatchEvent({
          type: 'name_changed',
          name: name,
          pointcloud: this
        });
      }
    }

    getName() {
      return this.name;
    }

    getLevel() {
      return this.level;
    }

    toTreeNode(geometryNode, parent) {
      let node = new PointCloudArena4DNode();
      let sceneNode = new THREE.Points(geometryNode.geometry, this.material);

      sceneNode.frustumCulled = false;
      sceneNode.onBeforeRender = (
        _this,
        scene,
        camera,
        geometry,
        material,
        group
      ) => {
        if (material.program) {
          _this.getContext().useProgram(material.program.program);

          if (material.program.getUniforms().map.level) {
            let level = geometryNode.getLevel();
            material.uniforms.level.value = level;
            material.program
              .getUniforms()
              .map.level.setValue(_this.getContext(), level);
          }

          if (
            this.visibleNodeTextureOffsets &&
            material.program.getUniforms().map.vnStart
          ) {
            let vnStart = this.visibleNodeTextureOffsets.get(node);
            material.uniforms.vnStart.value = vnStart;
            material.program
              .getUniforms()
              .map.vnStart.setValue(_this.getContext(), vnStart);
          }

          if (material.program.getUniforms().map.pcIndex) {
            let i = node.pcIndex
              ? node.pcIndex
              : this.visibleNodes.indexOf(node);
            material.uniforms.pcIndex.value = i;
            material.program
              .getUniforms()
              .map.pcIndex.setValue(_this.getContext(), i);
          }
        }
      };

      node.geometryNode = geometryNode;
      node.sceneNode = sceneNode;
      node.pointcloud = this;
      node.left = geometryNode.left;
      node.right = geometryNode.right;

      if (!parent) {
        this.root = node;
        this.add(sceneNode);
      } else {
        parent.sceneNode.add(sceneNode);

        if (parent.left === geometryNode) {
          parent.left = node;
        } else if (parent.right === geometryNode) {
          parent.right = node;
        }
      }

      let disposeListener = function() {
        parent.sceneNode.remove(node.sceneNode);

        if (parent.left === node) {
          parent.left = geometryNode;
        } else if (parent.right === node) {
          parent.right = geometryNode;
        }
      };
      geometryNode.oneTimeDisposeHandlers.push(disposeListener);

      return node;
    }

    updateMaterial(material, visibleNodes, camera, renderer) {
      material.fov = camera.fov * (Math.PI / 180);
      material.screenWidth = renderer.domElement.clientWidth;
      material.screenHeight = renderer.domElement.clientHeight;
      material.spacing = this.pcoGeometry.spacing;
      material.near = camera.near;
      material.far = camera.far;

      // reduce shader source updates by setting maxLevel slightly higher than actually necessary
      if (this.maxLevel > material.levels) {
        material.levels = this.maxLevel + 2;
      }

      // material.uniforms.octreeSize.value = this.boundingBox.size().x;
      let bbSize = this.boundingBox.getSize(new THREE.Vector3());
      material.bbSize = [bbSize.x, bbSize.y, bbSize.z];
    }

    updateVisibleBounds() {}

    hideDescendants(object) {
      let stack = [];
      for (let i = 0; i < object.children.length; i++) {
        let child = object.children[i];
        if (child.visible) {
          stack.push(child);
        }
      }

      while (stack.length > 0) {
        let child = stack.shift();

        child.visible = false;
        if (child.boundingBoxNode) {
          child.boundingBoxNode.visible = false;
        }

        for (let i = 0; i < child.children.length; i++) {
          let childOfChild = child.children[i];
          if (childOfChild.visible) {
            stack.push(childOfChild);
          }
        }
      }
    }

    updateMatrixWorld(force) {
      // node.matrixWorld.multiplyMatrices( node.parent.matrixWorld, node.matrix );

      if (this.matrixAutoUpdate === true) this.updateMatrix();

      if (this.matrixWorldNeedsUpdate === true || force === true) {
        if (this.parent === undefined) {
          this.matrixWorld.copy(this.matrix);
        } else {
          this.matrixWorld.multiplyMatrices(
            this.parent.matrixWorld,
            this.matrix
          );
        }

        this.matrixWorldNeedsUpdate = false;

        force = true;
      }
    }

    nodesOnRay(nodes, ray) {
      let nodesOnRay = [];

      let _ray = ray.clone();
      for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i];
        let sphere = node
          .getBoundingSphere()
          .clone()
          .applyMatrix4(node.sceneNode.matrixWorld);
        // TODO Unused: let box = node.getBoundingBox().clone().applyMatrix4(node.sceneNode.matrixWorld);

        if (_ray.intersectsSphere(sphere)) {
          nodesOnRay.push(node);
        }
        // if(_ray.isIntersectionBox(box)){
        //	nodesOnRay.push(node);
        // }
      }

      return nodesOnRay;
    }

    pick(viewer, camera, ray, params = {}) {
      let renderer = viewer.renderer;
      let pRenderer = viewer.pRenderer;

      performance.mark('pick-start');

      let getVal = (a, b) => (a !== undefined ? a : b);

      let pickWindowSize = getVal(params.pickWindowSize, 17);
      let pickOutsideClipRegion = getVal(params.pickOutsideClipRegion, false);

      let size = renderer.getSize();

      let width = Math.ceil(getVal(params.width, size.width));
      let height = Math.ceil(getVal(params.height, size.height));

      let pointSizeType = getVal(
        params.pointSizeType,
        this.material.pointSizeType
      );
      let pointSize = getVal(params.pointSize, this.material.size);

      let nodes = this.nodesOnRay(this.visibleNodes, ray);

      if (nodes.length === 0) {
        return null;
      }

      if (!this.pickState) {
        let scene = new THREE.Scene();

        let material = new PointCloudMaterial();
        material.pointColorType = PointColorType.POINT_INDEX;

        let renderTarget = new THREE.WebGLRenderTarget(1, 1, {
          minFilter: THREE.LinearFilter,
          magFilter: THREE.NearestFilter,
          format: THREE.RGBAFormat
        });

        this.pickState = {
          renderTarget: renderTarget,
          material: material,
          scene: scene
        };
      }

      let pickState = this.pickState;
      let pickMaterial = pickState.material;

      {
        // update pick material
        pickMaterial.pointSizeType = pointSizeType;
        pickMaterial.shape = this.material.shape;

        pickMaterial.size = pointSize;
        pickMaterial.uniforms.minSize.value = this.material.uniforms.minSize.value;
        pickMaterial.uniforms.maxSize.value = this.material.uniforms.maxSize.value;
        pickMaterial.classification = this.material.classification;
        if (params.pickClipped) {
          pickMaterial.clipBoxes = this.material.clipBoxes;
          if (this.material.clipTask === ClipTask.HIGHLIGHT) {
            pickMaterial.clipTask = ClipTask.NONE;
          } else {
            pickMaterial.clipTask = this.material.clipTask;
          }
        } else {
          pickMaterial.clipBoxes = [];
        }

        this.updateMaterial(pickMaterial, nodes, camera, renderer);
      }

      pickState.renderTarget.setSize(width, height);

      let pixelPos = new THREE.Vector2(params.x, params.y);

      let gl = renderer.getContext();
      gl.enable(gl.SCISSOR_TEST);
      gl.scissor(
        parseInt(pixelPos.x - (pickWindowSize - 1) / 2),
        parseInt(pixelPos.y - (pickWindowSize - 1) / 2),
        parseInt(pickWindowSize),
        parseInt(pickWindowSize)
      );

      renderer.state.buffers.depth.setTest(pickMaterial.depthTest);
      renderer.state.buffers.depth.setMask(pickMaterial.depthWrite);
      renderer.state.setBlending(THREE.NoBlending);

      renderer.clearTarget(pickState.renderTarget, true, true, true);

      {
        // RENDER
        renderer.setRenderTarget(pickState.renderTarget);
        gl.clearColor(0, 0, 0, 0);
        renderer.clearTarget(pickState.renderTarget, true, true, true);

        let tmp = this.material;
        this.material = pickMaterial;

        pRenderer.renderOctree(this, nodes, camera, pickState.renderTarget);

        this.material = tmp;
      }

      let clamp = (number, min, max) => Math.min(Math.max(min, number), max);

      let x = parseInt(clamp(pixelPos.x - (pickWindowSize - 1) / 2, 0, width));
      let y = parseInt(clamp(pixelPos.y - (pickWindowSize - 1) / 2, 0, height));
      let w = parseInt(Math.min(x + pickWindowSize, width) - x);
      let h = parseInt(Math.min(y + pickWindowSize, height) - y);

      let pixelCount = w * h;
      let buffer = new Uint8Array(4 * pixelCount);

      gl.readPixels(
        x,
        y,
        pickWindowSize,
        pickWindowSize,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        buffer
      );

      renderer.setRenderTarget(null);
      renderer.state.reset();
      renderer.setScissorTest(false);
      gl.disable(gl.SCISSOR_TEST);

      let pixels = buffer;
      let ibuffer = new Uint32Array(buffer.buffer);

      // find closest hit inside pixelWindow boundaries
      let min = Number.MAX_VALUE;
      let hits = [];
      for (let u = 0; u < pickWindowSize; u++) {
        for (let v = 0; v < pickWindowSize; v++) {
          let offset = u + v * pickWindowSize;
          let distance =
            Math.pow(u - (pickWindowSize - 1) / 2, 2) +
            Math.pow(v - (pickWindowSize - 1) / 2, 2);

          let pcIndex = pixels[4 * offset + 3];
          pixels[4 * offset + 3] = 0;
          let pIndex = ibuffer[offset];

          if (
            !(pcIndex === 0 && pIndex === 0) &&
            pcIndex !== undefined &&
            pIndex !== undefined
          ) {
            let hit = {
              pIndex: pIndex,
              pcIndex: pcIndex,
              distanceToCenter: distance
            };

            if (params.all) {
              hits.push(hit);
            } else {
              if (hits.length > 0) {
                if (distance < hits[0].distanceToCenter) {
                  hits[0] = hit;
                }
              } else {
                hits.push(hit);
              }
            }
          }
        }
      }

      for (let hit of hits) {
        let point = {};

        if (!nodes[hit.pcIndex]) {
          return null;
        }

        let node = nodes[hit.pcIndex];
        let pc = node.sceneNode;
        let geometry = node.geometryNode.geometry;

        for (let attributeName in geometry.attributes) {
          let attribute = geometry.attributes[attributeName];

          if (attributeName === 'position') {
            let x = attribute.array[3 * hit.pIndex + 0];
            let y = attribute.array[3 * hit.pIndex + 1];
            let z = attribute.array[3 * hit.pIndex + 2];

            let position = new THREE.Vector3(x, y, z);
            position.applyMatrix4(pc.matrixWorld);

            point[attributeName] = position;
          } else if (attributeName === 'indices') {
          } else {
            //if (values.itemSize === 1) {
            //	point[attribute.name] = values.array[hit.pIndex];
            //} else {
            //	let value = [];
            //	for (let j = 0; j < values.itemSize; j++) {
            //		value.push(values.array[values.itemSize * hit.pIndex + j]);
            //	}
            //	point[attribute.name] = value;
            //}
          }
        }

        hit.point = point;
      }

      performance.mark('pick-end');
      performance.measure('pick', 'pick-start', 'pick-end');

      if (params.all) {
        return hits.map(hit => hit.point);
      } else {
        if (hits.length === 0) {
          return null;
        } else {
          return hits[0].point;
        }
      }
    }

    computeVisibilityTextureData(nodes) {
      if (exports.measureTimings)
        performance.mark('computeVisibilityTextureData-start');

      let data = new Uint8Array(nodes.length * 3);
      let visibleNodeTextureOffsets = new Map();

      // copy array
      nodes = nodes.slice();

      // sort by level and number
      let sort = function(a, b) {
        let la = a.geometryNode.level;
        let lb = b.geometryNode.level;
        let na = a.geometryNode.number;
        let nb = b.geometryNode.number;
        if (la !== lb) return la - lb;
        if (na < nb) return -1;
        if (na > nb) return 1;
        return 0;
      };
      nodes.sort(sort);

      let visibleNodeNames = [];
      for (let i = 0; i < nodes.length; i++) {
        visibleNodeNames.push(nodes[i].geometryNode.number);
      }

      for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i];

        visibleNodeTextureOffsets.set(node, i);

        let b1 = 0; // children
        let b2 = 0; // offset to first child
        let b3 = 0; // split

        if (
          node.geometryNode.left &&
          visibleNodeNames.indexOf(node.geometryNode.left.number) > 0
        ) {
          b1 += 1;
          b2 = visibleNodeNames.indexOf(node.geometryNode.left.number) - i;
        }
        if (
          node.geometryNode.right &&
          visibleNodeNames.indexOf(node.geometryNode.right.number) > 0
        ) {
          b1 += 2;
          b2 =
            b2 === 0
              ? visibleNodeNames.indexOf(node.geometryNode.right.number) - i
              : b2;
        }

        if (node.geometryNode.split === 'X') {
          b3 = 1;
        } else if (node.geometryNode.split === 'Y') {
          b3 = 2;
        } else if (node.geometryNode.split === 'Z') {
          b3 = 4;
        }

        data[i * 3 + 0] = b1;
        data[i * 3 + 1] = b2;
        data[i * 3 + 2] = b3;
      }

      if (exports.measureTimings) {
        performance.mark('computeVisibilityTextureData-end');
        performance.measure(
          'render.computeVisibilityTextureData',
          'computeVisibilityTextureData-start',
          'computeVisibilityTextureData-end'
        );
      }

      return {
        data: data,
        offsets: visibleNodeTextureOffsets
      };
    }

    get progress() {
      if (this.pcoGeometry.root) {
        return exports.numNodesLoading > 0 ? 0 : 1;
      } else {
        return 0;
      }
    }
  }

  //Potree.workerPool = new Potree.WorkerPool();

  //
  // Algorithm by Christian Boucheny
  // shader code taken and adapted from CloudCompare
  //
  // see
  // https://github.com/cloudcompare/trunk/tree/master/plugins/qEDL/shaders/EDL
  // http://www.kitware.com/source/home/post/9
  // https://tel.archives-ouvertes.fr/tel-00438464/document p. 115+ (french)

  /**
   * laslaz code taken and adapted from plas.io js-laslaz
   *	http://plas.io/
   *  https://github.com/verma/plasio
   *
   * Thanks to Uday Verma and Howard Butler
   *
   */

  /**
   * laslaz code taken and adapted from plas.io js-laslaz
   *	  http://plas.io/
   *	https://github.com/verma/plasio
   *
   * Thanks to Uday Verma and Howard Butler
   *
   */

  /**
   * @class Loads greyhound metadata and returns a PointcloudOctree
   *
   * @author Maarten van Meersbergen
   * @author Oscar Martinez Rubi
   * @author Connor Manning
   */

  function toInterleavedBufferAttribute(pointAttribute) {
    let att = null;

    if (pointAttribute.name === PointAttribute.POSITION_CARTESIAN.name) {
      att = new Potree.InterleavedBufferAttribute(
        'position',
        12,
        3,
        'FLOAT',
        false
      );
    } else if (pointAttribute.name === PointAttribute.COLOR_PACKED.name) {
      att = new Potree.InterleavedBufferAttribute(
        'color',
        4,
        4,
        'UNSIGNED_BYTE',
        true
      );
    } else if (pointAttribute.name === PointAttribute.INTENSITY.name) {
      att = new Potree.InterleavedBufferAttribute(
        'intensity',
        4,
        1,
        'FLOAT',
        false
      );
    } else if (pointAttribute.name === PointAttribute.CLASSIFICATION.name) {
      att = new Potree.InterleavedBufferAttribute(
        'classification',
        4,
        1,
        'FLOAT',
        false
      );
    } else if (pointAttribute.name === PointAttribute.RETURN_NUMBER.name) {
      att = new Potree.InterleavedBufferAttribute(
        'returnNumber',
        4,
        1,
        'FLOAT',
        false
      );
    } else if (pointAttribute.name === PointAttribute.NUMBER_OF_RETURNS.name) {
      att = new Potree.InterleavedBufferAttribute(
        'numberOfReturns',
        4,
        1,
        'FLOAT',
        false
      );
    } else if (pointAttribute.name === PointAttribute.SOURCE_ID.name) {
      att = new Potree.InterleavedBufferAttribute(
        'pointSourceID',
        4,
        1,
        'FLOAT',
        false
      );
    } else if (
      pointAttribute.name === PointAttribute.NORMAL_SPHEREMAPPED.name
    ) {
      att = new Potree.InterleavedBufferAttribute(
        'normal',
        12,
        3,
        'FLOAT',
        false
      );
    } else if (pointAttribute.name === PointAttribute.NORMAL_OCT16.name) {
      att = new Potree.InterleavedBufferAttribute(
        'normal',
        12,
        3,
        'FLOAT',
        false
      );
    } else if (pointAttribute.name === PointAttribute.NORMAL.name) {
      att = new Potree.InterleavedBufferAttribute(
        'normal',
        12,
        3,
        'FLOAT',
        false
      );
    }

    return att;
  }

  // http://epsg.io/
  proj4.defs(
    'UTM10N',
    '+proj=utm +zone=10 +ellps=GRS80 +datum=NAD83 +units=m +no_defs'
  );

  THREE.OrthographicCamera.prototype.zoomTo = function(node, factor = 1) {
    if (!node.geometry && !node.boundingBox) {
      return;
    }

    // TODO

    //let minWS = new THREE.Vector4(node.boundingBox.min.x, node.boundingBox.min.y, node.boundingBox.min.z, 1);
    //let minVS = minWS.applyMatrix4(this.matrixWorldInverse);

    //let right = node.boundingBox.max.x;
    //let bottom	= node.boundingBox.min.y;
    //let top = node.boundingBox.max.y;

    this.updateProjectionMatrix();
  };

  THREE.PerspectiveCamera.prototype.zoomTo = function(node, factor) {
    if (!node.geometry && !node.boundingSphere && !node.boundingBox) {
      return;
    }

    if (node.geometry && node.geometry.boundingSphere === null) {
      node.geometry.computeBoundingSphere();
    }

    node.updateMatrixWorld();

    let bs;

    if (node.boundingSphere) {
      bs = node.boundingSphere;
    } else if (node.geometry && node.geometry.boundingSphere) {
      bs = node.geometry.boundingSphere;
    } else {
      bs = node.boundingBox.getBoundingSphere(new THREE.Sphere());
    }

    let _factor = factor || 1;

    bs = bs.clone().applyMatrix4(node.matrixWorld);
    let radius = bs.radius;
    let fovr = (this.fov * Math.PI) / 180;

    if (this.aspect < 1) {
      fovr = fovr * this.aspect;
    }

    let distanceFactor = Math.abs(radius / Math.sin(fovr / 2)) * _factor;

    let offset = this.getWorldDirection(new THREE.Vector3()).multiplyScalar(
      -distanceFactor
    );
    this.position.copy(bs.center.clone().add(offset));
  };

  THREE.Ray.prototype.distanceToPlaneWithNegative = function(plane) {
    let denominator = plane.normal.dot(this.direction);
    if (denominator === 0) {
      // line is coplanar, return origin
      if (plane.distanceToPoint(this.origin) === 0) {
        return 0;
      }

      // Null is preferable to undefined since undefined means.... it is undefined
      return null;
    }
    let t = -(this.origin.dot(plane.normal) + plane.constant) / denominator;

    return t;
  };

  const workerPool = new WorkerPool();

  const version = {
    major: 1,
    minor: 6,
    suffix: ''
  };

  let lru = new LRU();

  console.log('Potree ' + version.major + '.' + version.minor + version.suffix);

  let pointBudget = 1 * 1000 * 1000;
  let framenumber = 0;
  let numNodesLoading = 0;
  let maxNodesLoading = 4;

  const debug = {};

  // gets the path of the current script for static asset imports
  exports.scriptPath = '';
  if (document.currentScript.src) {
    exports.scriptPath = new URL(document.currentScript.src + '/..').href;
    if (exports.scriptPath.slice(-1) === '/') {
      exports.scriptPath = exports.scriptPath.slice(0, -1);
    }
    console.log('script path', exports.scriptPath);
  } else {
    console.error(
      'Potree was unable to find its script path using document.currentScript. Is Potree included with a script tag? Does your browser support this function?'
    );
  }

  let resourcePath = exports.scriptPath + '/static/resources';

  function loadPointCloud(path, name, callback) {
    let loaded = function(pointcloud) {
      pointcloud.name = name;
      callback({ type: 'pointcloud_loaded', pointcloud: pointcloud });
    };

    // load pointcloud
    if (!path) {
      // TODO: callback? comment? Hello? Bueller? Anyone?
    } else if (path.indexOf('ept.json') > 0) {
      Potree.EptLoader.load(path, function(geometry) {
        if (!geometry) {
          console.error(
            new Error(`failed to load point cloud from URL: ${path}`)
          );
        } else {
          let pointcloud = new PointCloudOctree(geometry);
          loaded(pointcloud);
        }
      });
    } else if (path.indexOf('greyhound://') === 0) {
      // We check if the path string starts with 'greyhound:', if so we assume it's a greyhound server URL.
      GreyhoundLoader.load(path, function(geometry) {
        if (!geometry) {
          //callback({type: 'loading_failed'});
          console.error(
            new Error(`failed to load point cloud from URL: ${path}`)
          );
        } else {
          let pointcloud = new PointCloudOctree(geometry);
          loaded(pointcloud);
        }
      });
    } else if (path.indexOf('cloud.js') > 0) {
      POCLoader.load(path, function(geometry) {
        if (!geometry) {
          //callback({type: 'loading_failed'});
          console.error(
            new Error(`failed to load point cloud from URL: ${path}`)
          );
        } else {
          let pointcloud = new PointCloudOctree(geometry);
          loaded(pointcloud);
        }
      });
    } else if (path.indexOf('.vpc') > 0) {
      PointCloudArena4DGeometry.load(path, function(geometry) {
        if (!geometry) {
          //callback({type: 'loading_failed'});
          console.error(
            new Error(`failed to load point cloud from URL: ${path}`)
          );
        } else {
          let pointcloud = new PointCloudArena4D(geometry);
          loaded(pointcloud);
        }
      });
    } else {
      //callback({'type': 'loading_failed'});
      console.error(new Error(`failed to load point cloud from URL: ${path}`));
    }
  }

  // add selectgroup
  (function($) {
    $.fn.extend({
      selectgroup: function(args = {}) {
        let elGroup = $(this);
        let rootID = elGroup.prop('id');
        let groupID = `${rootID}`;
        let groupTitle = args.title !== undefined ? args.title : '';

        let elButtons = [];
        elGroup.find('option').each((index, value) => {
          let buttonID = $(value).prop('id');
          let label = $(value).html();
          let optionValue = $(value).prop('value');

          let elButton = $(`
					<span style="flex-grow: 1; display: inherit">
					<label for="${buttonID}" class="ui-button" style="width: 100%; padding: .4em .1em">${label}</label>
					<input type="radio" name="${groupID}" id="${buttonID}" value="${optionValue}" style="display: none"/>
					</span>
				`);
          let elLabel = elButton.find('label');
          let elInput = elButton.find('input');

          elInput.change(() => {
            elGroup.find('label').removeClass('ui-state-active');
            elGroup.find('label').addClass('ui-state-default');
            if (elInput.is(':checked')) {
              elLabel.addClass('ui-state-active');
            } else {
              //elLabel.addClass("ui-state-default");
            }
          });

          elButtons.push(elButton);
        });

        let elFieldset = $(`
				<fieldset style="border: none; margin: 0px; padding: 0px">
					<legend>${groupTitle}</legend>
					<span style="display: flex">

					</span>
				</fieldset>
			`);

        let elButtonContainer = elFieldset.find('span');
        for (let elButton of elButtons) {
          elButtonContainer.append(elButton);
        }

        elButtonContainer.find('label').each((index, value) => {
          $(value).css('margin', '0px');
          $(value).css('border-radius', '0px');
          $(value).css('border', '1px solid black');
          $(value).css('border-left', 'none');
        });
        elButtonContainer.find('label:first').each((index, value) => {
          $(value).css('border-radius', '4px 0px 0px 4px');
        });
        elButtonContainer.find('label:last').each((index, value) => {
          $(value).css('border-radius', '0px 4px 4px 0px');
          $(value).css('border-left', 'none');
        });

        elGroup.empty();
        elGroup.append(elFieldset);
      }
    });
  })(jQuery);

  exports.workerPool = workerPool;
  exports.version = version;
  exports.lru = lru;
  exports.pointBudget = pointBudget;
  exports.framenumber = framenumber;
  exports.numNodesLoading = numNodesLoading;
  exports.maxNodesLoading = maxNodesLoading;
  exports.debug = debug;
  exports.loadPointCloud = loadPointCloud;
  exports.Action = Action;
  exports.PathAnimation = PathAnimation;
  exports.AnimationPath = AnimationPath;
  exports.updatePointClouds = updatePointClouds;
  exports.updateVisibilityStructures = updateVisibilityStructures;
  exports.updateVisibility = updateVisibility;
  exports.Viewer = Viewer;

  Object.defineProperty(exports, '__esModule', { value: true });
});
//# sourceMappingURL=potree.js.map

export default Potree;
