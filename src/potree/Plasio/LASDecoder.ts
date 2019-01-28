import pointFormatReaders from "./PointFormatReaders";

// Decodes LAS records into points
//
interface LASDecoder {
  arrayb: ArrayBuffer;
  decoder: Function;
  pointsCount: number;
  pointSize: number;
  scale: number;
  offset: number;
  mins: any[];
  maxs: any[];
  extraBytes?: number;
  pointsFormatId?: any[];
}

class LASDecoder {
  constructor(
    buffer,
    pointFormatID,
    pointSize,
    pointsCount,
    scale,
    offset,
    mins,
    maxs
  ) {
    this.arrayb = buffer;
    this.decoder = pointFormatReaders[pointFormatID];
    this.pointsCount = pointsCount;
    this.pointSize = pointSize;
    this.scale = scale;
    this.offset = offset;
    this.mins = mins;
    this.maxs = maxs;
  }

  getPoint(index) {
    if (index < 0 || index >= this.pointsCount)
      throw new Error("Point index out of range");

    var dv = new DataView(this.arrayb, index * this.pointSize, this.pointSize);
    return this.decoder(dv);
  }
}

export default LASDecoder;
