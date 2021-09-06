import styled from "styled-components";
import { motion } from "framer-motion";
import { useDraggable } from "@dnd-kit/core";
import typeColors from "../../../styles/typeColors";
import hexToRGB from "../../../utilities/hexToRGB";
import { useState } from "react";

const color = typeColors["Boolean"];
const backgroundColor = hexToRGB(color, "0.1");
const transparentBackgroundColor = hexToRGB(color, "0");

const Container = styled(motion.div)<{ color: string }>`
  display: inline-flex;
  flex-direction: row;

  padding: 10px;

  border: 1px solid ${(props) => props.color};
  box-sizing: border-box;
  border-radius: 5px;

  cursor: pointer;
`;

let Text = styled(motion.span)<{ color: string }>`
  font-family: IBM Plex Mono;
  font-weight: 500;
  font-size: 10px;

  user-select: none;

  color: ${(props) => props.color};
`;

export default function LiteralBoolean(props: {
  value: boolean;
  onSubmit: (value: boolean) => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  // Must make this a draggable so it blocks any draggables underneath from being dragged
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: "input",
  });

  return (
    <div ref={setNodeRef} className="input" {...attributes} {...listeners}>
      <Container
        color={color}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        animate={{
          backgroundColor: isHovered
            ? backgroundColor
            : transparentBackgroundColor,
        }}
        onClick={() => props.onSubmit(!props.value)}
      >
        <Text color={color}>{props.value ? "true" : "false"}</Text>
      </Container>
    </div>
  );
}
