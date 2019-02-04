import PointCloudEptGeometry from "./PointCloudEptGeometry";
import PointCloudEptGeometryNode from "./PointCloudEptGeometryNode";

/**
 * @author Connor Manning
 */

class EptLoader {
  static async load(file) {
    const response = await fetch(file);
    const json = await response.json();

    const url = file.substr(0, file.lastIndexOf("ept.json"));
    const geometry = new PointCloudEptGeometry(url, json);
    const root = new PointCloudEptGeometryNode(
      geometry,
      null,
      0,
      null,
      null,
      null
    );

    geometry.root = root;
    geometry.root.load();

    return geometry;
  }
}

export default EptLoader