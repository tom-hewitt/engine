interface vector2d {
  x: number;
  y: number;
}

interface vector3d {
  x: number;
  y: number;
  z: number;
}

interface rgb {
  r: number;
  g: number;
  b: number;
}

type Type = ValueType | ReferenceType;

type ValueType =
  | "Boolean"
  | "String"
  | "Integer"
  | "Float"
  | "Vector3D"
  | "Color"
  | "Mesh";

type ReferenceType =
  | "Boolean Reference"
  | "String Reference"
  | "Integer Reference"
  | "Float Reference"
  | "Vector3D Reference";

type Literal =
  | LiteralBoolean
  | LiteralString
  | LiteralInteger
  | LiteralFloat
  | LiteralVector3D
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

interface LiteralVector3D extends BaseLiteral {
  type: "Vector3D";
  value: vector3d;
}

interface LiteralColor extends BaseLiteral {
  type: "Color";
  value: rgb;
}

interface LiteralMesh extends BaseLiteral {
  type: "Mesh";
  value: string;
}
