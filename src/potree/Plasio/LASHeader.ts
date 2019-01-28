//TODO: Resolve complex types
interface LASHeader {
  pointsOffset?: any[];
  pointsFormatId?: any[];
  pointsStructSize?: any[];
  pointsCount?: any[];
  scale?: any[];
  offset?: any[];
  maxs?: any[];
  mins?: any[];
  extraBytes?: number;
  totalRead?: number;
  versionAsString?: string;
  isCompressed?: boolean;
}

export default LASHeader;
