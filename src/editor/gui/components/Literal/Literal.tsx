import React from "react";
import LiteralBooleanView from "./LiteralBoolean/LiteralBoolean";
import LiteralStringView from "./LiteralString/LiteralString";
import LiteralIntegerView from "./LiteralInteger/LiteralInteger";
import LiteralFloatView from "./LiteralFloat/LiteralFloat";
import Literal3DVectorView from "./LiteralVector3D/LiteralVector3D";
import LiteralColor from "./LiteralColor/LiteralColor";
import LiteralGeometry from "./LiteralGeometry/LiteralGeometry";
import LiteralMaterial from "./LiteralMaterial/LiteralMaterial";

export type LiteralProps =
  | LiteralBooleanProps
  | LiteralStringProps
  | LiteralIntegerProps
  | LiteralFloatProps
  | LiteralVector3DProps
  | LiteralColorProps
  | LiteralGeometryProps
  | LiteralMaterialProps;

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

interface LiteralGeometryProps extends LiteralGeometry {
  onSubmit: (literal: LiteralGeometry) => void;
}

interface LiteralMaterialProps extends LiteralMaterial {
  onSubmit: (literal: LiteralMaterial) => void;
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
    case "Geometry":
      return (
        <LiteralGeometry
          {...props}
          onSubmit={(value) => props.onSubmit({ type: "Geometry", value })}
        />
      );
    case "Material":
      return (
        <LiteralMaterial
          {...props}
          onSubmit={(value) => props.onSubmit({ type: "Material", value })}
        />
      );
  }
}
