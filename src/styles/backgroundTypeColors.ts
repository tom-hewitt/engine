import colors from "./colors";

const backgroundTypeColors: Record<Type, string> = {
  Boolean: "#4A4141",
  String: "#4A4148",
  Integer: "#374545",
  Float: "#414A44",
  "3D Vector": "#4E4436",
  "Boolean Reference": colors.Block,
  "String Reference": colors.Block,
  "Integer Reference": colors.Block,
  "Float Reference": colors.Block,
  "3D Vector Reference": colors.Block,
};

export default backgroundTypeColors;
