export interface EnumItem {
  name?: string;
  value?: any;
}

export class EnumItem {
  constructor(object) {
    for (let key of Object.keys(object)) {
      this[key] = object[key];
    }
  }

  inspect() {
    return `Enum(${this.name}: ${this.value})`;
  }
}

export interface Enum {
  object: object;
  BYTE?: EnumItem;
  ASCII?: EnumItem;
  SHORT?: EnumItem;
  LONG?: EnumItem;
  RATIONAL?: EnumItem;
  SBYTE?: EnumItem;
  UNDEFINED?: EnumItem;
  SSHORT?: EnumItem;
  SLONG?: EnumItem;
  SRATIONAL?: EnumItem;
  FLOAT?: EnumItem;
  DOUBLE?: EnumItem;
  IMAGE_WIDTH?: EnumItem;
  IMAGE_HEIGHT?: EnumItem;
  BITS_PER_SAMPLE?: EnumItem;
  COMPRESSION?: EnumItem;
  PHOTOMETRIC_INTERPRETATION?: EnumItem;
  ORIENTATION?: EnumItem;
  SAMPLES_PER_PIXEL?: EnumItem;
  ROWS_PER_STRIP?: EnumItem;
  STRIP_BYTE_COUNTS?: EnumItem;
  PLANAR_CONFIGURATION?: EnumItem;
  RESOLUTION_UNIT?: EnumItem;
  SOFTWARE?: EnumItem;
  STRIP_OFFSETS?: EnumItem;
  X_RESOLUTION?: EnumItem;
  Y_RESOLUTION?: EnumItem;
}

export class Enum {
  constructor(object: object) {
    this.object = object;

    for (let key of Object.keys(object)) {
      let value = object[key];

      if (typeof value === "object") {
        value.name = key;
      } else {
        value = { name: key, value: value };
      }

      this[key] = new EnumItem(value);
    }
  }

  fromValue(value) {
    for (let key of Object.keys(this.object)) {
      if (this[key].value === value) {
        return this[key];
      }
    }

    throw new Error(`No enum for value: ${value}`);
  }
}
