import pointFormatReaders from './PointFormatReaders';

import readAs from './ReadAs';

import LASLoader from './LASLoader';
import LAZLoader from './LAZLoader';


interface LASFile {
  arraybuffer: any;
  version?: number;
  versionAsString?: string;
  formatId?: number;
  isCompressed?: boolean;
  loader?: LASLoader | LAZLoader;
  isOpen?: boolean;
}

class LASFile {
  constructor(arraybuffer) {
    this.arraybuffer = arraybuffer;

    this.determineVersion();

    this.determineFormat();
    if (pointFormatReaders[this.formatId] === undefined)
      throw new Error("The point format ID is not supported");

    this.loader = this.isCompressed
      ? new LAZLoader(this.arraybuffer)
      : new LASLoader(this.arraybuffer);
  }

  determineVersion() {
    var ver = new Int8Array(this.arraybuffer, 24, 2);
    this.version = ver[0] * 10 + ver[1];
    if (this.version > 12)
      throw new Error("Only file versions <= 1.2 are supported at this time");
    this.versionAsString = ver[0] + "." + ver[1];
  }

  determineFormat() {
    var formatId = readAs(this.arraybuffer, Uint8Array, 32 * 3 + 8, 0);
    var bit_7 = (formatId & 0x80) >> 7;
    var bit_6 = (formatId & 0x40) >> 6;

    if (bit_7 === 1 && bit_6 === 1)
      throw new Error("Old style compression not supported");

    this.formatId = formatId & 0x3f;
    this.isCompressed = bit_7 === 1 || bit_6 === 1;
  }

  open() {
    return this.loader.open();
  }

  getHeader() {
    return this.loader.getHeader();
  }

  readData(count, start, skip) {
    return this.loader.readData(count, start, skip);
  }

  close() {
    return this.loader.close();
  }
}

export default LASFile;
