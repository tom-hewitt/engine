import { useState } from "react";
import styled from "styled-components";
import typeColors from "../../../styles/typeColors";
import { motion } from "framer-motion";
import { useDraggable } from "@dnd-kit/core";
import { GrowingInput } from "../InputField/InputField";
import hexToRGB from "../../../utilities/hexToRGB";
import { useEffect } from "react";

const color = typeColors["3D Vector"];
const backgroundColor = hexToRGB(color, "0.1");
const transparentBackgroundColor = hexToRGB(color, "0");

const Container = styled.div`
  display: inline-flex;
  flex-direction: row;
  align-items: center;

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

let Field = styled(motion.div)<{ border?: boolean }>`
  padding: 10px 10px 10px 13px;

  ${(props) =>
    props.border ? `border-right: 1px solid ${typeColors["3D Vector"]};` : ""}
`;

export default function Literal3DVector(props: {
  value: vector3d;
  onSubmit: (value: vector3d) => void;
}) {
  const [focus, setFocus] = useState({
    x: false,
    y: false,
    z: false,
  });

  const vectorToStrings = (value: vector3d) => ({
    x: value.x.toString(),
    y: value.y.toString(),
    z: value.z.toString(),
  });

  const [stringValue, setStringValue] = useState(vectorToStrings(props.value));

  useEffect(() => setStringValue(vectorToStrings(props.value)), [props.value]);

  const onFocus = (field: "x" | "y" | "z") => {
    setFocus((oldFocus) => ({
      ...oldFocus,
      [field]: true,
    }));
  };

  const onChange = (value: string, field: "x" | "y" | "z") => {
    setStringValue((oldValue) => ({
      ...oldValue,
      [field]: value,
    }));
  };

  const onSubmit = (field: "x" | "y" | "z") => {
    const newValue = parseFloat(stringValue[field]);
    if (!isNaN(newValue) && newValue !== props.value[field]) {
      if (newValue !== props.value[field]) {
        props.onSubmit({
          ...props.value,
          [field]: newValue,
        });
      }
    } else {
      setStringValue((oldValue) => ({
        ...oldValue,
        [field]: props.value[field],
      }));
    }
    setFocus((oldFocus) => ({
      ...oldFocus,
      [field]: false,
    }));
  };

  // Must make this a draggable so it blocks any draggables underneath from being dragged when the user is trying to select text
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: "input",
  });

  return (
    <div className="input" ref={setNodeRef} {...attributes} {...listeners}>
      <Container>
        <Field
          border
          animate={{
            background: focus.x ? backgroundColor : transparentBackgroundColor,
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
        </Field>
        <Field
          border
          animate={{
            background: focus.y ? backgroundColor : transparentBackgroundColor,
          }}
        >
          <FieldName>y:</FieldName>
          <GrowingInput
            color={color}
            value={stringValue.y}
            onFocus={() => onFocus("y")}
            onChange={(value) => onChange(value, "y")}
            onSubmit={() => onSubmit("y")}
          />
        </Field>
        <Field
          animate={{
            background: focus.z ? backgroundColor : transparentBackgroundColor,
          }}
        >
          <FieldName>z:</FieldName>
          <GrowingInput
            color={color}
            value={stringValue.z}
            onFocus={() => onFocus("z")}
            onChange={(value) => onChange(value, "z")}
            onSubmit={() => onSubmit("z")}
          />
        </Field>
      </Container>
    </div>
  );
}
