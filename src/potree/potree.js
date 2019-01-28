import proj4 from "proj4";
import ol from "openlayers";
// import i18n from 'jquery-i18next';
// const i18n = require('i18n');
import EventDispatcher from "./EventDispatcher";
import Action from "./Action";

import PathAnimation from "./PathAnimation";
import AnimationPath from "./AnimationPath";

import XHRFactory from "./XHRFactory";
import TextSprite from "./TextSprite";

import {
  CameraMode,
  ClipTask,
  ClipMethod,
  MOUSE,
  PointSizeType,
  PointShape,
  PointColorType,
  TreeType
} from "./Presets";

import Volume from "./Volume";
import BoxVolume from "./BoxVolume";
import SphereVolume from "./SphereVolume";
import PolygonClipVolume from "./PolygonClipVolume";
import Measure from "./Measure";
import { Enum, EnumItem } from "./Enum";
import Annotation from "./Annotation";

import { LRU, LRUItem } from "./LRU";

import Profile from "./Profile";

import Utils from "./Utils";

import PointCloudTreeNode from "./PointCloudTreeNode";
import PointCloudTree from "./PointCloudTree";

import EptKey from "./Ept/EptKey";
import EptLazBatcher from './Ept/EptLazBatcher';
import EptLoader from "./Ept/EptLoader";
import EptBinaryLoader from "./Ept/EptBinaryLoader";
import EptLaszipLoader from "./Ept/EptLaszipLoader";
import PointCloudEptGeometry from "./Ept/PointCloudEptGeometry";
import PointCloudEptGeometryNode from "./Ept/PointCloudEptGeometryNode";

import PointCloudGreyhoundGeometry from "./Greyhound/PointCloudGreyhoundGeometry";
//TODO: Why a dollar sign?
import PointCloudGreyhoundGeometryNode$1 from "./Greyhound/PointCloudGreyhoundGeometryNode";
import GreyhoundLoader from "./Greyhound/GreyhoundLoader";
import GreyhoundBinaryLoader from "./Greyhound/GreyhoundBinaryLoader";

import PointAttributeNames from "./PointAttributeNames";
import PointAttributeTypes from "./PointAttributeTypes";
import PointAttribute from "./PointAttribute";
import PointAttributes from "./PointAttributes";

import Gradients from "./Gradients";
import Shaders from "./Shaders";

import PointCloudOctreeGeometry from "./Octree/PointCloudOctreeGeometry";
import PointCloudOctreeGeometryNode from "./Octree/PointCloudOctreeGeometryNode";

import ClassificationScheme from "./ClassificationScheme";

import PointCloudMaterial from "./PointCloudMaterial";
import PointCloudOctreeNode from "./PointCloudOctreeNode";
import PointCloudOctree from "./PointCloudOctree";

import Points from "./Points";
import Box3Helper from "./Box3Helper";

import PointCloudArena4DNode from "./PointCloudArena4DNode";

import Renderer from "./Renderer";

import ProfileData from "./ProfileData";
import ProfileRequest from "./ProfileRequest";

import WorkerPool from "./WorkerPool";
import Version from "./Version";

import EyeDomeLightingMaterial from "./Material/EyeDomeLightingMaterial";
import NormalizationEDLMaterial from "./Material/NormalizationEDLMaterial";
import NormalizationMaterial from "./Material/NormalizationMaterial";

import POCLoader from "./Loaders/POCLoader";

import ClipVolume from './ClipVolume';

import Viewer from './Viewer';

