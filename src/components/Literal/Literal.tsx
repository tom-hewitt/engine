import React from "react"
import LiteralBooleanView from "./LiteralBoolean/LiteralBoolean";
import LiteralStringView from "./LiteralString/LiteralString";
import LiteralIntegerView from "./LiteralInteger/LiteralInteger";
import LiteralFloatView from "./LiteralFloat/LiteralFloat";
import Literal3DVectorView from "./Literal3DVector/Literal3DVector";

export type LiteralProps = LiteralBooleanProps | LiteralStringProps | LiteralIntegerProps | LiteralFloatProps | Literal3DVectorProps;

interface LiteralBooleanProps extends LiteralBoolean {
    onSubmit: (literal: LiteralBoolean) => void
}

interface LiteralStringProps extends LiteralString {
    onSubmit: (literal: LiteralString) => void
}

interface LiteralIntegerProps extends LiteralInteger {
    onSubmit: (literal: LiteralInteger) => void
}

interface LiteralFloatProps extends LiteralFloat {
    onSubmit: (literal: LiteralFloat) => void
}

interface Literal3DVectorProps extends Literal3DVector {
    onSubmit: (literal: Literal3DVector) => void
}

export default function Literal(props: LiteralProps) {
    switch (props.type) {
        case "Boolean":
            const s = props;
            return <LiteralBooleanView value={props.value} onSubmit={(value) => props.onSubmit({ type: "Boolean", value })}/>;
        case "String":
            return <LiteralStringView {...props} onSubmit={(value) => props.onSubmit({ type: "String", value })}/>;
        case "Integer":
            return <LiteralIntegerView {...props} onSubmit={(value) => props.onSubmit({ type: "Integer", value })}/>;
        case "Float":
            return <LiteralFloatView {...props} onSubmit={(value) => props.onSubmit({ type: "Float", value })}/>;
        case "3D Vector":
            return <Literal3DVectorView {...props} onSubmit={(value) => props.onSubmit({ type: "3D Vector", value })}/>;
    }
};