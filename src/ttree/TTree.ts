import tCamera from "./tCamera";

import EptLoader from "../potree/Ept/EptLoader";
import PointCloudOctree from "../potree/PointCloudOctree";
import GreyhoundLoader from "../potree/Greyhound/GreyhoundLoader";
// import PointCloudArena4D from '../potree/Point'

import POCLoader from "../potree/Loaders/POCLoader";
import { LRU } from "../potree/LRU";

const isEPT = (url: string) => url.includes("ept.json");
const isGreyhound = (url: string) => url.includes("greyhound://");
const isPOC = (url: string) => url.includes("cloud.js");
const isArena4D = (url: string) => url.includes(".vps");

interface TTree {
  lru: LRU;
}

class TTree {
  constructor() {
    this.lru = new LRU();
  }

  updatePointClouds(pointclouds: PointCloudOctree[], camera: tCamera, renderer) {
    for (let pointcloud of pointclouds) {
      // timestamp
      let start = performance.now();

      for (let profileRequest of pointcloud.profileRequests) {
        profileRequest.update();

        let duration = performance.now() - start;
        if(duration > 5) {
          break;
        }
      }


    }

    const result = this.updateVisiblity(pointclouds, camera, renderer);

    for (let pointcloud of pointclouds) {
      pointcloud.updateMaterial(
        pointcloud.material,
        pointcloud.visibleNodes,
        camera,
        renderer
      );
      pointcloud.updateVisibleBounds();
    }

    this.lru.freeMemory();

    return result;
  }

  async loadPointCloud(path: string, name: string) {
    // const loaded = (pointcloud: pointcloud) => {
    //   pointcloud.name = name;
    //   callback({ type: "pointcloud_loaded", pointcloud });
    // };

    try {
      if (!path) {
        throw new Error('path not given');
      } else if (isEPT(path)) {
        const geometry = await EptLoader.load(path);
        return new PointCloudOctree(geometry);
      } else if (isGreyhound(path)) {
        const geometry = await GreyhoundLoader.load(path);
        return new PointCloudOctree(geometry);
      } else if (isPOC(path)) {
        const geometry = await POCLoader.load(path);
        return new PointCloudOctree(geometry);
      } else if (isArena4D(path)) {
        // const geometry = await PointCloudArena4DGeometry.load(path)
        // return new PointCloudArena4D(geometry);
        console.log("arena 4D not implemented");
      } else {
      }
    } catch (err) {
      throw err;
    }
  }
}

export default TTree;
