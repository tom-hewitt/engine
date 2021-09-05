import { useState } from "react";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
import { useDraggable } from "@dnd-kit/core";
import { GrowingInput } from "../InputField/InputField";
import hexToRGB from "../../../utilities/hexToRGB";
import { useEffect } from "react";
import colors from "../../../styles/colors";
import { RgbColorPicker } from "react-colorful";

const color = colors.Primary;
const backgroundColor = hexToRGB(color, "0.1");
const transparentBackgroundColor = hexToRGB(color, "0");

const OuterContainer = styled.div`
  position: relative;
`;

const Container = styled.div`
  display: inline-flex;
  flex-direction: row;
  align-items: center;

  border: 1px solid ${color};
  box-sizing: border-box;
  border-radius: 5px;

  cursor: default;

  overflow: hidden;
`;

const Preview = styled(motion.div)`
  width: 30px;
  align-self: stretch;

  margin: 3px;

  border-radius: 3px;

  cursor: pointer;
`;

let FieldName = styled.span`
  font-family: IBM Plex Mono;
  font-weight: 500;
  font-size: 10px;

  user-select: none;

  margin-right: 5px;

  color: ${color};
`;

const PickerContainer = styled(motion.div)`
  position: absolute;
  margin-top: 5px;
`;

let Field = styled(motion.div)<{ border?: boolean }>`
  padding: 8px 8px 10px 12px;

  ${(props) => (props.border ? `border-right: 1px solid ${color};` : "")}
`;

function Picker(props: { color: rgb; onChange: (value: rgb) => void }) {
  return (
    <PickerContainer
      initial={{
        scale: 0.95,
        opacity: 0,
      }}
      animate={{
        scale: 1,
        opacity: 1,
      }}
      exit={{
        scale: 0.95,
        opacity: 0,
        transition: {
          duration: 0.2,
        },
      }}
    >
      <RgbColorPicker {...props} />
    </PickerContainer>
  );
}

export default function LiteralColor(props: {
  value: rgb;
  onSubmit: (value: rgb) => void;
}) {
  const [focus, setFocus] = useState({
    r: false,
    g: false,
    b: false,
  });

  const [showPicker, setShowPicker] = useState(false);

  const vectorToStrings = (value: rgb) => ({
    r: value.r.toString(),
    g: value.g.toString(),
    b: value.b.toString(),
  });

  const [stringValue, setStringValue] = useState(vectorToStrings(props.value));

  useEffect(() => setStringValue(vectorToStrings(props.value)), [props.value]);

  const onFocus = (field: keyof rgb) => {
    setFocus((oldFocus) => ({
      ...oldFocus,
      [field]: true,
    }));
  };

  const onChange = (value: string, field: keyof rgb) => {
    setStringValue((oldValue) => ({
      ...oldValue,
      [field]: value,
    }));
  };

  const onSubmit = (field: keyof rgb) => {
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
    <OuterContainer>
      <div className="input" ref={setNodeRef} {...attributes} {...listeners}>
        <Container>
          <Preview
            animate={{
              backgroundColor: `rgb(${props.value.r}, ${props.value.g}, ${props.value.b})`,
            }}
            whileTap={{
              scale: 0.95,
            }}
            onClick={() => setShowPicker(!showPicker)}
          />
          <Field
            border
            animate={{
              background: focus.r
                ? backgroundColor
                : transparentBackgroundColor,
            }}
          >
            <FieldName>r:</FieldName>
            <GrowingInput
              color={color}
              value={stringValue.r}
              onFocus={() => onFocus("r")}
              onChange={(value) => onChange(value, "r")}
              onSubmit={() => onSubmit("r")}
            />
          </Field>
          <Field
            border
            animate={{
              background: focus.g
                ? backgroundColor
                : transparentBackgroundColor,
            }}
          >
            <FieldName>g:</FieldName>
            <GrowingInput
              color={color}
              value={stringValue.g}
              onFocus={() => onFocus("g")}
              onChange={(value) => onChange(value, "g")}
              onSubmit={() => onSubmit("g")}
            />
          </Field>
          <Field
            animate={{
              background: focus.b
                ? backgroundColor
                : transparentBackgroundColor,
            }}
          >
            <FieldName>b:</FieldName>
            <GrowingInput
              color={color}
              value={stringValue.b}
              onFocus={() => onFocus("b")}
              onChange={(value) => onChange(value, "b")}
              onSubmit={() => onSubmit("b")}
            />
          </Field>
        </Container>
      </div>
      <AnimatePresence>
        {showPicker ? (
          <Picker color={props.value} onChange={props.onSubmit} />
        ) : null}
      </AnimatePresence>
    </OuterContainer>
  );
}
