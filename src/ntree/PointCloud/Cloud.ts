export default interface Cloud {
  version?: string;
  octreeDir?: string;
  boundingBox?: {
    lx: number;
    ly: number;
    lz: number;
    ux: number;
    uy: number;
    uz: number;
  };
  tightBoundingBox?: {
    lx: number;
    ly: number;
    lz: number;
    ux: number;
    uy: number;
    uz: number;
  };
  pointAttributes?: string[] | string;
  spacing?: number;
  scale?: number;
  hierarchyStepSize?: number;
  projection?: string;
}
