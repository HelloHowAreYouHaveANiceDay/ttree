import PointCloudEptGeometry from "./PointCloudEptGeometry";
import PointCloudEptGeometryNode from "./PointCloudEptGeometryNode";

/**
 * @author Connor Manning
 */

class EptLoader {
  static async load(file, callback) {
    let response = await fetch(file);
    let json = await response.json();

    let url = file.substr(0, file.lastIndexOf("ept.json"));
    let geometry = new PointCloudEptGeometry(url, json);
    let root = new PointCloudEptGeometryNode(
      geometry,
      null,
      0,
      null,
      null,
      null
    );

    geometry.root = root;
    geometry.root.load();

    callback(geometry);
  }
}
