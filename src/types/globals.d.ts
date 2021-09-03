interface vector2d {
  x: number;
  y: number;
}

interface vector3d {
  x: number;
  y: number;
  z: number;
}

type Type = ValueType | ReferenceType;

type ValueType =
  | "Boolean"
  | "String"
  | "Integer"
  | "Float"
  | "3D Vector"
  | "Color"
  | "Mesh";

type ReferenceType =
  | "Boolean Reference"
  | "String Reference"
  | "Integer Reference"
  | "Float Reference"
  | "3D Vector Reference";

type Literal =
  | LiteralBoolean
  | LiteralString
  | LiteralInteger
  | LiteralFloat
  | Literal3DVector
  | LiteralColor
  | LiteralMesh;

interface BaseLiteral {
  expressionType?: "Literal";
}

interface LiteralBoolean extends BaseLiteral {
  type: "Boolean";
  value: boolean;
}

interface LiteralString extends BaseLiteral {
  type: "String";
  value: string;
}

interface LiteralInteger extends BaseLiteral {
  type: "Integer";
  value: number;
}

interface LiteralFloat extends BaseLiteral {
  type: "Float";
  value: number;
}

interface Literal3DVector extends BaseLiteral {
  type: "3D Vector";
  value: vector3d;
}

interface LiteralColor extends BaseLiteral {
  type: "Color";
  value: number;
}

interface LiteralMesh extends BaseLiteral {
  type: "Mesh";
  value: string;
}
