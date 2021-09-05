import React from "react";
import LiteralBooleanView from "./LiteralBoolean/LiteralBoolean";
import LiteralStringView from "./LiteralString/LiteralString";
import LiteralIntegerView from "./LiteralInteger/LiteralInteger";
import LiteralFloatView from "./LiteralFloat/LiteralFloat";
import Literal3DVectorView from "./LiteralVector3D/LiteralVector3D";
import LiteralColor from "./LiteralColor/LiteralColor";

export type LiteralProps =
  | LiteralBooleanProps
  | LiteralStringProps
  | LiteralIntegerProps
  | LiteralFloatProps
  | LiteralVector3DProps
  | LiteralColorProps
  | LiteralMeshProps;

interface LiteralBooleanProps extends LiteralBoolean {
  onSubmit: (literal: LiteralBoolean) => void;
}

interface LiteralStringProps extends LiteralString {
  onSubmit: (literal: LiteralString) => void;
}

interface LiteralIntegerProps extends LiteralInteger {
  onSubmit: (literal: LiteralInteger) => void;
}

interface LiteralFloatProps extends LiteralFloat {
  onSubmit: (literal: LiteralFloat) => void;
}

interface LiteralVector3DProps extends LiteralVector3D {
  onSubmit: (literal: LiteralVector3D) => void;
}

interface LiteralColorProps extends LiteralColor {
  onSubmit: (literal: LiteralColor) => void;
}

interface LiteralMeshProps extends LiteralMesh {
  onSubmit: (literal: LiteralMesh) => void;
}

export default function Literal(props: LiteralProps) {
  switch (props.type) {
    case "Boolean":
      return (
        <LiteralBooleanView
          value={props.value}
          onSubmit={(value) => props.onSubmit({ type: "Boolean", value })}
        />
      );
    case "String":
      return (
        <LiteralStringView
          {...props}
          onSubmit={(value) => props.onSubmit({ type: "String", value })}
        />
      );
    case "Integer":
      return (
        <LiteralIntegerView
          {...props}
          onSubmit={(value) => props.onSubmit({ type: "Integer", value })}
        />
      );
    case "Float":
      return (
        <LiteralFloatView
          {...props}
          onSubmit={(value) => props.onSubmit({ type: "Float", value })}
        />
      );
    case "Vector3D":
      return (
        <Literal3DVectorView
          {...props}
          onSubmit={(value) => props.onSubmit({ type: "Vector3D", value })}
        />
      );
    case "Color":
      return (
        <LiteralColor
          {...props}
          onSubmit={(value) => props.onSubmit({ type: "Color", value })}
        />
      );
    case "Mesh":
      return <p>LITERAL MESH</p>;
  }
}
