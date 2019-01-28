interface Measurement {
  lengthUnit: any;
  points?: any[];
  getTotalDistance?: Function;
  getArea?: Function;
  getAngle?: Function;
  rotation?: any;
  visible?: boolean;
  clip?: boolean;
  matrixWorld?: any;
  scale?: any;
  position?: any;
  getVolume?: Function;
  getSegments?: Function;
  width?: number;
}

export default Measurement;
