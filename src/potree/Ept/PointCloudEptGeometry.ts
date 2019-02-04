import U from "../U";
import Potree from "../potree";
import PointCloudEptGeometryNode from "./PointCloudEptGeometryNode";
import EptBinaryLoader from "./EptBinaryLoader";
import EptLaszipLoader from "./EptLaszipLoader";

interface PointCloudEptGeometry {
  eptScale: any;
  eptOffset: any;

  url: string;
  info: string;
  type: string;
  schema: any;
  span: any;

  boundingBox: any;
  tightBoundingBox: any;
  offset: any;
  boundingSphere: any;
  tightBoundingSphere: any;
  version: any;
  projection: string;
  fallbackProjection: string;

  pointAttributes: string;
  spacing: number;
  dataType: string;
  //TODO: replace with loader type
  loader: any;
  root?: PointCloudEptGeometryNode;
}

class PointCloudEptGeometry {
  constructor(url, info) {
    // let version = info.version;
    let schema = info.schema;
    let bounds = info.bounds;
    let boundsConforming = info.boundsConforming;

    let xyz = [
      U.findDim(schema, "X"),
      U.findDim(schema, "Y"),
      U.findDim(schema, "Z")
    ];
    let scale = xyz.map(d => d.scale || 1);
    let offset = xyz.map(d => d.offset || 0);
    this.eptScale = U.toVector3(scale, 0);
    this.eptOffset = U.toVector3(offset, 0);

    this.url = url;
    this.info = info;
    this.type = "ept";

    this.schema = schema;
    this.span = info.span || info.ticks;
    this.boundingBox = U.toBox3(bounds);
    this.tightBoundingBox = U.toBox3(boundsConforming);
    this.offset = U.toVector3([0, 0, 0], 0);
    this.boundingSphere = U.sphereFrom(this.boundingBox);
    this.tightBoundingSphere = U.sphereFrom(this.tightBoundingBox);
    this.version = new Potree.Version("1.6");

    this.projection = null;
    this.fallbackProjection = null;

    if (info.srs && info.srs.horizontal) {
      this.projection = info.srs.authority + ":" + info.srs.horizontal;
    }

    if (info.srs.wkt) {
      if (!this.projection) this.projection = info.srs.wkt;
      else this.fallbackProjection = info.srs.wkt;
    }

    this.pointAttributes = "LAZ";
    this.spacing =
      (this.boundingBox.max.x - this.boundingBox.min.x) / this.span;

    // let hierarchyType = info.hierarchyType || "json";

    let dataType = info.dataType || "laszip";
    this.loader =
      dataType == "binary" ? new EptBinaryLoader() : new EptLaszipLoader();
  }
}

export default PointCloudEptGeometry;
