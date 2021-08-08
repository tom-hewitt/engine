import { useState } from "react";
import styled from "styled-components";
import typeColors from "../../../styles/typeColors";
import { motion } from "framer-motion";
import { useDraggable } from "@dnd-kit/core";
import { GrowingInput } from "../InputField/InputField";
import hexToRGB from "../../../utilities/hexToRGB";

const color = typeColors["3D Vector"];
const backgroundColor = hexToRGB(color, "0.1");
const transparentBackgroundColor = hexToRGB(color, "0");

const Container = styled(motion.div)`
    display: inline-flex;
    flex-direction: row;
    align-items: center;

    padding: 10px;

    border: 1px solid ${typeColors["3D Vector"]};
    box-sizing: border-box;
    border-radius: 5px;

    cursor: default;
`;

let FieldName = styled.span`
    font-family: IBM Plex Mono;
    font-weight: 500;
    font-size: 10px;

    user-select: none;

    margin-right: 5px;

    color: ${typeColors["3D Vector"]};
`;

export default function Literal3DVector(props: { value: vector3d, onSubmit: (value: vector3d) => void }) {
    const [focus, setFocus] = useState({
        x: false,
        y: false,
        z: false
    });

    const [stringValue, setStringValue] = useState({
        x: props.value.x.toString(),
        y: props.value.y.toString(),
        z: props.value.z.toString()
    });

    const onFocus = (field: "x" | "y" | "z") => {
        setFocus((oldFocus) => ({
            ...oldFocus,
            [field]: true
        }));
    }

    const onChange = (value: string, field: "x" | "y"| "z") => {
        setStringValue((oldValue) => ({
            ...oldValue,
            [field]: value
        }));
    };

    const onSubmit = (field: "x" | "y"| "z") => {
        const newValue = parseFloat(stringValue[field]);
        if (!isNaN(newValue)) {
            if (newValue !== props.value[field]) {
                props.onSubmit({
                    ...props.value,
                    [field]: newValue
                });
            }
        } else {
            setStringValue((oldValue) => ({
                ...oldValue,
                [field]: props.value[field]
            }));
        }
        setFocus((oldFocus) => ({
            ...oldFocus,
            [field]: false
        }));
    }

    // Must make this a draggable so it blocks any draggables underneath from being dragged when the user is trying to select text
    const {attributes, listeners, setNodeRef} = useDraggable({
        id: "input"
    });

    return (
        <div
            className="input"
            ref={setNodeRef}
            {...attributes}
            {...listeners}
        >
            <Container
                animate={{
                    background: focus.x || focus.y || focus.z ? backgroundColor : transparentBackgroundColor
                }}
            >
                    <FieldName>x:</FieldName>
                    <GrowingInput
                        color={color}
                        value={stringValue.x}
                        onFocus={() => onFocus("x")}
                        onChange={(value) => onChange(value, "x")}
                        onSubmit={() => onSubmit("x")}
                    />
                    <FieldName>, y:</FieldName>
                    <GrowingInput
                        color={color}
                        value={stringValue.y}
                        onFocus={() => onFocus("y")}
                        onChange={(value) => onChange(value, "y")}
                        onSubmit={() => onSubmit("y")}
                    />
                    <FieldName>, z:</FieldName>
                    <GrowingInput
                        color={color}
                        value={stringValue.z}
                        onFocus={() => onFocus("z")}
                        onChange={(value) => onChange(value, "z")}
                        onSubmit={() => onSubmit("z")}
                    />
            </Container>
        </div>
    );
};