// const $ = jQuery;

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

      if (typeof target === "undefined") {
        renderer.render(this.screenScene, this.camera);
      } else {
        renderer.render(this.screenScene, this.camera, target);
      }
    };
  }();

  const Features = (function() {
    let ftCanvas = document.createElement("canvas");
    let gl =
      ftCanvas.getContext("webgl2") ||
      ftCanvas.getContext("webgl") ||
      ftCanvas.getContext("experimental-webgl");
    if (gl === null) {
      return null;
    }

    // -- code taken from THREE.WebGLRenderer --
    let _vertexShaderPrecisionHighpFloat = gl.getShaderPrecisionFormat(
      gl.VERTEX_SHADER,
      gl.HIGH_FLOAT
    );
    let _vertexShaderPrecisionMediumpFloat = gl.getShaderPrecisionFormat(
      gl.VERTEX_SHADER,
      gl.MEDIUM_FLOAT
    );
    // Unused: let _vertexShaderPrecisionLowpFloat = gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.LOW_FLOAT);

    let _fragmentShaderPrecisionHighpFloat = gl.getShaderPrecisionFormat(
      gl.FRAGMENT_SHADER,
      gl.HIGH_FLOAT
    );
    let _fragmentShaderPrecisionMediumpFloat = gl.getShaderPrecisionFormat(
      gl.FRAGMENT_SHADER,
      gl.MEDIUM_FLOAT
    );
    // Unused: let _fragmentShaderPrecisionLowpFloat = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.LOW_FLOAT);

    let highpAvailable =
      _vertexShaderPrecisionHighpFloat.precision > 0 &&
      _fragmentShaderPrecisionHighpFloat.precision > 0;
    let mediumpAvailable =
      _vertexShaderPrecisionMediumpFloat.precision > 0 &&
      _fragmentShaderPrecisionMediumpFloat.precision > 0;
    // -----------------------------------------

    let precision;
    if (highpAvailable) {
      precision = "highp";
    } else if (mediumpAvailable) {
      precision = "mediump";
    } else {
      precision = "lowp";
    }

    return {
      SHADER_INTERPOLATION: {
        isSupported: function() {
          let supported = true;

          supported = supported && gl.getExtension("EXT_frag_depth");
          supported = supported && gl.getParameter(gl.MAX_VARYING_VECTORS) >= 8;

          return supported;
        }
      },
      SHADER_SPLATS: {
        isSupported: function() {
          let supported = true;

          supported = supported && gl.getExtension("EXT_frag_depth");
          supported = supported && gl.getExtension("OES_texture_float");
          supported = supported && gl.getParameter(gl.MAX_VARYING_VECTORS) >= 8;

          return supported;
        }
      },
      SHADER_EDL: {
        isSupported: function() {
          let supported = true;

          //supported = supported && gl.getExtension('EXT_frag_depth');
          supported = supported && gl.getExtension("OES_texture_float");
          supported = supported && gl.getParameter(gl.MAX_VARYING_VECTORS) >= 8;

          supported = supported || gl instanceof WebGL2RenderingContext;

          return supported;
        }
      },
      WEBGL2: {
        isSupported: function() {
          return gl instanceof WebGL2RenderingContext;
        }
      },
      precision: precision
    };
  })();

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
            type: "transformation_changed",
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
        console.log("TODO");
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
        geometry.addEventListener("hierarchy_loaded", () => {
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
      this.name = "";
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
          type: "name_changed",
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

      performance.mark("pick-start");

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

          if (attributeName === "position") {
            let x = attribute.array[3 * hit.pIndex + 0];
            let y = attribute.array[3 * hit.pIndex + 1];
            let z = attribute.array[3 * hit.pIndex + 2];

            let position = new THREE.Vector3(x, y, z);
            position.applyMatrix4(pc.matrixWorld);

            point[attributeName] = position;
          } else if (attributeName === "indices") {
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

      performance.mark("pick-end");
      performance.measure("pick", "pick-start", "pick-end");

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
        performance.mark("computeVisibilityTextureData-start");

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

        if (node.geometryNode.split === "X") {
          b3 = 1;
        } else if (node.geometryNode.split === "Y") {
          b3 = 2;
        } else if (node.geometryNode.split === "Z") {
          b3 = 4;
        }

        data[i * 3 + 0] = b1;
        data[i * 3 + 1] = b2;
        data[i * 3 + 2] = b3;
      }

      if (exports.measureTimings) {
        performance.mark("computeVisibilityTextureData-end");
        performance.measure(
          "render.computeVisibilityTextureData",
          "computeVisibilityTextureData-start",
          "computeVisibilityTextureData-end"
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

  var GeoTIFF = (function(exports) {
    "use strict";

    const Endianness = new Enum({
      LITTLE: "II",
      BIG: "MM"
    });

    const Type = new Enum({
      BYTE: { value: 1, bytes: 1 },
      ASCII: { value: 2, bytes: 1 },
      SHORT: { value: 3, bytes: 2 },
      LONG: { value: 4, bytes: 4 },
      RATIONAL: { value: 5, bytes: 8 },
      SBYTE: { value: 6, bytes: 1 },
      UNDEFINED: { value: 7, bytes: 1 },
      SSHORT: { value: 8, bytes: 2 },
      SLONG: { value: 9, bytes: 4 },
      SRATIONAL: { value: 10, bytes: 8 },
      FLOAT: { value: 11, bytes: 4 },
      DOUBLE: { value: 12, bytes: 8 }
    });

    const Tag = new Enum({
      IMAGE_WIDTH: 256,
      IMAGE_HEIGHT: 257,
      BITS_PER_SAMPLE: 258,
      COMPRESSION: 259,
      PHOTOMETRIC_INTERPRETATION: 262,
      STRIP_OFFSETS: 273,
      ORIENTATION: 274,
      SAMPLES_PER_PIXEL: 277,
      ROWS_PER_STRIP: 278,
      STRIP_BYTE_COUNTS: 279,
      X_RESOLUTION: 282,
      Y_RESOLUTION: 283,
      PLANAR_CONFIGURATION: 284,
      RESOLUTION_UNIT: 296,
      SOFTWARE: 305,
      COLOR_MAP: 320,
      SAMPLE_FORMAT: 339,
      MODEL_PIXEL_SCALE: 33550, // [GeoTIFF] TYPE: double   N: 3
      MODEL_TIEPOINT: 33922, // [GeoTIFF] TYPE: double   N: 6 * NUM_TIEPOINTS
      GEO_KEY_DIRECTORY: 34735, // [GeoTIFF] TYPE: short    N: >= 4
      GEO_DOUBLE_PARAMS: 34736, // [GeoTIFF] TYPE: short    N: variable
      GEO_ASCII_PARAMS: 34737 // [GeoTIFF] TYPE: ascii    N: variable
    });

    const typeMapping = new Map([
      [Type.BYTE, Uint8Array],
      [Type.ASCII, Uint8Array],
      [Type.SHORT, Uint16Array],
      [Type.LONG, Uint32Array],
      [Type.RATIONAL, Uint32Array],
      [Type.SBYTE, Int8Array],
      [Type.UNDEFINED, Uint8Array],
      [Type.SSHORT, Int16Array],
      [Type.SLONG, Int32Array],
      [Type.SRATIONAL, Int32Array],
      [Type.FLOAT, Float32Array],
      [Type.DOUBLE, Float64Array]
    ]);

    class IFDEntry {
      constructor(tag, type, count, offset, value) {
        this.tag = tag;
        this.type = type;
        this.count = count;
        this.offset = offset;
        this.value = value;
      }
    }

    class Image {
      constructor() {
        this.width = 0;
        this.height = 0;
        this.buffer = null;
        this.metadata = [];
      }
    }

    class Reader {
      constructor() {}

      static read(data) {
        let endiannessTag = String.fromCharCode(
          ...Array.from(data.slice(0, 2))
        );
        let endianness = Endianness.fromValue(endiannessTag);

        let tiffCheckTag = data.readUInt8(2);

        if (tiffCheckTag !== 42) {
          throw new Error("not a valid tiff file");
        }

        let offsetToFirstIFD = data.readUInt32LE(4);

        console.log("offsetToFirstIFD", offsetToFirstIFD);

        let ifds = [];
        let IFDsRead = false;
        let currentIFDOffset = offsetToFirstIFD;
        let i = 0;
        while (IFDsRead || i < 100) {
          console.log("currentIFDOffset", currentIFDOffset);
          let numEntries = data.readUInt16LE(currentIFDOffset);
          let nextIFDOffset = data.readUInt32LE(
            currentIFDOffset + 2 + numEntries * 12
          );

          console.log("next offset: ", currentIFDOffset + 2 + numEntries * 12);

          let entryBuffer = data.slice(
            currentIFDOffset + 2,
            currentIFDOffset + 2 + 12 * numEntries
          );

          for (let i = 0; i < numEntries; i++) {
            let tag = Tag.fromValue(entryBuffer.readUInt16LE(i * 12));
            let type = Type.fromValue(entryBuffer.readUInt16LE(i * 12 + 2));
            let count = entryBuffer.readUInt32LE(i * 12 + 4);
            let offsetOrValue = entryBuffer.readUInt32LE(i * 12 + 8);
            let valueBytes = type.bytes * count;

            let value;
            if (valueBytes <= 4) {
              value = offsetOrValue;
            } else {
              let valueBuffer = new Uint8Array(valueBytes);
              valueBuffer.set(
                data.slice(offsetOrValue, offsetOrValue + valueBytes)
              );

              let ArrayType = typeMapping.get(type);

              value = new ArrayType(valueBuffer.buffer);

              if (type === Type.ASCII) {
                value = String.fromCharCode(...value);
              }
            }

            let ifd = new IFDEntry(tag, type, count, offsetOrValue, value);

            ifds.push(ifd);
          }

          console.log("nextIFDOffset", nextIFDOffset);

          if (nextIFDOffset === 0) {
            break;
          }

          currentIFDOffset = nextIFDOffset;
          i++;
        }

        let ifdForTag = tag => {
          for (let entry of ifds) {
            if (entry.tag === tag) {
              return entry;
            }
          }

          return null;
        };

        let width = ifdForTag(Tag.IMAGE_WIDTH, ifds).value;
        let height = ifdForTag(Tag.IMAGE_HEIGHT, ifds).value;
        let compression = ifdForTag(Tag.COMPRESSION, ifds).value;
        let rowsPerStrip = ifdForTag(Tag.ROWS_PER_STRIP, ifds).value;
        let ifdStripOffsets = ifdForTag(Tag.STRIP_OFFSETS, ifds);
        let ifdStripByteCounts = ifdForTag(Tag.STRIP_BYTE_COUNTS, ifds);

        let numStrips = Math.ceil(height / rowsPerStrip);

        let stripByteCounts = [];
        for (let i = 0; i < ifdStripByteCounts.count; i++) {
          let type = ifdStripByteCounts.type;
          let offset = ifdStripByteCounts.offset + i * type.bytes;

          let value;
          if (type === Type.SHORT) {
            value = data.readUInt16LE(offset);
          } else if (type === Type.LONG) {
            value = data.readUInt32LE(offset);
          }

          stripByteCounts.push(value);
        }

        let stripOffsets = [];
        for (let i = 0; i < ifdStripOffsets.count; i++) {
          let type = ifdStripOffsets.type;
          let offset = ifdStripOffsets.offset + i * type.bytes;

          let value;
          if (type === Type.SHORT) {
            value = data.readUInt16LE(offset);
          } else if (type === Type.LONG) {
            value = data.readUInt32LE(offset);
          }

          stripOffsets.push(value);
        }

        let imageBuffer = new Uint8Array(width * height * 3);

        let linesProcessed = 0;
        for (let i = 0; i < numStrips; i++) {
          let stripOffset = stripOffsets[i];
          let stripBytes = stripByteCounts[i];
          let stripData = data.slice(stripOffset, stripOffset + stripBytes);
          let lineBytes = width * 3;
          for (let y = 0; y < rowsPerStrip; y++) {
            let line = stripData.slice(
              y * lineBytes,
              y * lineBytes + lineBytes
            );
            imageBuffer.set(line, linesProcessed * lineBytes);

            if (line.length === lineBytes) {
              linesProcessed++;
            } else {
              break;
            }
          }
        }

        console.log(`width: ${width}`);
        console.log(`height: ${height}`);
        console.log(`numStrips: ${numStrips}`);
        console.log("stripByteCounts", stripByteCounts.join(", "));
        console.log("stripOffsets", stripOffsets.join(", "));

        let image = new Image();
        image.width = width;
        image.height = height;
        image.buffer = imageBuffer;
        image.metadata = ifds;

        return image;
      }
    }

    class Exporter {
      constructor() {}

      static toTiffBuffer(image, params = {}) {
        let offsetToFirstIFD = 8;

        let headerBuffer = new Uint8Array([
          0x49,
          0x49,
          42,
          0,
          offsetToFirstIFD,
          0,
          0,
          0
        ]);

        let [width, height] = [image.width, image.height];

        let ifds = [
          new IFDEntry(Tag.IMAGE_WIDTH, Type.SHORT, 1, null, width),
          new IFDEntry(Tag.IMAGE_HEIGHT, Type.SHORT, 1, null, height),
          new IFDEntry(
            Tag.BITS_PER_SAMPLE,
            Type.SHORT,
            4,
            null,
            new Uint16Array([8, 8, 8, 8])
          ),
          new IFDEntry(Tag.COMPRESSION, Type.SHORT, 1, null, 1),
          new IFDEntry(Tag.PHOTOMETRIC_INTERPRETATION, Type.SHORT, 1, null, 2),
          new IFDEntry(Tag.ORIENTATION, Type.SHORT, 1, null, 1),
          new IFDEntry(Tag.SAMPLES_PER_PIXEL, Type.SHORT, 1, null, 4),
          new IFDEntry(Tag.ROWS_PER_STRIP, Type.LONG, 1, null, height),
          new IFDEntry(
            Tag.STRIP_BYTE_COUNTS,
            Type.LONG,
            1,
            null,
            width * height * 3
          ),
          new IFDEntry(Tag.PLANAR_CONFIGURATION, Type.SHORT, 1, null, 1),
          new IFDEntry(Tag.RESOLUTION_UNIT, Type.SHORT, 1, null, 1),
          new IFDEntry(Tag.SOFTWARE, Type.ASCII, 6, null, "......"),
          new IFDEntry(Tag.STRIP_OFFSETS, Type.LONG, 1, null, null),
          new IFDEntry(
            Tag.X_RESOLUTION,
            Type.RATIONAL,
            1,
            null,
            new Uint32Array([1, 1])
          ),
          new IFDEntry(
            Tag.Y_RESOLUTION,
            Type.RATIONAL,
            1,
            null,
            new Uint32Array([1, 1])
          )
        ];

        if (params.ifdEntries) {
          ifds.push(...params.ifdEntries);
        }

        let valueOffset = offsetToFirstIFD + 2 + ifds.length * 12 + 4;

        // create 12 byte buffer for each ifd and variable length buffers for ifd values
        let ifdEntryBuffers = new Map();
        let ifdValueBuffers = new Map();
        for (let ifd of ifds) {
          let entryBuffer = new ArrayBuffer(12);
          let entryView = new DataView(entryBuffer);

          let valueBytes = ifd.type.bytes * ifd.count;

          entryView.setUint16(0, ifd.tag.value, true);
          entryView.setUint16(2, ifd.type.value, true);
          entryView.setUint32(4, ifd.count, true);

          if (ifd.count === 1 && ifd.type.bytes <= 4) {
            entryView.setUint32(8, ifd.value, true);
          } else {
            entryView.setUint32(8, valueOffset, true);

            let valueBuffer = new Uint8Array(ifd.count * ifd.type.bytes);
            if (ifd.type === Type.ASCII) {
              valueBuffer.set(
                new Uint8Array(ifd.value.split("").map(c => c.charCodeAt(0)))
              );
            } else {
              valueBuffer.set(new Uint8Array(ifd.value.buffer));
            }
            ifdValueBuffers.set(ifd.tag, valueBuffer);

            valueOffset = valueOffset + valueBuffer.byteLength;
          }

          ifdEntryBuffers.set(ifd.tag, entryBuffer);
        }

        let imageBufferOffset = valueOffset;

        new DataView(ifdEntryBuffers.get(Tag.STRIP_OFFSETS)).setUint32(
          8,
          imageBufferOffset,
          true
        );

        let concatBuffers = buffers => {
          let totalLength = buffers.reduce(
            (sum, buffer) => sum + buffer.byteLength,
            0
          );
          let merged = new Uint8Array(totalLength);

          let offset = 0;
          for (let buffer of buffers) {
            merged.set(new Uint8Array(buffer), offset);
            offset += buffer.byteLength;
          }

          return merged;
        };

        let ifdBuffer = concatBuffers([
          new Uint16Array([ifds.length]),
          ...ifdEntryBuffers.values(),
          new Uint32Array([0])
        ]);
        let ifdValueBuffer = concatBuffers([...ifdValueBuffers.values()]);

        let tiffBuffer = concatBuffers([
          headerBuffer,
          ifdBuffer,
          ifdValueBuffer,
          image.buffer
        ]);

        return { width: width, height: height, buffer: tiffBuffer };
      }
    }

    exports.Tag = Tag;
    exports.Type = Type;
    exports.IFDEntry = IFDEntry;
    exports.Image = Image;
    exports.Reader = Reader;
    exports.Exporter = Exporter;

    return exports;
  })({});

  class Message {
    constructor(content) {
      this.content = content;

      let closeIcon = `${exports.resourcePath}/icons/close.svg`;

      this.element = $(`
			<div class="potree_message">
				<span name="content_container" style="flex-grow: 1; padding: 5px"></span>
				<img name="close" src="${closeIcon}" class="button-icon" style="width: 16px; height: 16px;">
			</div>`);

      this.elClose = this.element.find("img[name=close]");

      this.elContainer = this.element.find("span[name=content_container]");

      if (typeof content === "string") {
        this.elContainer.append($(`<span>${content}</span>`));
      } else {
        this.elContainer.append(content);
      }
    }

    setMessage(content) {
      this.elContainer.empty();
      if (typeof content === "string") {
        this.elContainer.append($(`<span>${content}</span>`));
      } else {
        this.elContainer.append(content);
      }
    }
  }

  class PointCloudSM {
    constructor(potreeRenderer) {
      this.potreeRenderer = potreeRenderer;
      this.threeRenderer = this.potreeRenderer.threeRenderer;

      this.target = new THREE.WebGLRenderTarget(2 * 1024, 2 * 1024, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
        type: THREE.FloatType
      });
      this.target.depthTexture = new THREE.DepthTexture();
      this.target.depthTexture.type = THREE.UnsignedIntType;

      //this.target = new THREE.WebGLRenderTarget(1024, 1024, {
      //	minFilter: THREE.NearestFilter,
      //	magFilter: THREE.NearestFilter,
      //	format: THREE.RGBAFormat,
      //	type: THREE.FloatType,
      //	depthTexture: new THREE.DepthTexture(undefined, undefined, THREE.UnsignedIntType)
      //});

      this.threeRenderer.setClearColor(0x000000, 1);
      this.threeRenderer.clearTarget(this.target, true, true, true);
    }

    setLight(light) {
      this.light = light;

      let fov = (180 * light.angle) / Math.PI;
      let aspect = light.shadow.mapSize.width / light.shadow.mapSize.height;
      let near = 0.1;
      let far = light.distance === 0 ? 10000 : light.distance;
      this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
      this.camera.up.set(0, 0, 1);
      this.camera.position.copy(light.position);

      let target = new THREE.Vector3().addVectors(
        light.position,
        light.getWorldDirection(new THREE.Vector3())
      );
      this.camera.lookAt(target);

      this.camera.updateProjectionMatrix();
      this.camera.updateMatrix();
      this.camera.updateMatrixWorld();
      this.camera.matrixWorldInverse.getInverse(this.camera.matrixWorld);
    }

    setSize(width, height) {
      if (this.target.width !== width || this.target.height !== height) {
        this.target.dispose();
      }
      this.target.setSize(width, height);
    }

    render(scene, camera) {
      //this.threeRenderer.setClearColor(0x00ff00, 1);

      this.threeRenderer.clearTarget(this.target, true, true, true);
      this.potreeRenderer.render(scene, this.camera, this.target, {});
    }
  }

  class SpotLightHelper extends THREE.Object3D {
    constructor(light, color) {
      super();

      this.light = light;
      this.color = color;

      //this.up.set(0, 0, 1);
      this.updateMatrix();
      this.updateMatrixWorld();

      {
        // SPHERE
        let sg = new THREE.SphereGeometry(1, 32, 32);
        let sm = new THREE.MeshNormalMaterial();
        this.sphere = new THREE.Mesh(sg, sm);
        this.sphere.scale.set(0.5, 0.5, 0.5);
        this.add(this.sphere);
      }

      {
        // LINES

        let positions = new Float32Array([
          +0,
          +0,
          +0,
          +0,
          +0,
          +1,

          +0,
          +0,
          +0,
          -1,
          -1,
          +1,
          +0,
          +0,
          +0,
          +1,
          -1,
          +1,
          +0,
          +0,
          +0,
          +1,
          +1,
          +1,
          +0,
          +0,
          +0,
          -1,
          +1,
          +1,

          -1,
          -1,
          +1,
          +1,
          -1,
          +1,
          +1,
          -1,
          +1,
          +1,
          +1,
          +1,
          +1,
          +1,
          +1,
          -1,
          +1,
          +1,
          -1,
          +1,
          +1,
          -1,
          -1,
          +1
        ]);

        let geometry = new THREE.BufferGeometry();
        geometry.addAttribute(
          "position",
          new THREE.BufferAttribute(positions, 3)
        );

        let material = new THREE.LineBasicMaterial();

        this.frustum = new THREE.LineSegments(geometry, material);
        this.add(this.frustum);
      }

      this.update();
    }

    update() {
      this.light.updateMatrix();
      this.light.updateMatrixWorld();

      let position = this.light.position;
      //let target = new THREE.Vector3().addVectors(
      //	light.position,
      //	new THREE.Vector3().subVectors(light.position, this.light.getWorldDirection(new THREE.Vector3())));
      let target = new THREE.Vector3().addVectors(
        light.position,
        this.light.getWorldDirection(new THREE.Vector3()).multiplyScalar(-1)
      );

      let quat = new THREE.Quaternion().setFromRotationMatrix(
        new THREE.Matrix4().lookAt(position, target, new THREE.Vector3(0, 0, 1))
      );

      this.setRotationFromQuaternion(quat);
      this.position.copy(position);

      let coneLength = this.light.distance > 0 ? this.light.distance : 1000;
      let coneWidth = coneLength * Math.tan(this.light.angle * 0.5);

      this.frustum.scale.set(coneWidth, coneWidth, coneLength);

      //{
      //	let fov = (180 * light.angle) / Math.PI;
      //	let aspect = light.shadow.mapSize.width / light.shadow.mapSize.height;
      //	let near = 0.1;
      //	let far = light.distance === 0 ? 10000 : light.distance;
      //	this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
      //	this.camera.up.set(0, 0, 1);
      //	this.camera.position.copy(light.position);

      //	let target = new THREE.Vector3().addVectors(light.position, light.getWorldDirection(new THREE.Vector3()));
      //	this.camera.lookAt(target);

      //	this.camera.updateProjectionMatrix();
      //	this.camera.updateMatrix();
      //	this.camera.updateMatrixWorld();
      //	this.camera.matrixWorldInverse.getInverse(this.camera.matrixWorld);
      //}
    }
  }

  function toInterleavedBufferAttribute(pointAttribute) {
    let att = null;

    if (pointAttribute.name === PointAttribute.POSITION_CARTESIAN.name) {
      att = new Potree.InterleavedBufferAttribute(
        "position",
        12,
        3,
        "FLOAT",
        false
      );
    } else if (pointAttribute.name === PointAttribute.COLOR_PACKED.name) {
      att = new Potree.InterleavedBufferAttribute(
        "color",
        4,
        4,
        "UNSIGNED_BYTE",
        true
      );
    } else if (pointAttribute.name === PointAttribute.INTENSITY.name) {
      att = new Potree.InterleavedBufferAttribute(
        "intensity",
        4,
        1,
        "FLOAT",
        false
      );
    } else if (pointAttribute.name === PointAttribute.CLASSIFICATION.name) {
      att = new Potree.InterleavedBufferAttribute(
        "classification",
        4,
        1,
        "FLOAT",
        false
      );
    } else if (pointAttribute.name === PointAttribute.RETURN_NUMBER.name) {
      att = new Potree.InterleavedBufferAttribute(
        "returnNumber",
        4,
        1,
        "FLOAT",
        false
      );
    } else if (pointAttribute.name === PointAttribute.NUMBER_OF_RETURNS.name) {
      att = new Potree.InterleavedBufferAttribute(
        "numberOfReturns",
        4,
        1,
        "FLOAT",
        false
      );
    } else if (pointAttribute.name === PointAttribute.SOURCE_ID.name) {
      att = new Potree.InterleavedBufferAttribute(
        "pointSourceID",
        4,
        1,
        "FLOAT",
        false
      );
    } else if (
      pointAttribute.name === PointAttribute.NORMAL_SPHEREMAPPED.name
    ) {
      att = new Potree.InterleavedBufferAttribute(
        "normal",
        12,
        3,
        "FLOAT",
        false
      );
    } else if (pointAttribute.name === PointAttribute.NORMAL_OCT16.name) {
      att = new Potree.InterleavedBufferAttribute(
        "normal",
        12,
        3,
        "FLOAT",
        false
      );
    } else if (pointAttribute.name === PointAttribute.NORMAL.name) {
      att = new Potree.InterleavedBufferAttribute(
        "normal",
        12,
        3,
        "FLOAT",
        false
      );
    }

    return att;
  }


  class PotreeRenderer {
    constructor(viewer) {
      this.viewer = viewer;
    }

    render() {
      const viewer = this.viewer;

      viewer.dispatchEvent({ type: "render.pass.begin", viewer: viewer });

      // render skybox
      if (viewer.background === "skybox") {
        viewer.renderer.clear(true, true, false);
        viewer.skybox.camera.rotation.copy(viewer.scene.cameraP.rotation);
        viewer.skybox.camera.fov = viewer.scene.cameraP.fov;
        viewer.skybox.camera.aspect = viewer.scene.cameraP.aspect;
        viewer.skybox.camera.updateProjectionMatrix();
        viewer.renderer.render(viewer.skybox.scene, viewer.skybox.camera);
      } else if (viewer.background === "gradient") {
        viewer.renderer.clear(true, true, false);
        viewer.renderer.render(viewer.scene.sceneBG, viewer.scene.cameraBG);
      } else if (viewer.background === "black") {
        viewer.renderer.setClearColor(0x000000, 1);
        viewer.renderer.clear(true, true, false);
      } else if (viewer.background === "white") {
        viewer.renderer.setClearColor(0xffffff, 1);
        viewer.renderer.clear(true, true, false);
      } else {
        viewer.renderer.setClearColor(0x000000, 0);
        viewer.renderer.clear(true, true, false);
      }

      for (let pointcloud of this.viewer.scene.pointclouds) {
        pointcloud.material.useEDL = false;
      }

      let activeCam = viewer.scene.getActiveCamera();
      //viewer.renderer.render(viewer.scene.scenePointCloud, activeCam);

      viewer.pRenderer.render(viewer.scene.scenePointCloud, activeCam, null, {
        clipSpheres: viewer.scene.volumes.filter(
          v => v instanceof Potree.SphereVolume
        )
      });

      // render scene
      viewer.renderer.render(viewer.scene.scene, activeCam);

      viewer.dispatchEvent({ type: "render.pass.scene", viewer: viewer });

      viewer.clippingTool.update();
      viewer.renderer.render(
        viewer.clippingTool.sceneMarker,
        viewer.scene.cameraScreenSpace
      ); //viewer.scene.cameraScreenSpace);
      viewer.renderer.render(viewer.clippingTool.sceneVolume, activeCam);

      viewer.renderer.render(viewer.controls.sceneControls, activeCam);

      viewer.renderer.clearDepth();

      viewer.transformationTool.update();

      viewer.dispatchEvent({
        type: "render.pass.perspective_overlay",
        viewer: viewer
      });

      viewer.renderer.render(viewer.transformationTool.scene, activeCam);

      viewer.renderer.setViewport(
        viewer.renderer.domElement.clientWidth - viewer.navigationCube.width,
        viewer.renderer.domElement.clientHeight - viewer.navigationCube.width,
        viewer.navigationCube.width,
        viewer.navigationCube.width
      );
      viewer.renderer.render(
        viewer.navigationCube,
        viewer.navigationCube.camera
      );
      viewer.renderer.setViewport(
        0,
        0,
        viewer.renderer.domElement.clientWidth,
        viewer.renderer.domElement.clientHeight
      );

      viewer.dispatchEvent({ type: "render.pass.end", viewer: viewer });
    }
  }

  class EDLRenderer {
    constructor(viewer) {
      this.viewer = viewer;

      this.edlMaterial = null;

      this.rtRegular;
      this.rtEDL;

      this.gl = viewer.renderer.context;

      this.shadowMap = new PointCloudSM(this.viewer.pRenderer);
    }

    initEDL() {
      if (this.edlMaterial != null) {
        return;
      }

      this.edlMaterial = new EyeDomeLightingMaterial();
      this.edlMaterial.depthTest = true;
      this.edlMaterial.depthWrite = true;
      this.edlMaterial.transparent = true;

      this.rtEDL = new THREE.WebGLRenderTarget(1024, 1024, {
        minFilter: THREE.NearestFilter,
        magFilter: THREE.NearestFilter,
        format: THREE.RGBAFormat,
        type: THREE.FloatType,
        depthTexture: new THREE.DepthTexture(
          undefined,
          undefined,
          THREE.UnsignedIntType
        )
      });

      this.rtRegular = new THREE.WebGLRenderTarget(1024, 1024, {
        minFilter: THREE.NearestFilter,
        magFilter: THREE.NearestFilter,
        format: THREE.RGBAFormat,
        depthTexture: new THREE.DepthTexture(
          undefined,
          undefined,
          THREE.UnsignedIntType
        )
      });

      //{
      //	let geometry = new THREE.PlaneBufferGeometry( 1, 1, 32, 32);
      //	let material = new THREE.MeshBasicMaterial( {side: THREE.DoubleSide, map: this.shadowMap.target.texture} );
      //	let plane = new THREE.Mesh( geometry, material );
      //	plane.scale.set(0.5, 0.5, 1.0);
      //	plane.position.set(plane.scale.x / 2, plane.scale.y / 2, 0);
      //	this.viewer.overlay.add(plane);
      //}
    }

    resize() {
      const viewer = this.viewer;

      let pixelRatio = viewer.renderer.getPixelRatio();
      let { width, height } = viewer.renderer.getSize();

      if (this.screenshot) {
        width = this.screenshot.target.width;
        height = this.screenshot.target.height;
      }

      this.rtEDL.setSize(width * pixelRatio, height * pixelRatio);
      this.rtRegular.setSize(width * pixelRatio, height * pixelRatio);
    }

    makeScreenshot(camera, size, callback) {
      if (camera === undefined || camera === null) {
        camera = this.viewer.scene.getActiveCamera();
      }

      if (size === undefined || size === null) {
        size = this.viewer.renderer.getSize();
      }

      let { width, height } = size;

      //let maxTextureSize = viewer.renderer.capabilities.maxTextureSize;
      //if(width * 4 <
      width = 2 * width;
      height = 2 * height;

      let target = new THREE.WebGLRenderTarget(width, height, {
        format: THREE.RGBAFormat
      });

      this.screenshot = {
        target: target
      };

      this.viewer.renderer.clearTarget(target, true, true, true);

      this.render();

      let pixelCount = width * height;
      let buffer = new Uint8Array(4 * pixelCount);

      this.viewer.renderer.readRenderTargetPixels(
        target,
        0,
        0,
        width,
        height,
        buffer
      );

      // flip vertically
      let bytesPerLine = width * 4;
      for (let i = 0; i < parseInt(height / 2); i++) {
        let j = height - i - 1;

        let lineI = buffer.slice(
          i * bytesPerLine,
          i * bytesPerLine + bytesPerLine
        );
        let lineJ = buffer.slice(
          j * bytesPerLine,
          j * bytesPerLine + bytesPerLine
        );
        buffer.set(lineJ, i * bytesPerLine);
        buffer.set(lineI, j * bytesPerLine);
      }

      this.screenshot.target.dispose();
      delete this.screenshot;

      return {
        width: width,
        height: height,
        buffer: buffer
      };
    }

    render() {
      this.initEDL();
      const viewer = this.viewer;

      viewer.dispatchEvent({ type: "render.pass.begin", viewer: viewer });

      this.resize();

      if (this.screenshot) {
        let oldBudget = Potree.pointBudget;
        Potree.pointBudget = Math.max(10 * 1000 * 1000, 2 * oldBudget);
        let result = Potree.updatePointClouds(
          viewer.scene.pointclouds,
          viewer.scene.getActiveCamera(),
          viewer.renderer
        );
        Potree.pointBudget = oldBudget;
      }

      let camera = viewer.scene.getActiveCamera();

      let lights = [];
      viewer.scene.scene.traverse(node => {
        if (node instanceof THREE.SpotLight) {
          lights.push(node);
        }
      });

      if (viewer.background === "skybox") {
        viewer.renderer.setClearColor(0x000000, 0);
        viewer.renderer.clear();
        viewer.skybox.camera.rotation.copy(viewer.scene.cameraP.rotation);
        viewer.skybox.camera.fov = viewer.scene.cameraP.fov;
        viewer.skybox.camera.aspect = viewer.scene.cameraP.aspect;
        viewer.skybox.camera.updateProjectionMatrix();
        viewer.renderer.render(viewer.skybox.scene, viewer.skybox.camera);
      } else if (viewer.background === "gradient") {
        viewer.renderer.setClearColor(0x000000, 0);
        viewer.renderer.clear();
        viewer.renderer.render(viewer.scene.sceneBG, viewer.scene.cameraBG);
      } else if (viewer.background === "black") {
        viewer.renderer.setClearColor(0x000000, 1);
        viewer.renderer.clear();
      } else if (viewer.background === "white") {
        viewer.renderer.setClearColor(0xffffff, 1);
        viewer.renderer.clear();
      } else {
        viewer.renderer.setClearColor(0x000000, 0);
        viewer.renderer.clear();
      }

      // TODO adapt to multiple lights
      if (lights.length > 0 && !lights[0].disableShadowUpdates) {
        let light = lights[0];

        this.shadowMap.setLight(light);

        let originalAttributes = new Map();
        for (let pointcloud of viewer.scene.pointclouds) {
          originalAttributes.set(
            pointcloud,
            pointcloud.material.pointColorType
          );
          pointcloud.material.disableEvents();
          pointcloud.material.pointColorType = PointColorType.DEPTH;
        }

        this.shadowMap.render(viewer.scene.scenePointCloud, camera);

        for (let pointcloud of viewer.scene.pointclouds) {
          let originalAttribute = originalAttributes.get(pointcloud);
          pointcloud.material.pointColorType = originalAttribute;
          pointcloud.material.enableEvents();
        }

        viewer.shadowTestCam.updateMatrixWorld();
        viewer.shadowTestCam.matrixWorldInverse.getInverse(
          viewer.shadowTestCam.matrixWorld
        );
        viewer.shadowTestCam.updateProjectionMatrix();
      }

      //viewer.renderer.render(viewer.scene.scene, camera);

      //viewer.renderer.clearTarget( this.rtColor, true, true, true );
      viewer.renderer.clearTarget(this.rtEDL, true, true, true);
      viewer.renderer.clearTarget(this.rtRegular, true, true, false);

      let width = viewer.renderer.getSize().width;
      let height = viewer.renderer.getSize().height;

      // COLOR & DEPTH PASS
      for (let pointcloud of viewer.scene.pointclouds) {
        let octreeSize = pointcloud.pcoGeometry.boundingBox.getSize(
          new THREE.Vector3()
        ).x;

        let material = pointcloud.material;
        material.weighted = false;
        material.useLogarithmicDepthBuffer = false;
        material.useEDL = true;

        material.screenWidth = width;
        material.screenHeight = height;
        material.uniforms.visibleNodes.value =
          pointcloud.material.visibleNodesTexture;
        material.uniforms.octreeSize.value = octreeSize;
        material.spacing =
          pointcloud.pcoGeometry.spacing *
          Math.max(pointcloud.scale.x, pointcloud.scale.y, pointcloud.scale.z);
      }

      // TODO adapt to multiple lights
      if (lights.length > 0) {
        viewer.pRenderer.render(
          viewer.scene.scenePointCloud,
          camera,
          this.rtEDL,
          {
            clipSpheres: viewer.scene.volumes.filter(
              v => v instanceof SphereVolume
            ),
            shadowMaps: [this.shadowMap],
            transparent: false
          }
        );
      } else {
        viewer.pRenderer.render(
          viewer.scene.scenePointCloud,
          camera,
          this.rtEDL,
          {
            clipSpheres: viewer.scene.volumes.filter(
              v => v instanceof SphereVolume
            ),
            transparent: false
          }
        );
      }

      //viewer.renderer.render(viewer.scene.scene, camera, this.rtRegular);
      viewer.renderer.render(viewer.scene.scene, camera);

      //viewer.renderer.setRenderTarget(this.rtColor);
      //viewer.dispatchEvent({type: "render.pass.scene", viewer: viewer, renderTarget: this.rtRegular});

      {
        // EDL OCCLUSION PASS
        this.edlMaterial.uniforms.screenWidth.value = width;
        this.edlMaterial.uniforms.screenHeight.value = height;

        //this.edlMaterial.uniforms.colorMap.value = this.rtColor.texture;

        let proj = camera.projectionMatrix;
        let projArray = new Float32Array(16);
        projArray.set(proj.elements);

        this.edlMaterial.uniforms.uNear.value = camera.near;
        this.edlMaterial.uniforms.uFar.value = camera.far;
        //this.edlMaterial.uniforms.uRegularColor.value = this.rtRegular.texture;
        this.edlMaterial.uniforms.uEDLColor.value = this.rtEDL.texture;
        //this.edlMaterial.uniforms.uRegularDepth.value = this.rtRegular.depthTexture;
        this.edlMaterial.uniforms.uEDLDepth.value = this.rtEDL.depthTexture;
        this.edlMaterial.uniforms.uProj.value = projArray;

        this.edlMaterial.uniforms.edlStrength.value = viewer.edlStrength;
        this.edlMaterial.uniforms.radius.value = viewer.edlRadius;
        this.edlMaterial.uniforms.opacity.value = 1;

        Utils.screenPass.render(viewer.renderer, this.edlMaterial);

        if (this.screenshot) {
          Utils.screenPass.render(
            viewer.renderer,
            this.edlMaterial,
            this.screenshot.target
          );
        }
      }

      viewer.renderer.clearDepth();

      viewer.transformationTool.update();

      viewer.dispatchEvent({
        type: "render.pass.perspective_overlay",
        viewer: viewer
      });

      viewer.renderer.render(viewer.controls.sceneControls, camera);
      viewer.renderer.render(viewer.clippingTool.sceneVolume, camera);
      viewer.renderer.render(viewer.transformationTool.scene, camera);

      viewer.renderer.setViewport(
        width - viewer.navigationCube.width,
        height - viewer.navigationCube.width,
        viewer.navigationCube.width,
        viewer.navigationCube.width
      );
      viewer.renderer.render(
        viewer.navigationCube,
        viewer.navigationCube.camera
      );
      viewer.renderer.setViewport(0, 0, width, height);

      viewer.dispatchEvent({ type: "render.pass.end", viewer: viewer });
    }
  }

  class HQSplatRenderer {
    constructor(viewer) {
      this.viewer = viewer;

      this.depthMaterials = new Map();
      this.attributeMaterials = new Map();
      this.normalizationMaterial = null;

      this.rtDepth = null;
      this.rtAttribute = null;
      this.gl = viewer.renderer.context;

      this.initialized = false;
    }

    init() {
      if (this.initialized) {
        return;
      }

      this.normalizationMaterial = new NormalizationMaterial();
      this.normalizationMaterial.depthTest = true;
      this.normalizationMaterial.depthWrite = true;
      this.normalizationMaterial.transparent = true;

      this.normalizationEDLMaterial = new NormalizationEDLMaterial();
      this.normalizationEDLMaterial.depthTest = true;
      this.normalizationEDLMaterial.depthWrite = true;
      this.normalizationEDLMaterial.transparent = true;

      this.rtDepth = new THREE.WebGLRenderTarget(1024, 1024, {
        minFilter: THREE.NearestFilter,
        magFilter: THREE.NearestFilter,
        format: THREE.RGBAFormat,
        type: THREE.FloatType,
        depthTexture: new THREE.DepthTexture(
          undefined,
          undefined,
          THREE.UnsignedIntType
        )
      });

      this.rtAttribute = new THREE.WebGLRenderTarget(1024, 1024, {
        minFilter: THREE.NearestFilter,
        magFilter: THREE.NearestFilter,
        format: THREE.RGBAFormat,
        type: THREE.FloatType,
        depthTexture: this.rtDepth.depthTexture
        //depthTexture: new THREE.DepthTexture(undefined, undefined, THREE.UnsignedIntType)
      });

      //{
      //	let geometry = new THREE.PlaneBufferGeometry( 1, 1, 32, 32);
      //	let material = new THREE.MeshBasicMaterial( {side: THREE.DoubleSide, map: this.rtDepth.texture} );
      //	let plane = new THREE.Mesh( geometry, material );
      //	plane.scale.set(0.3, 0.3, 1.0);
      //	plane.position.set(plane.scale.x / 2, plane.scale.y / 2, 0);
      //	this.viewer.overlay.add(plane);
      //}

      this.initialized = true;
    }

    resize() {
      const viewer = this.viewer;

      let pixelRatio = viewer.renderer.getPixelRatio();
      let width = viewer.renderer.getSize().width;
      let height = viewer.renderer.getSize().height;
      this.rtDepth.setSize(width * pixelRatio, height * pixelRatio);
      this.rtAttribute.setSize(width * pixelRatio, height * pixelRatio);
    }

    render() {
      this.init();
      const viewer = this.viewer;

      viewer.dispatchEvent({ type: "render.pass.begin", viewer: viewer });

      this.resize();

      let camera = viewer.scene.getActiveCamera();

      viewer.renderer.setClearColor(0x000000, 0);
      viewer.renderer.clearTarget(this.rtDepth, true, true, true);
      viewer.renderer.clearTarget(this.rtAttribute, true, true, true);

      let width = viewer.renderer.getSize().width;
      let height = viewer.renderer.getSize().height;

      let visiblePointClouds = viewer.scene.pointclouds.filter(
        pc => pc.visible
      );
      let originalMaterials = new Map();

      for (let pointcloud of visiblePointClouds) {
        originalMaterials.set(pointcloud, pointcloud.material);

        if (!this.attributeMaterials.has(pointcloud)) {
          let attributeMaterial = new PointCloudMaterial();
          this.attributeMaterials.set(pointcloud, attributeMaterial);
        }

        if (!this.depthMaterials.has(pointcloud)) {
          let depthMaterial = new PointCloudMaterial();

          depthMaterial.setDefine("depth_pass", "#define hq_depth_pass");
          depthMaterial.setDefine("use_edl", "#define use_edl");

          this.depthMaterials.set(pointcloud, depthMaterial);
        }
      }

      {
        // DEPTH PASS
        for (let pointcloud of visiblePointClouds) {
          let octreeSize = pointcloud.pcoGeometry.boundingBox.getSize(
            new THREE.Vector3()
          ).x;

          let material = originalMaterials.get(pointcloud);
          let depthMaterial = this.depthMaterials.get(pointcloud);

          depthMaterial.size = material.size;
          depthMaterial.minSize = material.minSize;
          depthMaterial.maxSize = material.maxSize;

          depthMaterial.pointSizeType = material.pointSizeType;
          depthMaterial.visibleNodesTexture = material.visibleNodesTexture;
          depthMaterial.weighted = false;
          depthMaterial.screenWidth = width;
          depthMaterial.shape = PointShape.CIRCLE;
          depthMaterial.screenHeight = height;
          depthMaterial.uniforms.visibleNodes.value =
            material.visibleNodesTexture;
          depthMaterial.uniforms.octreeSize.value = octreeSize;
          depthMaterial.spacing =
            pointcloud.pcoGeometry.spacing *
            Math.max(...pointcloud.scale.toArray());
          depthMaterial.classification = material.classification;

          depthMaterial.uniforms.uFilterReturnNumberRange.value =
            material.uniforms.uFilterReturnNumberRange.value;
          depthMaterial.uniforms.uFilterNumberOfReturnsRange.value =
            material.uniforms.uFilterNumberOfReturnsRange.value;
          depthMaterial.uniforms.uFilterGPSTimeClipRange.value =
            material.uniforms.uFilterGPSTimeClipRange.value;

          //depthMaterial.uniforms.uGPSOffset.value = material.uniforms.uGPSOffset.value;
          //depthMaterial.uniforms.uGPSRange.value = material.uniforms.uGPSRange.value;

          depthMaterial.clipTask = material.clipTask;
          depthMaterial.clipMethod = material.clipMethod;
          depthMaterial.setClipBoxes(material.clipBoxes);
          depthMaterial.setClipPolygons(material.clipPolygons);

          pointcloud.material = depthMaterial;
        }

        viewer.pRenderer.render(
          viewer.scene.scenePointCloud,
          camera,
          this.rtDepth,
          {
            clipSpheres: viewer.scene.volumes.filter(
              v => v instanceof SphereVolume
            )
            //material: this.depthMaterial
          }
        );
      }

      {
        // ATTRIBUTE PASS
        for (let pointcloud of visiblePointClouds) {
          let octreeSize = pointcloud.pcoGeometry.boundingBox.getSize(
            new THREE.Vector3()
          ).x;

          let material = originalMaterials.get(pointcloud);
          let attributeMaterial = this.attributeMaterials.get(pointcloud);

          attributeMaterial.size = material.size;
          attributeMaterial.minSize = material.minSize;
          attributeMaterial.maxSize = material.maxSize;

          attributeMaterial.pointSizeType = material.pointSizeType;
          attributeMaterial.pointColorType = material.pointColorType;
          attributeMaterial.visibleNodesTexture = material.visibleNodesTexture;
          attributeMaterial.weighted = true;
          attributeMaterial.screenWidth = width;
          attributeMaterial.screenHeight = height;
          attributeMaterial.shape = PointShape.CIRCLE;
          attributeMaterial.uniforms.visibleNodes.value =
            material.visibleNodesTexture;
          attributeMaterial.uniforms.octreeSize.value = octreeSize;
          attributeMaterial.spacing =
            pointcloud.pcoGeometry.spacing *
            Math.max(...pointcloud.scale.toArray());
          attributeMaterial.classification = material.classification;

          attributeMaterial.uniforms.uFilterReturnNumberRange.value =
            material.uniforms.uFilterReturnNumberRange.value;
          attributeMaterial.uniforms.uFilterNumberOfReturnsRange.value =
            material.uniforms.uFilterNumberOfReturnsRange.value;
          attributeMaterial.uniforms.uFilterGPSTimeClipRange.value =
            material.uniforms.uFilterGPSTimeClipRange.value;

          attributeMaterial.elevationRange = material.elevationRange;
          attributeMaterial.gradient = material.gradient;

          attributeMaterial.intensityRange = material.intensityRange;
          attributeMaterial.intensityGamma = material.intensityGamma;
          attributeMaterial.intensityContrast = material.intensityContrast;
          attributeMaterial.intensityBrightness = material.intensityBrightness;

          attributeMaterial.rgbGamma = material.rgbGamma;
          attributeMaterial.rgbContrast = material.rgbContrast;
          attributeMaterial.rgbBrightness = material.rgbBrightness;

          attributeMaterial.weightRGB = material.weightRGB;
          attributeMaterial.weightIntensity = material.weightIntensity;
          attributeMaterial.weightElevation = material.weightElevation;
          attributeMaterial.weightRGB = material.weightRGB;
          attributeMaterial.weightClassification =
            material.weightClassification;
          attributeMaterial.weightReturnNumber = material.weightReturnNumber;
          attributeMaterial.weightSourceID = material.weightSourceID;

          attributeMaterial.color = material.color;

          attributeMaterial.clipTask = material.clipTask;
          attributeMaterial.clipMethod = material.clipMethod;
          attributeMaterial.setClipBoxes(material.clipBoxes);
          attributeMaterial.setClipPolygons(material.clipPolygons);

          pointcloud.material = attributeMaterial;
        }

        let gl = this.gl;

        viewer.renderer.setRenderTarget(null);
        viewer.pRenderer.render(
          viewer.scene.scenePointCloud,
          camera,
          this.rtAttribute,
          {
            clipSpheres: viewer.scene.volumes.filter(
              v => v instanceof SphereVolume
            ),
            //material: this.attributeMaterial,
            blendFunc: [gl.SRC_ALPHA, gl.ONE],
            //depthTest: false,
            depthWrite: false
          }
        );
      }

      for (let [pointcloud, material] of originalMaterials) {
        pointcloud.material = material;
      }

      viewer.renderer.setRenderTarget(null);
      if (viewer.background === "skybox") {
        viewer.renderer.setClearColor(0x000000, 0);
        viewer.renderer.clear();
        viewer.skybox.camera.rotation.copy(viewer.scene.cameraP.rotation);
        viewer.skybox.camera.fov = viewer.scene.cameraP.fov;
        viewer.skybox.camera.aspect = viewer.scene.cameraP.aspect;
        viewer.skybox.camera.updateProjectionMatrix();
        viewer.renderer.render(viewer.skybox.scene, viewer.skybox.camera);
      } else if (viewer.background === "gradient") {
        viewer.renderer.setClearColor(0x000000, 0);
        viewer.renderer.clear();
        viewer.renderer.render(viewer.scene.sceneBG, viewer.scene.cameraBG);
      } else if (viewer.background === "black") {
        viewer.renderer.setClearColor(0x000000, 1);
        viewer.renderer.clear();
      } else if (viewer.background === "white") {
        viewer.renderer.setClearColor(0xffffff, 1);
        viewer.renderer.clear();
      } else {
        viewer.renderer.setClearColor(0x000000, 0);
        viewer.renderer.clear();
      }

      {
        // NORMALIZATION PASS
        let normalizationMaterial = this.useEDL
          ? this.normalizationEDLMaterial
          : this.normalizationMaterial;

        if (this.useEDL) {
          normalizationMaterial.uniforms.edlStrength.value = viewer.edlStrength;
          normalizationMaterial.uniforms.radius.value = viewer.edlRadius;
          normalizationMaterial.uniforms.screenWidth.value = width;
          normalizationMaterial.uniforms.screenHeight.value = height;
          normalizationMaterial.uniforms.uEDLMap.value = this.rtDepth.texture;
        }

        normalizationMaterial.uniforms.uWeightMap.value = this.rtAttribute.texture;
        normalizationMaterial.uniforms.uDepthMap.value = this.rtAttribute.depthTexture;

        Utils.screenPass.render(viewer.renderer, normalizationMaterial);
      }

      viewer.renderer.render(viewer.scene.scene, camera);

      viewer.dispatchEvent({ type: "render.pass.scene", viewer: viewer });

      viewer.renderer.clearDepth();

      viewer.transformationTool.update();

      viewer.dispatchEvent({
        type: "render.pass.perspective_overlay",
        viewer: viewer
      });

      viewer.renderer.render(viewer.controls.sceneControls, camera);
      viewer.renderer.render(viewer.clippingTool.sceneVolume, camera);
      viewer.renderer.render(viewer.transformationTool.scene, camera);

      viewer.renderer.setViewport(
        width - viewer.navigationCube.width,
        height - viewer.navigationCube.width,
        viewer.navigationCube.width,
        viewer.navigationCube.width
      );
      viewer.renderer.render(
        viewer.navigationCube,
        viewer.navigationCube.camera
      );
      viewer.renderer.setViewport(0, 0, width, height);

      viewer.dispatchEvent({ type: "render.pass.end", viewer: viewer });
    }
  }


  // http://epsg.io/
  proj4.defs(
    "UTM10N",
    "+proj=utm +zone=10 +ellps=GRS80 +datum=NAD83 +units=m +no_defs"
  );

  class CSVExporter {
    static toString(points) {
      let string = "";

      let attributes = Object.keys(points.data)
        .filter(a => a !== "normal")
        .sort((a, b) => {
          if (a === "position") return -1;
          if (b === "position") return 1;
          if (a === "color") return -1;
          if (b === "color") return 1;
        });

      let headerValues = [];
      for (let attribute of attributes) {
        let itemSize = points.data[attribute].length / points.numPoints;

        if (attribute === "position") {
          headerValues = headerValues.concat(["x", "y", "z"]);
        } else if (attribute === "color") {
          headerValues = headerValues.concat(["r", "g", "b", "a"]);
        } else if (itemSize > 1) {
          for (let i = 0; i < itemSize; i++) {
            headerValues.push(`${attribute}_${i}`);
          }
        } else {
          headerValues.push(attribute);
        }
      }
      string = headerValues.join(", ") + "\n";

      for (let i = 0; i < points.numPoints; i++) {
        let values = [];

        for (let attribute of attributes) {
          let itemSize = points.data[attribute].length / points.numPoints;
          let value = points.data[attribute]
            .subarray(itemSize * i, itemSize * i + itemSize)
            .join(", ");
          values.push(value);
        }

        string += values.join(", ") + "\n";
      }

      return string;
    }
  }

  class LASExporter {
    static toLAS(points) {
      // TODO Unused: let string = '';

      let boundingBox = points.boundingBox;
      let offset = boundingBox.min.clone();
      let diagonal = boundingBox.min.distanceTo(boundingBox.max);
      let scale = new THREE.Vector3(0.001, 0.001, 0.001);
      if (diagonal > 1000 * 1000) {
        scale = new THREE.Vector3(0.01, 0.01, 0.01);
      } else {
        scale = new THREE.Vector3(0.001, 0.001, 0.001);
      }

      let setString = function(string, offset, buffer) {
        let view = new Uint8Array(buffer);

        for (let i = 0; i < string.length; i++) {
          let charCode = string.charCodeAt(i);
          view[offset + i] = charCode;
        }
      };

      let buffer = new ArrayBuffer(227 + 28 * points.numPoints);
      let view = new DataView(buffer);
      let u8View = new Uint8Array(buffer);
      // let u16View = new Uint16Array(buffer);

      setString("LASF", 0, buffer);
      u8View[24] = 1;
      u8View[25] = 2;

      // system identifier o:26 l:32

      // generating software o:58 l:32
      setString("Potree 1.6", 58, buffer);

      // file creation day of year o:90 l:2
      // file creation year o:92 l:2

      // header size o:94 l:2
      view.setUint16(94, 227, true);

      // offset to point data o:96 l:4
      view.setUint32(96, 227, true);

      // number of letiable length records o:100 l:4

      // point data record format 104 1
      u8View[104] = 2;

      // point data record length 105 2
      view.setUint16(105, 28, true);

      // number of point records 107 4
      view.setUint32(107, points.numPoints, true);

      // number of points by return 111 20

      // x scale factor 131 8
      view.setFloat64(131, scale.x, true);

      // y scale factor 139 8
      view.setFloat64(139, scale.y, true);

      // z scale factor 147 8
      view.setFloat64(147, scale.z, true);

      // x offset 155 8
      view.setFloat64(155, offset.x, true);

      // y offset 163 8
      view.setFloat64(163, offset.y, true);

      // z offset 171 8
      view.setFloat64(171, offset.z, true);

      // max x 179 8
      view.setFloat64(179, boundingBox.max.x, true);

      // min x 187 8
      view.setFloat64(187, boundingBox.min.x, true);

      // max y 195 8
      view.setFloat64(195, boundingBox.max.y, true);

      // min y 203 8
      view.setFloat64(203, boundingBox.min.y, true);

      // max z 211 8
      view.setFloat64(211, boundingBox.max.z, true);

      // min z 219 8
      view.setFloat64(219, boundingBox.min.z, true);

      let boffset = 227;
      for (let i = 0; i < points.numPoints; i++) {
        let px = points.data.position[3 * i + 0];
        let py = points.data.position[3 * i + 1];
        let pz = points.data.position[3 * i + 2];

        let ux = parseInt((px - offset.x) / scale.x);
        let uy = parseInt((py - offset.y) / scale.y);
        let uz = parseInt((pz - offset.z) / scale.z);

        view.setUint32(boffset + 0, ux, true);
        view.setUint32(boffset + 4, uy, true);
        view.setUint32(boffset + 8, uz, true);

        if (points.data.intensity) {
          view.setUint16(boffset + 12, points.data.intensity[i], true);
        }

        let rt = 0;
        if (points.data.returnNumber) {
          rt += points.data.returnNumber[i];
        }
        if (points.data.numberOfReturns) {
          rt += points.data.numberOfReturns[i] << 3;
        }
        view.setUint8(boffset + 14, rt);

        if (points.data.classification) {
          view.setUint8(boffset + 15, points.data.classification[i]);
        }
        // scan angle rank
        // user data
        // point source id
        if (points.data.pointSourceID) {
          view.setUint16(boffset + 18, points.data.pointSourceID[i]);
        }

        if (points.data.color) {
          view.setUint16(
            boffset + 20,
            points.data.color[4 * i + 0] * 255,
            true
          );
          view.setUint16(
            boffset + 22,
            points.data.color[4 * i + 1] * 255,
            true
          );
          view.setUint16(
            boffset + 24,
            points.data.color[4 * i + 2] * 255,
            true
          );
        }

        boffset += 28;
      }

      return buffer;
    }
  }

  class ProfilePointCloudEntry {
    constructor() {
      this.points = [];

      //let geometry = new THREE.BufferGeometry();
      let material = ProfilePointCloudEntry.getMaterialInstance();
      material.uniforms.minSize.value = 2;
      material.uniforms.maxSize.value = 2;
      material.pointColorType = PointColorType.RGB;
      material.opacity = 1.0;

      this.material = material;

      this.sceneNode = new THREE.Object3D();
      //this.sceneNode = new THREE.Points(geometry, material);
    }

    static releaseMaterialInstance(instance) {
      ProfilePointCloudEntry.materialPool.add(instance);
    }

    static getMaterialInstance() {
      let instance = ProfilePointCloudEntry.materialPool.values().next().value;
      if (!instance) {
        instance = new PointCloudMaterial();
      } else {
        ProfilePointCloudEntry.materialPool.delete(instance);
      }

      return instance;
    }

    dispose() {
      for (let child of this.sceneNode.children) {
        ProfilePointCloudEntry.releaseMaterialInstance(child.material);
        child.geometry.dispose();
      }

      this.sceneNode.children = [];
    }

    addPoints(data) {
      this.points.push(data);

      let batchSize = 10 * 1000;

      let createNewBatch = () => {
        let geometry = new THREE.BufferGeometry();

        let buffers = {
          position: new Float32Array(3 * batchSize),
          color: new Uint8Array(4 * batchSize),
          intensity: new Uint16Array(batchSize),
          classification: new Uint8Array(batchSize),
          returnNumber: new Uint8Array(batchSize),
          numberOfReturns: new Uint8Array(batchSize),
          pointSourceID: new Uint16Array(batchSize)
        };

        geometry.addAttribute(
          "position",
          new THREE.BufferAttribute(buffers.position, 3)
        );
        geometry.addAttribute(
          "color",
          new THREE.BufferAttribute(buffers.color, 4, true)
        );
        geometry.addAttribute(
          "intensity",
          new THREE.BufferAttribute(buffers.intensity, 1, false)
        );
        geometry.addAttribute(
          "classification",
          new THREE.BufferAttribute(buffers.classification, 1, false)
        );
        geometry.addAttribute(
          "returnNumber",
          new THREE.BufferAttribute(buffers.returnNumber, 1, false)
        );
        geometry.addAttribute(
          "numberOfReturns",
          new THREE.BufferAttribute(buffers.numberOfReturns, 1, false)
        );
        geometry.addAttribute(
          "pointSourceID",
          new THREE.BufferAttribute(buffers.pointSourceID, 1, false)
        );

        geometry.drawRange.start = 0;
        geometry.drawRange.count = 0;

        this.currentBatch = new THREE.Points(geometry, this.material);
        this.sceneNode.add(this.currentBatch);
      };

      if (!this.currentBatch) {
        createNewBatch();
      }

      {
        // REBUILD MODEL

        let pointsProcessed = 0;
        let updateRange = {
          start: this.currentBatch.geometry.drawRange.count,
          count: 0
        };

        let projectedBox = new THREE.Box3();

        for (let i = 0; i < data.numPoints; i++) {
          if (updateRange.start + updateRange.count >= batchSize) {
            // finalize current batch, start new batch

            for (let key of Object.keys(
              this.currentBatch.geometry.attributes
            )) {
              let attribute = this.currentBatch.geometry.attributes[key];
              attribute.updateRange.offset = updateRange.start;
              attribute.updateRange.count = updateRange.count;
              attribute.needsUpdate = true;
            }
            this.currentBatch.geometry.computeBoundingBox();
            this.currentBatch.geometry.computeBoundingSphere();

            createNewBatch();
            updateRange = {
              start: 0,
              count: 0
            };
          }

          let x = data.data.mileage[i];
          let y = 0;
          let z = data.data.position[3 * i + 2];

          projectedBox.expandByPoint(new THREE.Vector3(x, y, z));

          let currentIndex = updateRange.start + updateRange.count;

          let attributes = this.currentBatch.geometry.attributes;

          {
            attributes.position.array[3 * currentIndex + 0] = x;
            attributes.position.array[3 * currentIndex + 1] = y;
            attributes.position.array[3 * currentIndex + 2] = z;
          }

          if (data.data.color) {
            attributes.color.array[4 * currentIndex + 0] =
              data.data.color[4 * i + 0];
            attributes.color.array[4 * currentIndex + 1] =
              data.data.color[4 * i + 1];
            attributes.color.array[4 * currentIndex + 2] =
              data.data.color[4 * i + 2];
            attributes.color.array[4 * currentIndex + 3] = 255;
          }

          if (data.data.intensity) {
            attributes.intensity.array[currentIndex] = data.data.intensity[i];
          }

          if (data.data.classification) {
            attributes.classification.array[currentIndex] =
              data.data.classification[i];
          }

          if (data.data.returnNumber) {
            attributes.returnNumber.array[currentIndex] =
              data.data.returnNumber[i];
          }

          if (data.data.numberOfReturns) {
            attributes.numberOfReturns.array[currentIndex] =
              data.data.numberOfReturns[i];
          }

          if (data.data.pointSourceID) {
            attributes.pointSourceID.array[currentIndex] =
              data.data.pointSourceID[i];
          }

          updateRange.count++;
          this.currentBatch.geometry.drawRange.count++;
        }

        //for(let attribute of Object.values(this.currentBatch.geometry.attributes)){
        for (let key of Object.keys(this.currentBatch.geometry.attributes)) {
          let attribute = this.currentBatch.geometry.attributes[key];
          attribute.updateRange.offset = updateRange.start;
          attribute.updateRange.count = updateRange.count;
          attribute.needsUpdate = true;
        }

        data.projectedBox = projectedBox;

        this.projectedBox = this.points.reduce(
          (a, i) => a.union(i.projectedBox),
          new THREE.Box3()
        );
      }
    }
  }

  ProfilePointCloudEntry.materialPool = new Set();

  class ProfileWindow extends EventDispatcher {
    constructor(viewer) {
      super();

      this.viewer = viewer;
      this.elRoot = $("#profile_window");
      this.renderArea = this.elRoot.find("#profileCanvasContainer");
      this.svg = d3.select("svg#profileSVG");
      this.mouseIsDown = false;

      this.projectedBox = new THREE.Box3();
      this.pointclouds = new Map();
      this.numPoints = 0;
      this.lastAddPointsTimestamp = undefined;

      this.mouse = new THREE.Vector2(0, 0);
      this.scale = new THREE.Vector3(1, 1, 1);

      let csvIcon = `${exports.resourcePath}/icons/file_csv_2d.svg`;
      $("#potree_download_csv_icon").attr("src", csvIcon);

      let lasIcon = `${exports.resourcePath}/icons/file_las_3d.svg`;
      $("#potree_download_las_icon").attr("src", lasIcon);

      let closeIcon = `${exports.resourcePath}/icons/close.svg`;
      $("#closeProfileContainer").attr("src", closeIcon);

      this.initTHREE();
      this.initSVG();
      this.initListeners();

      this.elRoot.i18n();
    }

    initListeners() {
      $(window).resize(() => {
        this.render();
      });

      this.renderArea.mousedown(e => {
        this.mouseIsDown = true;
      });

      this.renderArea.mouseup(e => {
        this.mouseIsDown = false;
      });

      let viewerPickSphereSizeHandler = () => {
        let camera = this.viewer.scene.getActiveCamera();
        let domElement = this.viewer.renderer.domElement;
        let distance = this.viewerPickSphere.position.distanceTo(
          camera.position
        );
        let pr = Utils.projectedRadius(
          1,
          camera,
          distance,
          domElement.clientWidth,
          domElement.clientHeight
        );
        let scale = 10 / pr;
        this.viewerPickSphere.scale.set(scale, scale, scale);
      };

      this.renderArea.mousemove(e => {
        if (this.pointclouds.size === 0) {
          return;
        }

        let rect = this.renderArea[0].getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;

        let newMouse = new THREE.Vector2(x, y);

        if (this.mouseIsDown) {
          // DRAG
          this.autoFit = false;
          this.lastDrag = new Date().getTime();

          let cPos = [
            this.scaleX.invert(this.mouse.x),
            this.scaleY.invert(this.mouse.y)
          ];
          let ncPos = [
            this.scaleX.invert(newMouse.x),
            this.scaleY.invert(newMouse.y)
          ];

          this.camera.position.x -= ncPos[0] - cPos[0];
          this.camera.position.z -= ncPos[1] - cPos[1];

          this.render();
        } else if (this.pointclouds.size > 0) {
          // FIND HOVERED POINT
          let radius = Math.abs(this.scaleX.invert(0) - this.scaleX.invert(40));
          let mileage = this.scaleX.invert(newMouse.x);
          let elevation = this.scaleY.invert(newMouse.y);

          let point = this.selectPoint(mileage, elevation, radius);

          if (point) {
            this.elRoot.find("#profileSelectionProperties").fadeIn(200);
            this.pickSphere.visible = true;
            this.pickSphere.scale.set(0.5 * radius, 0.5 * radius, 0.5 * radius);
            this.pickSphere.position.set(point.mileage, 0, point.position[2]);

            this.viewerPickSphere.position.set(...point.position);

            if (
              !this.viewer.scene.scene.children.includes(this.viewerPickSphere)
            ) {
              this.viewer.scene.scene.add(this.viewerPickSphere);
              if (
                !this.viewer.hasEventListener(
                  "update",
                  viewerPickSphereSizeHandler
                )
              ) {
                this.viewer.addEventListener(
                  "update",
                  viewerPickSphereSizeHandler
                );
              }
            }

            let info = this.elRoot.find("#profileSelectionProperties");
            let html = "<table>";
            for (let attribute of Object.keys(point)) {
              let value = point[attribute];
              if (attribute === "position") {
                let values = [...value].map(v => Utils.addCommas(v.toFixed(3)));
                html += `
								<tr>
									<td>x</td>
									<td>${values[0]}</td>
								</tr>
								<tr>
									<td>y</td>
									<td>${values[1]}</td>
								</tr>
								<tr>
									<td>z</td>
									<td>${values[2]}</td>
								</tr>`;
              } else if (attribute === "color") {
                html += `
								<tr>
									<td>${attribute}</td>
									<td>${value.join(", ")}</td>
								</tr>`;
              } else if (attribute === "normal") {
                continue;
              } else if (attribute === "mileage") {
                html += `
								<tr>
									<td>${attribute}</td>
									<td>${value.toFixed(3)}</td>
								</tr>`;
              } else {
                html += `
								<tr>
									<td>${attribute}</td>
									<td>${value}</td>
								</tr>`;
              }
            }
            html += "</table>";
            info.html(html);

            this.selectedPoint = point;
          } else {
            // this.pickSphere.visible = false;
            // this.selectedPoint = null;

            this.viewer.scene.scene.add(this.viewerPickSphere);

            let index = this.viewer.scene.scene.children.indexOf(
              this.viewerPickSphere
            );
            if (index >= 0) {
              this.viewer.scene.scene.children.splice(index, 1);
            }
            this.viewer.removeEventListener(
              "update",
              viewerPickSphereSizeHandler
            );
          }
          this.render();
        }

        this.mouse.copy(newMouse);
      });

      let onWheel = e => {
        this.autoFit = false;
        let delta = 0;
        if (e.wheelDelta !== undefined) {
          // WebKit / Opera / Explorer 9
          delta = e.wheelDelta;
        } else if (e.detail !== undefined) {
          // Firefox
          delta = -e.detail;
        }

        let ndelta = Math.sign(delta);

        let cPos = [
          this.scaleX.invert(this.mouse.x),
          this.scaleY.invert(this.mouse.y)
        ];

        if (ndelta > 0) {
          // + 10%
          this.scale.multiplyScalar(1.1);
        } else {
          // - 10%
          this.scale.multiplyScalar(100 / 110);
        }

        this.updateScales();
        let ncPos = [
          this.scaleX.invert(this.mouse.x),
          this.scaleY.invert(this.mouse.y)
        ];

        this.camera.position.x -= ncPos[0] - cPos[0];
        this.camera.position.z -= ncPos[1] - cPos[1];

        this.render();
        this.updateScales();
      };
      $(this.renderArea)[0].addEventListener("mousewheel", onWheel, false);
      $(this.renderArea)[0].addEventListener("DOMMouseScroll", onWheel, false); // Firefox

      $("#closeProfileContainer").click(() => {
        this.hide();
      });

      $("#potree_download_csv_icon").click(() => {
        let points = new Points();

        for (let [pointcloud, entry] of this.pointclouds) {
          for (let pointSet of entry.points) {
            points.add(pointSet);
          }
        }

        let string = CSVExporter.toString(points);

        let blob = new Blob([string], { type: "text/string" });
        $("#potree_download_profile_ortho_link").attr(
          "href",
          URL.createObjectURL(blob)
        );

        //let uri = 'data:application/octet-stream;base64,' + btoa(string);
        //$('#potree_download_profile_ortho_link').attr('href', uri);
      });

      $("#potree_download_las_icon").click(() => {
        let points = new Points();

        for (let [pointcloud, entry] of this.pointclouds) {
          for (let pointSet of entry.points) {
            points.add(pointSet);
          }
        }

        let buffer = LASExporter.toLAS(points);

        let blob = new Blob([buffer], { type: "application/octet-binary" });
        $("#potree_download_profile_link").attr(
          "href",
          URL.createObjectURL(blob)
        );

        //let u8view = new Uint8Array(buffer);
        //let binString = '';
        //for (let i = 0; i < u8view.length; i++) {
        //	binString += String.fromCharCode(u8view[i]);
        //}
        //
        //let uri = 'data:application/octet-stream;base64,' + btoa(binString);
        //$('#potree_download_profile_link').attr('href', uri);
      });
    }

    selectPoint(mileage, elevation, radius) {
      let closest = {
        distance: Infinity,
        pointcloud: null,
        points: null,
        index: null
      };

      let pointBox = new THREE.Box2(
        new THREE.Vector2(mileage - radius, elevation - radius),
        new THREE.Vector2(mileage + radius, elevation + radius)
      );

      //let debugNode = this.scene.getObjectByName("select_debug_node");
      //if(!debugNode){
      //	debugNode = new THREE.Object3D();
      //	debugNode.name = "select_debug_node";
      //	this.scene.add(debugNode);
      //}
      //debugNode.children = [];
      //let debugPointBox = new THREE.Box3(
      //	new THREE.Vector3(...pointBox.min.toArray(), -1),
      //	new THREE.Vector3(...pointBox.max.toArray(), +1)
      //);
      //debugNode.add(new Box3Helper(debugPointBox, 0xff0000));

      let numTested = 0;
      let numSkipped = 0;
      let numTestedPoints = 0;
      let numSkippedPoints = 0;

      for (let [pointcloud, entry] of this.pointclouds) {
        for (let points of entry.points) {
          let collisionBox = new THREE.Box2(
            new THREE.Vector2(
              points.projectedBox.min.x,
              points.projectedBox.min.z
            ),
            new THREE.Vector2(
              points.projectedBox.max.x,
              points.projectedBox.max.z
            )
          );

          let intersects = collisionBox.intersectsBox(pointBox);

          if (!intersects) {
            numSkipped++;
            numSkippedPoints += points.numPoints;
            continue;
          }

          //let debugCollisionBox = new THREE.Box3(
          //	new THREE.Vector3(...collisionBox.min.toArray(), -1),
          //	new THREE.Vector3(...collisionBox.max.toArray(), +1)
          //);
          //debugNode.add(new Box3Helper(debugCollisionBox));

          numTested++;
          numTestedPoints += points.numPoints;

          for (let i = 0; i < points.numPoints; i++) {
            let m = points.data.mileage[i] - mileage;
            let e = points.data.position[3 * i + 2] - elevation;

            let r = Math.sqrt(m * m + e * e);

            if (r < radius && r < closest.distance) {
              closest = {
                distance: r,
                pointcloud: pointcloud,
                points: points,
                index: i
              };
            }
          }
        }
      }

      //console.log(`nodes: ${numTested}, ${numSkipped} || points: ${numTestedPoints}, ${numSkippedPoints}`);

      if (closest.distance < Infinity) {
        let points = closest.points;

        let point = {};

        let attributes = Object.keys(points.data);
        for (let attribute of attributes) {
          let attributeData = points.data[attribute];
          let itemSize = attributeData.length / points.numPoints;
          let value = attributeData.subarray(
            itemSize * closest.index,
            itemSize * closest.index + itemSize
          );

          if (value.length === 1) {
            point[attribute] = value[0];
          } else {
            point[attribute] = value;
          }
        }

        return point;
      } else {
        return null;
      }
    }

    initTHREE() {
      this.renderer = new THREE.WebGLRenderer({
        alpha: true,
        premultipliedAlpha: false
      });
      this.renderer.setClearColor(0x000000, 0);
      this.renderer.setSize(10, 10);
      this.renderer.autoClear = true;
      this.renderArea.append($(this.renderer.domElement));
      this.renderer.domElement.tabIndex = "2222";
      this.renderer.context.getExtension("EXT_frag_depth");
      $(this.renderer.domElement).css("width", "100%");
      $(this.renderer.domElement).css("height", "100%");

      this.camera = new THREE.OrthographicCamera(
        -1000,
        1000,
        1000,
        -1000,
        -1000,
        1000
      );
      this.camera.up.set(0, 0, 1);
      this.camera.rotation.order = "ZXY";
      this.camera.rotation.x = Math.PI / 2.0;

      this.scene = new THREE.Scene();

      let sg = new THREE.SphereGeometry(1, 16, 16);
      let sm = new THREE.MeshNormalMaterial();
      this.pickSphere = new THREE.Mesh(sg, sm);
      //this.pickSphere.visible = false;
      this.scene.add(this.pickSphere);

      this.viewerPickSphere = new THREE.Mesh(sg, sm);

      this.pointCloudRoot = new THREE.Object3D();
      this.scene.add(this.pointCloudRoot);
    }

    initSVG() {
      let width = this.renderArea[0].clientWidth;
      let height = this.renderArea[0].clientHeight;
      let marginLeft = this.renderArea[0].offsetLeft;

      this.svg.selectAll("*").remove();

      this.scaleX = d3.scale
        .linear()
        .domain([
          this.camera.left + this.camera.position.x,
          this.camera.right + this.camera.position.x
        ])
        .range([0, width]);
      this.scaleY = d3.scale
        .linear()
        .domain([
          this.camera.bottom + this.camera.position.z,
          this.camera.top + this.camera.position.z
        ])
        .range([height, 0]);

      this.xAxis = d3.svg
        .axis()
        .scale(this.scaleX)
        .orient("bottom")
        .innerTickSize(-height)
        .outerTickSize(1)
        .tickPadding(10)
        .ticks(width / 50);

      this.yAxis = d3.svg
        .axis()
        .scale(this.scaleY)
        .orient("left")
        .innerTickSize(-width)
        .outerTickSize(1)
        .tickPadding(10)
        .ticks(height / 20);

      this.elXAxis = this.svg
        .append("g")
        .attr("class", "x axis")
        .attr("transform", `translate(${marginLeft}, ${height})`)
        .call(this.xAxis);

      this.elYAxis = this.svg
        .append("g")
        .attr("class", "y axis")
        .attr("transform", `translate(${marginLeft}, 0)`)
        .call(this.yAxis);
    }

    setProfile(profile) {
      this.render();
    }

    addPoints(pointcloud, points) {
      //this.lastAddPointsTimestamp = new Date().getTime();

      let entry = this.pointclouds.get(pointcloud);
      if (!entry) {
        entry = new ProfilePointCloudEntry();
        this.pointclouds.set(pointcloud, entry);

        let materialChanged = () => this.render();
        pointcloud.material.addEventListener(
          "material_property_changed",
          materialChanged
        );
        this.addEventListener("on_reset_once", () => {
          pointcloud.material.removeEventListener(
            "material_property_changed",
            materialChanged
          );
        });
      }

      entry.addPoints(points);
      this.pointCloudRoot.add(entry.sceneNode);
      this.projectedBox.union(entry.projectedBox);
      //console.log(this.projectedBox.min.toArray().map(v => v.toFixed(2)).join(", "));
      //console.log(this.projectedBox.getSize().toArray().map(v => v.toFixed(2)).join(", "));

      if (this.autoFit) {
        let width = this.renderArea[0].clientWidth;
        let height = this.renderArea[0].clientHeight;

        let size = this.projectedBox.getSize(new THREE.Vector3());

        let sx = width / size.x;
        let sy = height / size.z;
        let scale = Math.min(sx, sy);

        let center = this.projectedBox.getCenter(new THREE.Vector3());
        this.scale.set(scale, scale, 1);
        this.camera.position.copy(center);

        //console.log("camera: ", this.camera.position.toArray().join(", "));
      }

      //console.log(entry);

      this.render();

      let numPoints = 0;
      for (let [key, value] of this.pointclouds.entries()) {
        numPoints += value.points.reduce((a, i) => a + i.numPoints, 0);
      }
      $(`#profile_num_points`).html(Utils.addCommas(numPoints));
    }

    reset() {
      this.lastReset = new Date().getTime();

      this.dispatchEvent({ type: "on_reset_once" });
      this.removeEventListeners("on_reset_once");

      this.autoFit = true;
      this.projectedBox = new THREE.Box3();

      for (let [key, entry] of this.pointclouds) {
        entry.dispose();
      }

      this.pointclouds.clear();
      this.mouseIsDown = false;
      this.mouse.set(0, 0);
      this.scale.set(1, 1, 1);
      this.pickSphere.visible = false;

      this.pointCloudRoot.children = [];

      this.elRoot.find("#profileSelectionProperties").hide();

      this.render();
    }

    show() {
      this.elRoot.fadeIn();
      this.enabled = true;
    }

    hide() {
      this.elRoot.fadeOut();
      this.enabled = false;
    }

    updateScales() {
      let width = this.renderArea[0].clientWidth;
      let height = this.renderArea[0].clientHeight;

      let left = -width / 2 / this.scale.x;
      let right = +width / 2 / this.scale.x;
      let top = +height / 2 / this.scale.y;
      let bottom = -height / 2 / this.scale.y;

      this.camera.left = left;
      this.camera.right = right;
      this.camera.top = top;
      this.camera.bottom = bottom;
      this.camera.updateProjectionMatrix();

      this.scaleX
        .domain([
          this.camera.left + this.camera.position.x,
          this.camera.right + this.camera.position.x
        ])
        .range([0, width]);
      this.scaleY
        .domain([
          this.camera.bottom + this.camera.position.z,
          this.camera.top + this.camera.position.z
        ])
        .range([height, 0]);

      let marginLeft = this.renderArea[0].offsetLeft;

      this.xAxis
        .scale(this.scaleX)
        .orient("bottom")
        .innerTickSize(-height)
        .outerTickSize(1)
        .tickPadding(10)
        .ticks(width / 50);
      this.yAxis
        .scale(this.scaleY)
        .orient("left")
        .innerTickSize(-width)
        .outerTickSize(1)
        .tickPadding(10)
        .ticks(height / 20);

      this.elXAxis
        .attr("transform", `translate(${marginLeft}, ${height})`)
        .call(this.xAxis);
      this.elYAxis
        .attr("transform", `translate(${marginLeft}, 0)`)
        .call(this.yAxis);
    }

    requestScaleUpdate() {
      let threshold = 100;
      let allowUpdate =
        this.lastReset === undefined ||
        this.lastScaleUpdate === undefined ||
        (new Date().getTime() - this.lastReset > threshold &&
          new Date().getTime() - this.lastScaleUpdate > threshold);

      if (allowUpdate) {
        this.updateScales();

        this.lastScaleUpdate = new Date().getTime();

        this.scaleUpdatePending = false;
      } else if (!this.scaleUpdatePending) {
        setTimeout(this.requestScaleUpdate.bind(this), 100);
        this.scaleUpdatePending = true;
      }
    }

    render() {
      let width = this.renderArea[0].clientWidth;
      let height = this.renderArea[0].clientHeight;

      //this.updateScales();

      {
        // THREEJS
        let radius = Math.abs(this.scaleX.invert(0) - this.scaleX.invert(5));
        this.pickSphere.scale.set(radius, radius, radius);
        //this.pickSphere.position.z = this.camera.far - radius;
        //this.pickSphere.position.y = 0;

        for (let [pointcloud, entry] of this.pointclouds) {
          let material = entry.material;

          material.pointColorType = pointcloud.material.pointColorType;
          material.uniforms.uColor = pointcloud.material.uniforms.uColor;
          material.uniforms.intensityRange.value =
            pointcloud.material.uniforms.intensityRange.value;
          material.elevationRange = pointcloud.material.elevationRange;

          material.rgbGamma = pointcloud.material.rgbGamma;
          material.rgbContrast = pointcloud.material.rgbContrast;
          material.rgbBrightness = pointcloud.material.rgbBrightness;

          material.intensityRange = pointcloud.material.intensityRange;
          material.intensityGamma = pointcloud.material.intensityGamma;
          material.intensityContrast = pointcloud.material.intensityContrast;
          material.intensityBrightness =
            pointcloud.material.intensityBrightness;

          material.uniforms.wRGB.value =
            pointcloud.material.uniforms.wRGB.value;
          material.uniforms.wIntensity.value =
            pointcloud.material.uniforms.wIntensity.value;
          material.uniforms.wElevation.value =
            pointcloud.material.uniforms.wElevation.value;
          material.uniforms.wClassification.value =
            pointcloud.material.uniforms.wClassification.value;
          material.uniforms.wReturnNumber.value =
            pointcloud.material.uniforms.wReturnNumber.value;
          material.uniforms.wSourceID.value =
            pointcloud.material.uniforms.wSourceID.value;
        }

        this.pickSphere.visible = true;

        this.renderer.setSize(width, height);

        this.renderer.render(this.scene, this.camera);
      }

      this.requestScaleUpdate();
    }
  }

  class ProfileWindowController {
    constructor(viewer) {
      this.viewer = viewer;
      this.profileWindow = viewer.profileWindow;
      this.profile = null;
      this.numPoints = 0;
      this.threshold = 60 * 1000;
      this.scheduledRecomputeTime = null;

      this.enabled = true;

      this.requests = [];

      this._recompute = () => {
        this.recompute();
      };

      this.viewer.addEventListener("scene_changed", e => {
        e.oldScene.removeEventListener("pointcloud_added", this._recompute);
        e.scene.addEventListener("pointcloud_added", this._recompute);
      });
      this.viewer.scene.addEventListener("pointcloud_added", this._recompute);
    }

    setProfile(profile) {
      if (this.profile !== null && this.profile !== profile) {
        this.profile.removeEventListener("marker_moved", this._recompute);
        this.profile.removeEventListener("marker_added", this._recompute);
        this.profile.removeEventListener("marker_removed", this._recompute);
        this.profile.removeEventListener("width_changed", this._recompute);
      }

      this.profile = profile;

      {
        this.profile.addEventListener("marker_moved", this._recompute);
        this.profile.addEventListener("marker_added", this._recompute);
        this.profile.addEventListener("marker_removed", this._recompute);
        this.profile.addEventListener("width_changed", this._recompute);
      }

      this.recompute();
    }

    reset() {
      this.profileWindow.reset();

      this.numPoints = 0;

      if (this.profile) {
        for (let request of this.requests) {
          request.cancel();
        }
      }
    }

    progressHandler(pointcloud, progress) {
      for (let segment of progress.segments) {
        this.profileWindow.addPoints(pointcloud, segment.points);
        this.numPoints += segment.points.numPoints;
      }
    }

    cancel() {
      for (let request of this.requests) {
        request.cancel();
        // request.finishLevelThenCancel();
      }

      this.requests = [];
    }

    finishLevelThenCancel() {
      for (let request of this.requests) {
        request.finishLevelThenCancel();
      }

      this.requests = [];
    }

    recompute() {
      if (!this.profile) {
        return;
      }

      if (
        this.scheduledRecomputeTime !== null &&
        this.scheduledRecomputeTime > new Date().getTime()
      ) {
        return;
      } else {
        this.scheduledRecomputeTime = new Date().getTime() + 100;
      }
      this.scheduledRecomputeTime = null;

      this.reset();

      for (let pointcloud of this.viewer.scene.pointclouds.filter(
        p => p.visible
      )) {
        let request = pointcloud.getPointsInProfile(this.profile, null, {
          onProgress: event => {
            if (!this.enabled) {
              return;
            }

            this.progressHandler(pointcloud, event.points);

            if (this.numPoints > this.threshold) {
              this.finishLevelThenCancel();
            }
          },
          onFinish: event => {
            if (!this.enabled) {
            }
          },
          onCancel: () => {
            if (!this.enabled) {
            }
          }
        });

        this.requests.push(request);
      }
    }
  }

  /**
   * @author mschuetz / http://mschuetz.at
   *
   * adapted from THREE.OrbitControls by
   *
   * @author qiao / https://github.com/qiao
   * @author mrdoob / http://mrdoob.com
   * @author alteredq / http://alteredqualia.com/
   * @author WestLangley / http://github.com/WestLangley
   * @author erich666 / http://erichaines.com
   *
   *
   *
   */

  /**
   * @author chrisl / Geodan
   *
   * adapted from Potree.FirstPersonControls by
   *
   * @author mschuetz / http://mschuetz.at
   *
   * and THREE.DeviceOrientationControls  by
   *
   * @author richt / http://richt.me
   * @author WestLangley / http://github.com/WestLangley
   *
   *
   *
   */
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
    suffix: ""
  };

  let lru = new LRU();

  console.log("Potree " + version.major + "." + version.minor + version.suffix);

  let pointBudget = 1 * 1000 * 1000;
  let framenumber = 0;
  let numNodesLoading = 0;
  let maxNodesLoading = 4;

  const debug = {};

  exports.scriptPath = "";
  if (document.currentScript.src) {
    exports.scriptPath = new URL(document.currentScript.src + "/..").href;
    if (exports.scriptPath.slice(-1) === "/") {
      exports.scriptPath = exports.scriptPath.slice(0, -1);
    }
  } else {
    console.error(
      "Potree was unable to find its script path using document.currentScript. Is Potree included with a script tag? Does your browser support this function?"
    );
  }

  let resourcePath = exports.scriptPath + "/static/resources";

  function loadPointCloud(path, name, callback) {
    let loaded = function(pointcloud) {
      pointcloud.name = name;
      callback({ type: "pointcloud_loaded", pointcloud: pointcloud });
    };

    // load pointcloud
    if (!path) {
      // TODO: callback? comment? Hello? Bueller? Anyone?
    } else if (path.indexOf("ept.json") > 0) {
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
    } else if (path.indexOf("greyhound://") === 0) {
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
    } else if (path.indexOf("cloud.js") > 0) {
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
    } else if (path.indexOf(".vpc") > 0) {
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
        let rootID = elGroup.prop("id");
        let groupID = `${rootID}`;
        let groupTitle = args.title !== undefined ? args.title : "";

        let elButtons = [];
        elGroup.find("option").each((index, value) => {
          let buttonID = $(value).prop("id");
          let label = $(value).html();
          let optionValue = $(value).prop("value");

          let elButton = $(`
					<span style="flex-grow: 1; display: inherit">
					<label for="${buttonID}" class="ui-button" style="width: 100%; padding: .4em .1em">${label}</label>
					<input type="radio" name="${groupID}" id="${buttonID}" value="${optionValue}" style="display: none"/>
					</span>
				`);
          let elLabel = elButton.find("label");
          let elInput = elButton.find("input");

          elInput.change(() => {
            elGroup.find("label").removeClass("ui-state-active");
            elGroup.find("label").addClass("ui-state-default");
            if (elInput.is(":checked")) {
              elLabel.addClass("ui-state-active");
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

        let elButtonContainer = elFieldset.find("span");
        for (let elButton of elButtons) {
          elButtonContainer.append(elButton);
        }

        elButtonContainer.find("label").each((index, value) => {
          $(value).css("margin", "0px");
          $(value).css("border-radius", "0px");
          $(value).css("border", "1px solid black");
          $(value).css("border-left", "none");
        });
        elButtonContainer.find("label:first").each((index, value) => {
          $(value).css("border-radius", "4px 0px 0px 4px");
        });
        elButtonContainer.find("label:last").each((index, value) => {
          $(value).css("border-radius", "0px 4px 4px 0px");
          $(value).css("border-left", "none");
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
  exports.resourcePath = resourcePath;
  exports.loadPointCloud = loadPointCloud;
  exports.Action = Action;
  exports.PathAnimation = PathAnimation;
  exports.AnimationPath = AnimationPath;
  exports.Annotation = Annotation;
  exports.CameraMode = CameraMode;
  exports.ClipTask = ClipTask;
  exports.ClipMethod = ClipMethod;
  exports.MOUSE = MOUSE;
  exports.PointSizeType = PointSizeType;
  exports.PointShape = PointShape;
  exports.PointColorType = PointColorType;
  exports.TreeType = TreeType;
  exports.Enum = Enum;
  exports.EnumItem = EnumItem;
  exports.EventDispatcher = EventDispatcher;
  exports.Features = Features;
  exports.KeyCodes = KeyCodes;
  exports.LRU = LRU;
  exports.LRUItem = LRUItem;
  exports.PointCloudEptGeometry = PointCloudEptGeometry;
  exports.EptKey = EptKey;
  exports.PointCloudEptGeometryNode = PointCloudEptGeometryNode;
  exports.PointCloudGreyhoundGeometry = PointCloudGreyhoundGeometry;
  exports.PointCloudGreyhoundGeometryNode = PointCloudGreyhoundGeometryNode$1;
  exports.PointCloudOctreeNode = PointCloudOctreeNode;
  exports.PointCloudOctree = PointCloudOctree;
  exports.PointCloudOctreeGeometry = PointCloudOctreeGeometry;
  exports.PointCloudOctreeGeometryNode = PointCloudOctreeGeometryNode;
  exports.PointCloudTreeNode = PointCloudTreeNode;
  exports.PointCloudTree = PointCloudTree;
  exports.Points = Points;
  exports.updatePointClouds = updatePointClouds;
  exports.updateVisibilityStructures = updateVisibilityStructures;
  exports.updateVisibility = updateVisibility;
  exports.Renderer = Renderer;
  exports.ProfileData = ProfileData;
  exports.ProfileRequest = ProfileRequest;
  exports.TextSprite = TextSprite;
  exports.Utils = Utils;
  exports.Version = Version;
  exports.WorkerPool = WorkerPool;
  exports.XHRFactory = XHRFactory;
  exports.ClassificationScheme = ClassificationScheme;
  exports.EyeDomeLightingMaterial = EyeDomeLightingMaterial;
  exports.Gradients = Gradients;
  exports.NormalizationEDLMaterial = NormalizationEDLMaterial;
  exports.NormalizationMaterial = NormalizationMaterial;
  exports.PointCloudMaterial = PointCloudMaterial;
  exports.POCLoader = POCLoader;
  exports.EptLoader = EptLoader;
  exports.EptBinaryLoader = EptBinaryLoader;
  exports.EptLaszipLoader = EptLaszipLoader;
  exports.EptLazBatcher = EptLazBatcher;
  exports.GreyhoundBinaryLoader = GreyhoundBinaryLoader;
  exports.GreyhoundLoader = GreyhoundLoader;
  exports.PointAttributeNames = PointAttributeNames;
  exports.PointAttributeTypes = PointAttributeTypes;
  exports.PointAttribute = PointAttribute;
  exports.PointAttributes = PointAttributes;
  exports.Box3Helper = Box3Helper;
  exports.ClippingTool = ClippingTool;
  exports.ClipVolume = ClipVolume;
  exports.Measure = Measure;
  exports.MeasuringTool = MeasuringTool;
  exports.Message = Message;
  exports.PointCloudSM = PointCloudSM;
  exports.PolygonClipVolume = PolygonClipVolume;
  exports.Profile = Profile;
  exports.ProfileTool = ProfileTool;
  exports.ScreenBoxSelectTool = ScreenBoxSelectTool;
  exports.SpotLightHelper = SpotLightHelper;
  exports.toInterleavedBufferAttribute = toInterleavedBufferAttribute;
  exports.TransformationTool = TransformationTool;
  exports.Volume = Volume;
  exports.BoxVolume = BoxVolume;
  exports.SphereVolume = SphereVolume;
  exports.VolumeTool = VolumeTool;
  exports.Viewer = Viewer;
  exports.Scene = Scene;

  Object.defineProperty(exports, "__esModule", { value: true });
});
//# sourceMappingURL=potree.js.map

export default Potree;
