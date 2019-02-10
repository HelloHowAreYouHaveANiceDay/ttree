import R from 'ramda';

const PointAttribute = {
  POSITION_CARTESIAN: {
    // POSITION_CARTESIAN
    name: 0,
    // DATA_TYPE_FLOAT
    type: { ordinal: 1, size: 4 },
    numElements: 3,
    // byteSize = numElements * type.size
    byteSize: 12
  },
  RGBA_PACKED: {
    // COLOR_PACKED
    name: 1,
    // INT8
    type: { ordinal: 2, size: 1 },
    numElements: 3,
    byteSize: 3
  },
  COLOR_PACKED: {
    // COLOR_PACKED
    name: 1,
    // INT8
    type: { ordinal: 2, size: 1 },
    numElements: 4,
    byteSize: 4
  },
  NORMAL_FLOATS: {
    // NORMAL_FLOATS
    name: 4,
    // FLOAT
    type: { ordinal: 1, size: 4 },
    numElements: 3,
    byteSize: 12
  },
  FILLER_1B: {
    // FILLER
    name: 5,
    // UINT8
    type: { ordinal: 2, size: 1 },
    //1
    numElements: 1,
    byteSize: 1
  },
  INTENSITY: {
    // INTENSITY
    name: 6,
    // UINT16
    type: { ordinal: 4, size: 2 },
    // 1
    numElements: 1,
    byteSize: 2
  },
  CLASSIFICATION: {
    // CLASSIFICATION
    name: 7,
    // UINT8
    type: { ordinal: 3, size: 1 },
    // 1
    numElements: 1,
    byteSize: 1
  },
  NORMAL_SPHEREMAPPED: {
    // NORMAL_SPHEREMAPPED
    name: 8,
    // UINT8
    type: { ordinal: 3, size: 1 },
    // 2
    numElements: 2,
    byteSize: 1
  },
  NORMAL_OCT16: {
    // NORMAL_OCT16
    name: 9,
    // UINT8
    type: { ordinal: 3, size: 1 },
    // 2
    numElements: 2,
    byteSize: 2
  },
  NORMAL: {
    // NORMAL
    name: 10,
    // FLOAT
    type: { ordinal: 1, size: 4 },
    // 3
    numElements: 3,
    byteSize: 12
  },
  RETURN_NUMBER: {
    // NORMAL
    name: 11,
    // FLOAT
    type: { ordinal: 1, size: 4 },
    // 3
    numElements: 3,
    byteSize: 12
  },
  NUMBER_OF_RETURNS: {
    // NORMAL
    name: 10,
    // FLOAT
    type: { ordinal: 1, size: 4 },
    // 3
    numElements: 3,
    byteSize: 12
  },
  SOURCE_ID: {
    // NORMAL
    name: 10,
    // FLOAT
    type: { ordinal: 1, size: 4 },
    // 3
    numElements: 3,
    byteSize: 12
  },
  INDICIES: {
    // INDICIES
    name: 14,
    // UINT32
    type: { ordinal: 7, size: 4 },
    // 1
    numElements: 1,
    byteSize: 4
  },
  SPACING: {
    // SPACING
    name: 15,
    // FLOAT
    type: { ordinal: 1, size: 4 },
    // 1
    numElements: 1,
    byteSize: 4
  },
  GPS_TIME: {
    // GPS_TIME
    name: 16,
    // DOUBLE
    type: { ordinal: 0, size: 8 },
    // 1,
    numElements: 1,
    byteSize: 8
  }
};

export class PointAttributes {
  attributes: any[];
  byteSize: number = 0;
  size: number = 0;
  constructor(pointAttributes) {
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
  }

  hasColors() {
    // COLOR PACKED name = 1
    return R.any(R.propEq('name', 1))(R.values(this.attributes));
  }

  hasNormals() {
    const hn = R.anyPass([
      R.propEq('name', 8),
      R.propEq('name', 4),
      R.propEq('name', 9),
      R.propEq('name', 10)
    ]);

    return R.any(hn)(R.values(this.attributes));
  }
}
