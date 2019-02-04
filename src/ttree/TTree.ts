import tCamera from "./tCamera";

import EptLoader from "../potree/Ept/EptLoader";
import PointCloudOctree from "../potree/PointCloudOctree";
import GreyhoundLoader from "../potree/Greyhound/GreyhoundLoader";
import POCLoader from "../potree/Loaders/POCLoader";

interface pointcloud {
  name: string;
}

const isEPT = (url: string) => url.includes("ept.json");
const isGreyhound = (url: string) => url.includes("greyhound://");
const isPOC = (url: string) => url.includes("cloud.js");
const isArena4D = (url: string) => url.includes(".vps");

class TTree {
  constructor() {}

  updatePointClouds(pointclouds: any[], camera: tCamera, renderer) {
    for (let pointcloud of pointclouds) {
      // timestamp
      let start = performance.now();
    }
  }

  async loadPointCloud(path: string, name: string) {
    // const loaded = (pointcloud: pointcloud) => {
    //   pointcloud.name = name;
    //   callback({ type: "pointcloud_loaded", pointcloud });
    // };

    try {
      if (!path) {
      } else if (isEPT(path)) {
        const geometry = await EptLoader.load(path);
        return new PointCloudOctree(geometry);
      } else if (isGreyhound(path)) {
        const geometry = await GreyhoundLoader.load(path);
        return new PointCloudOctree(geometry);
      } else if (isPOC(path)) {
        const geometry = POCLoader.load(path);
        return new PointCloudOctree(geometry);
      } else if (isArena4D(path)) {
      } else {
      }
    } catch {}
  }
}

export default TTree;
