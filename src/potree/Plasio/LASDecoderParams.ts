interface LASDecoderParams {
  buffer: ArrayBuffer;
  pointFormatId: number;
  pointSize: number;
  pointCount: number;
  scale: number;
  offset: number;
  mins: any[];
  maxs: any[];
  count?: number;
  hasMoreData?: boolean;
}

export default LASDecoderParams;
