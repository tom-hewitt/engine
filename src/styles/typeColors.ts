const baseTypeColors: Record<ValueType, string> = {
  Boolean: "#DA8484",
  String: "#DA84C7",
  Integer: "#1BA9A9",
  Float: "#84DA9C",
  Vector3D: "#FFA115",
  Color: "#FFFFFF",
  Mesh: "#FFFFFF",
};

const referenceTypeColors: Record<ReferenceType, string> = {
  "Boolean Reference": baseTypeColors["Boolean"],
  "String Reference": baseTypeColors["String"],
  "Integer Reference": baseTypeColors["Integer"],
  "Float Reference": baseTypeColors["Float"],
  "Vector3D Reference": baseTypeColors["Vector3D"],
};

const typeColors: Record<Type, string> = Object.assign(
  baseTypeColors,
  referenceTypeColors
);

export default typeColors;
