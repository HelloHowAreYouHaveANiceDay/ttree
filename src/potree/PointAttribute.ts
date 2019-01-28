import PointAttributeNames from "./PointAttributeNames";
import PointAttributeTypes from "./PointAttributeTypes";

interface pAttributeType {
  ordinal: number;
  size: number;
}

interface pAttribute {
  name?: number;
  type?: {
    size: number;
  };
  numElements?: number;
  byteSize?: number;
}

interface PointAttribute {
  NORMAL_SPHEREMAPPED?: pAttribute;
  NORMAL_FLOATS?: pAttribute;
  NORMAL?: pAttribute;
  NORMAL_OCT16?: pAttribute;
  COLOR_PACKED?: pAttribute;
  POSITION_CARTESIAN?: pAttribute;
  RGBA_PACKED?: pAttribute;
  RGB_PACKED?: pAttribute;
  FILLER_1B?: pAttribute;
  INTENSITY?: pAttribute;
  CLASSIFICATION?: pAttribute;
  RETURN_NUMBER?: pAttribute;
  NUMBER_OF_RETURNS?: pAttribute;
  SOURCE_ID?: pAttribute;
  INDICES?: pAttribute;
  SPACING?: pAttribute;
  GPS_TIME?: pAttribute;
}

const PointAttribute: PointAttribute = {};
// class PointAttribute {
//   constructor(name, type, numElements) {
//     this.name = name;
//     this.type = type;
//     this.numElements = numElements;
//     this.byteSize = this.numElements * this.type.size;
//   }
// }

const createPointAttribute: (
  a: number,
  b: pAttributeType,
  c: number
) => pAttribute = (name, type, numElements) => {
  return {
    name,
    type,
    numElements,
    byteSize: numElements * type.size
  };
};

PointAttribute.POSITION_CARTESIAN = createPointAttribute(
  PointAttributeNames.POSITION_CARTESIAN,
  PointAttributeTypes.DATA_TYPE_FLOAT,
  3
);
// new PointAttribute(
//   PointAttributeNames.POSITION_CARTESIAN,
//   PointAttributeTypes.DATA_TYPE_FLOAT,
//   3
// );

PointAttribute.RGBA_PACKED = createPointAttribute(
  PointAttributeNames.COLOR_PACKED,
  PointAttributeTypes.DATA_TYPE_INT8,
  4
);

// new PointAttribute(
//   PointAttributeNames.COLOR_PACKED,
//   PointAttributeTypes.DATA_TYPE_INT8,
//   4
// );

PointAttribute.COLOR_PACKED = PointAttribute.RGBA_PACKED;

PointAttribute.RGB_PACKED = createPointAttribute(
  PointAttributeNames.COLOR_PACKED,
  PointAttributeTypes.DATA_TYPE_INT8,
  3
);
// new PointAttribute(
//   PointAttributeNames.COLOR_PACKED,
//   PointAttributeTypes.DATA_TYPE_INT8,
//   3
// );

PointAttribute.NORMAL_FLOATS = createPointAttribute(
  PointAttributeNames.NORMAL_FLOATS,
  PointAttributeTypes.DATA_TYPE_FLOAT,
  3
);
// new PointAttribute(
//   PointAttributeNames.NORMAL_FLOATS,
//   PointAttributeTypes.DATA_TYPE_FLOAT,
//   3
// );

PointAttribute.FILLER_1B = createPointAttribute(
  PointAttributeNames.FILLER,
  PointAttributeTypes.DATA_TYPE_UINT8,
  1
);
// new PointAttribute(
//   PointAttributeNames.FILLER,
//   PointAttributeTypes.DATA_TYPE_UINT8,
//   1
// );

PointAttribute.INTENSITY = createPointAttribute(
  PointAttributeNames.INTENSITY,
  PointAttributeTypes.DATA_TYPE_UINT16,
  1
);
// new PointAttribute(
//   PointAttributeNames.INTENSITY,
//   PointAttributeTypes.DATA_TYPE_UINT16,
//   1
// );

PointAttribute.CLASSIFICATION = createPointAttribute(
  PointAttributeNames.CLASSIFICATION,
  PointAttributeTypes.DATA_TYPE_UINT8,
  1
);
// new PointAttribute(
//   PointAttributeNames.CLASSIFICATION,
//   PointAttributeTypes.DATA_TYPE_UINT8,
//   1
// );

PointAttribute.NORMAL_SPHEREMAPPED = createPointAttribute(
  PointAttributeNames.NORMAL_SPHEREMAPPED,
  PointAttributeTypes.DATA_TYPE_UINT8,
  2
);
// new PointAttribute(
//   PointAttributeNames.NORMAL_SPHEREMAPPED,
//   PointAttributeTypes.DATA_TYPE_UINT8,
//   2
// );

PointAttribute.NORMAL_OCT16 = createPointAttribute(
  PointAttributeNames.NORMAL_OCT16,
  PointAttributeTypes.DATA_TYPE_UINT8,
  2
);
// new PointAttribute(
//   PointAttributeNames.NORMAL_OCT16,
//   PointAttributeTypes.DATA_TYPE_UINT8,
//   2
// );

PointAttribute.NORMAL = createPointAttribute(
  PointAttributeNames.NORMAL,
  PointAttributeTypes.DATA_TYPE_FLOAT,
  3
);
// new PointAttribute(
//   PointAttributeNames.NORMAL,
//   PointAttributeTypes.DATA_TYPE_FLOAT,
//   3
// );

PointAttribute.RETURN_NUMBER = createPointAttribute(
  PointAttributeNames.NORMAL,
  PointAttributeTypes.DATA_TYPE_FLOAT,
  3
);
// new PointAttribute(
//   PointAttributeNames.RETURN_NUMBER,
//   PointAttributeTypes.DATA_TYPE_UINT8,
//   1
// );

PointAttribute.NUMBER_OF_RETURNS = createPointAttribute(
  PointAttributeNames.NORMAL,
  PointAttributeTypes.DATA_TYPE_FLOAT,
  3
);
// new PointAttribute(
//   PointAttributeNames.NUMBER_OF_RETURNS,
//   PointAttributeTypes.DATA_TYPE_UINT8,
//   1
// );

PointAttribute.SOURCE_ID = createPointAttribute(
  PointAttributeNames.NORMAL,
  PointAttributeTypes.DATA_TYPE_FLOAT,
  3
);
// new PointAttribute(
//   PointAttributeNames.SOURCE_ID,
//   PointAttributeTypes.DATA_TYPE_UINT16,
//   1
// );

PointAttribute.INDICES = createPointAttribute(
  PointAttributeNames.INDICES,
  PointAttributeTypes.DATA_TYPE_UINT32,
  1
);
// new PointAttribute(
//   PointAttributeNames.INDICES,
//   PointAttributeTypes.DATA_TYPE_UINT32,
//   1
// );

PointAttribute.SPACING = createPointAttribute(
  PointAttributeNames.SPACING,
  PointAttributeTypes.DATA_TYPE_FLOAT,
  1
);
// new PointAttribute(
//   PointAttributeNames.SPACING,
//   PointAttributeTypes.DATA_TYPE_FLOAT,
//   1
// );

PointAttribute.GPS_TIME = createPointAttribute(
  PointAttributeNames.GPS_TIME,
  PointAttributeTypes.DATA_TYPE_DOUBLE,
  1
);
// new PointAttribute(
//   PointAttributeNames.GPS_TIME,
//   PointAttributeTypes.DATA_TYPE_DOUBLE,
//   1
// );

export default PointAttribute;
