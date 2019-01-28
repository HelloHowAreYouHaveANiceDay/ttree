import PointAttribute from './PointAttribute';
import PointAttributeNames from './PointAttributeNames';

interface PointAttributes {
  attributes?: Array<PointAttribute>;
  byteSize?: any;
  size?: number;
  name?: string;
}

class PointAttributes {
  constructor(pointAttributes) {
    this.attributes = [];
    this.byteSize = 0;
    this.size = 0;

    if (pointAttributes != null) {
      for (let i = 0; i < pointAttributes.length; i++) {
        let pointAttributeName = pointAttributes[i];
        let pointAttribute = PointAttribute[pointAttributeName];
        this.attributes.push(pointAttribute);
        this.byteSize += pointAttribute.byteSize;
        this.size++;
      }
    }
  }

  add(pointAttribute) {
    this.attributes.push(pointAttribute);
    this.byteSize += pointAttribute.byteSize;
    this.size++;
  }

  hasColors() {
    for (let name in this.attributes) {
      let pointAttribute = this.attributes[name];
      // TODO: this apparently is always false
      // @ts-ignore
      if (pointAttribute.name === PointAttributeNames.COLOR_PACKED) {
        return true;
      }
    }

    return false;
  }

  hasNormals() {
    for (let name in this.attributes) {
      let pointAttribute = this.attributes[name];
      if (
        pointAttribute === PointAttribute.NORMAL_SPHEREMAPPED ||
        pointAttribute === PointAttribute.NORMAL_FLOATS ||
        pointAttribute === PointAttribute.NORMAL ||
        pointAttribute === PointAttribute.NORMAL_OCT16
      ) {
        return true;
      }
    }

    return false;
  }
}

export default PointAttributes;