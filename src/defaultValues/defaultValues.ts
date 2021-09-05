const defaultLiterals: Record<ValueType, Literal> = {
  Boolean: {
    type: "Boolean",
    value: false,
  },
  String: {
    type: "String",
    value: "",
  },
  Integer: {
    type: "Integer",
    value: 0,
  },
  Float: {
    type: "Float",
    value: 0,
  },
  "3D Vector": {
    type: "3D Vector",
    value: {
      x: 0,
      y: 0,
      z: 0,
    },
  },
  Color: {
    type: "Color",
    value: {
      r: 255,
      g: 255,
      b: 255,
    },
  },
  Mesh: {
    type: "Mesh",
    value: "",
  },
};

export default defaultLiterals;
