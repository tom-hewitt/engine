import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useDraggable } from "@dnd-kit/core";
import {
  ExpressionBlock,
  ExpressionBlockId,
  FunctionExpressionBlock,
  OperatorExpressionBlock,
  VariableExpressionBlock,
  VariableReference,
  VariableReferenceBlock,
  Vector3DExpressionBlock,
} from "../../reducers/expressionBlocks";
import VariableIcon from "../Icons/VariableIcon/VariableIcon";
import typeColors from "../../styles/typeColors";
import hexToRGB from "../../utilities/hexToRGB";
import colors from "../../styles/colors";
import backgroundTypeColors from "../../styles/backgroundTypeColors";
import FunctionIcon from "../Icons/FunctionIcon/FunctionIcon";
import Expression from "../Expression/Expression";
import { useContext } from "react";
import { BlockContext } from "../Block/Block";
import { DragOverlayContext } from "../BlocksDndContext/BlocksDndContext";
import { useSelector } from "react-redux";
import { State } from "../../reducers/reducer";
import { ExpandExpressionBlockContext } from "../BlocksContainer/BlocksContainer";

const OuterContainer = styled(motion.div)`
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  user-select: none;

  outline: none;

  cursor: grab;
`;

const Container = styled(motion.div)<{ color: string }>`
  display: inline-flex;
  flex-direction: row;
  align-items: center;

  padding: 10px;

  border: 1px solid ${(props) => props.color};
  box-sizing: border-box;
  border-radius: 5px;
`;

const VerticalContainer = styled(motion.div)<{ color: string }>`
  display: inline-flex;
  flex-direction: column;

  padding: 10px;

  border: 1px solid ${(props) => props.color};
  box-sizing: border-box;
  border-radius: 5px;
`;

const FieldContainer = styled.div`
  margin-top: 10px;
  display: inline-flex;
  flex-direction: row;
  align-items: center;
`;

const Name = styled.span<{ color: string }>`
  font-family: IBM Plex Mono;
  font-style: normal;
  font-weight: 500;
  font-size: 10px;

  color: ${(props) => props.color};
`;

const FunctionName = styled.span`
  font-family: IBM Plex Mono;
  font-style: normal;
  font-weight: 700;
  font-size: 10px;

  color: ${colors.Primary};
`;

const FunctionText = styled.span`
  margin-left: 5px;
  font-family: IBM Plex Mono;
  font-style: normal;
  font-weight: 500;
  font-size: 10px;

  color: ${colors.Primary};
`;

const OperatorText = styled.span<{ color: string }>`
  margin: 0px 10px;

  font-family: IBM Plex Mono;
  font-style: normal;
  font-weight: 500;
  font-size: 10px;

  color: ${(props) => props.color};
`;

const Arrow = styled.svg<{ color: string }>`
  fill: ${(props) => props.color};
  height: 9px;
  weight: 17px;
`;

const Opcode = styled.span<{ color: string }>`
  font-family: IBM Plex Mono;
  font-weight: 600;
  font-size: 10px;

  color: ${(props) => props.color};
`;

const FieldName = styled.span<{ color: string }>`
  margin-right: 10px;

  font-family: IBM Plex Mono;
  font-weight: 600;
  font-size: 10px;

  color: ${(props) => props.color};
`;

export const ParentDragContext = React.createContext(false);
export const ExpressionBlockIdContext = React.createContext<
  ExpressionBlockId | undefined
>(undefined);

function Member(props: {
  member: VariableReference;
  lastType: Type;
  isDragging: boolean;
  isReference: boolean;
}) {
  const color = typeColors[props.member.type];
  const backgroundColor = props.isReference
    ? colors.Block
    : backgroundTypeColors[props.member.type];

  return (
    <>
      <Arrow color={typeColors[props.lastType]} viewBox="0 0 17 9">
        <path d="M0.384489 4.5L3.27124 7.38675L6.15799 4.5L3.27124 1.61325L0.384489 4.5ZM16.6248 4.85355C16.8201 4.65829 16.8201 4.34171 16.6248 4.14645L13.4428 0.964466C13.2476 0.769204 12.931 0.769204 12.7357 0.964466C12.5404 1.15973 12.5404 1.47631 12.7357 1.67157L15.5641 4.5L12.7357 7.32843C12.5404 7.52369 12.5404 7.84027 12.7357 8.03553C12.931 8.2308 13.2476 8.2308 13.4428 8.03553L16.6248 4.85355ZM3.27124 5L16.2712 5V4L3.27124 4V5Z" />
      </Arrow>
      <Container
        color={props.isReference ? "#D6D6D6" : color}
        initial={{
          backgroundColor: backgroundColor,
        }}
        animate={{
          boxShadow: props.isDragging
            ? "0px 10px 10px 0 rgba(0, 0, 0, 0.25)"
            : "0px 0px 0px 0 rgba(0, 0, 0, 0.25)",
          backgroundColor: props.isDragging
            ? hexToRGB(backgroundColor, "0.9")
            : backgroundColor,
        }}
      >
        <Name color={color}>{props.member.variable}</Name>
      </Container>
      {props.member.member ? (
        <Member
          member={props.member.member}
          lastType={props.member.type}
          isDragging={props.isDragging}
          isReference={props.isReference}
        />
      ) : null}
    </>
  );
}

export function VariableBlock(props: {
  expressionBlock: VariableExpressionBlock | VariableReferenceBlock;
  isDragging: boolean;
}) {
  const isReference =
    props.expressionBlock.expressionBlockType === "Variable Reference";
  const color = typeColors[props.expressionBlock.variable.type];
  const backgroundColor = isReference
    ? colors.Block
    : backgroundTypeColors[props.expressionBlock.variable.type];

  return (
    <>
      <Container
        color={isReference ? "#D6D6D6" : color}
        initial={{
          backgroundColor: backgroundColor,
        }}
        animate={{
          boxShadow: props.isDragging
            ? "0px 10px 10px 0 rgba(0, 0, 0, 0.25)"
            : "0px 0px 0px 0 rgba(0, 0, 0, 0.25)",
          backgroundColor: props.isDragging
            ? hexToRGB(backgroundColor, "0.9")
            : backgroundColor,
        }}
      >
        <VariableIcon color={color} />
        <Name color={color}>{props.expressionBlock.variable.variable}</Name>
      </Container>
      {props.expressionBlock.variable.member ? (
        <Member
          member={props.expressionBlock.variable.member}
          lastType={props.expressionBlock.type}
          isDragging={props.isDragging}
          isReference={isReference}
        />
      ) : null}
    </>
  );
}

function FunctionBlock(props: {
  expressionBlock: FunctionExpressionBlock;
  isDragging: boolean;
}) {
  const { block } = useSelector(
    (state: State) => state.current.blocks[props.expressionBlock.block]
  );
  if (!block) throw new Error("Function block cannot be undefined");

  if (!(block.opcode === "Function" || block.opcode === "Built In Function"))
    throw new Error(
      "Block passed to function expression block must be a function"
    );

  if (!block.type)
    throw new Error(
      "Block passed to function expression block must have a return type"
    );

  const color = typeColors[block.type];
  const backgroundColor = backgroundTypeColors[block.type];

  const expressionBlock = useContext(ExpressionBlockIdContext);
  const { toggle } = useContext(ExpandExpressionBlockContext);

  const onClick = () => {
    if (toggle && expressionBlock !== undefined) {
      toggle(expressionBlock);
    }
  };

  return (
    <Container
      color={color}
      initial={{
        backgroundColor: backgroundColor,
      }}
      animate={{
        boxShadow: props.isDragging
          ? "0px 10px 10px 0 rgba(0, 0, 0, 0.25)"
          : "0px 0px 0px 0 rgba(0, 0, 0, 0.25)",
        backgroundColor: props.isDragging
          ? hexToRGB(backgroundColor, "0.9")
          : backgroundColor,
      }}
      onClick={onClick}
    >
      <FunctionIcon color={color} />
      <FunctionName>{block.name}</FunctionName>
      {block.arguments ? <FunctionText>(...)</FunctionText> : null}
    </Container>
  );
}

function OperatorExpressionBlockView(props: {
  expressionBlock: OperatorExpressionBlock;
  isDragging: boolean;
}) {
  const color = typeColors[props.expressionBlock.type];
  const backgroundColor = colors.Block;

  return (
    <Container
      color={color}
      initial={{
        backgroundColor: backgroundColor,
      }}
      animate={{
        boxShadow: props.isDragging
          ? "0px 10px 10px 0 rgba(0, 0, 0, 0.25)"
          : "0px 0px 0px 0 rgba(0, 0, 0, 0.25)",
        backgroundColor: props.isDragging
          ? hexToRGB(backgroundColor, "0.9")
          : backgroundColor,
      }}
    >
      <Expression expression={props.expressionBlock.arguments[0]} />
      <OperatorText color={color}>
        {props.expressionBlock.operation}
      </OperatorText>
      <Expression expression={props.expressionBlock.arguments[1]} />
    </Container>
  );
}

function Vector3DExpressionBlockView(props: {
  expressionBlock: Vector3DExpressionBlock;
  isDragging: boolean;
}) {
  const color = typeColors["3D Vector"];
  const backgroundColor = colors.Block;

  return (
    <VerticalContainer
      color={color}
      initial={{
        backgroundColor: backgroundColor,
      }}
      animate={{
        boxShadow: props.isDragging
          ? "0px 10px 10px 0 rgba(0, 0, 0, 0.25)"
          : "0px 0px 0px 0 rgba(0, 0, 0, 0.25)",
        backgroundColor: props.isDragging
          ? hexToRGB(backgroundColor, "0.9")
          : backgroundColor,
      }}
    >
      <Opcode color={color}>MAKE 3D VECTOR</Opcode>
      <FieldContainer>
        <FieldName color={color}>x: </FieldName>
        <Expression expression={props.expressionBlock.arguments[0]} />
      </FieldContainer>
      <FieldContainer>
        <FieldName color={color}>y: </FieldName>
        <Expression expression={props.expressionBlock.arguments[1]} />
      </FieldContainer>
      <FieldContainer>
        <FieldName color={color}>z: </FieldName>
        <Expression expression={props.expressionBlock.arguments[2]} />
      </FieldContainer>
    </VerticalContainer>
  );
}

function InnerExpressionBlock(props: {
  expressionBlock: ExpressionBlock;
  isDragging: boolean;
}) {
  switch (props.expressionBlock.expressionBlockType) {
    case "Variable": {
      return (
        <VariableBlock
          expressionBlock={props.expressionBlock}
          isDragging={props.isDragging}
        />
      );
    }
    case "Variable Reference": {
      return (
        <VariableBlock
          expressionBlock={props.expressionBlock}
          isDragging={props.isDragging}
        />
      );
    }
    case "Function": {
      return (
        <FunctionBlock
          expressionBlock={props.expressionBlock}
          isDragging={props.isDragging}
        />
      );
    }
    case "Operator": {
      return (
        <OperatorExpressionBlockView
          expressionBlock={props.expressionBlock}
          isDragging={props.isDragging}
        />
      );
    }
    case "3D Vector": {
      return (
        <Vector3DExpressionBlockView
          expressionBlock={props.expressionBlock}
          isDragging={props.isDragging}
        />
      );
    }
  }
}

function DraggableExpressionBlock(props: { expressionBlock: ExpressionBlock }) {
  const id = useContext(ExpressionBlockIdContext);
  if (!id) throw new Error("Draggable expression block id is undefined");

  const { id: blockParent } = useContext(BlockContext);

  const isParentDragging = useContext(ParentDragContext);

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: id,
    data: {
      draggableType: "ExpressionBlock",
      expressionBlock: id,
      blockParent,
    },
  });

  return (
    <OuterContainer
      ref={setNodeRef}
      animate={{
        opacity: isDragging ? 0 : 1,
      }}
      transition={{
        opacity: { duration: 0 },
      }}
      {...listeners}
      {...attributes}
    >
      <ParentDragContext.Provider value={isDragging || isParentDragging}>
        <InnerExpressionBlock
          expressionBlock={props.expressionBlock}
          isDragging={isDragging}
        />
      </ParentDragContext.Provider>
    </OuterContainer>
  );
}

export function ExpressionBlockOverlay(props: { id: ExpressionBlockId }) {
  const expressionBlock = useSelector(
    (state: State) => state.current.expressionBlocks[props.id]
  );

  return (
    <InnerExpressionBlock
      expressionBlock={expressionBlock}
      isDragging={false}
    />
  );
}

export default function ExpressionBlockView(props: {
  id: ExpressionBlockId;
  expressionBlock: ExpressionBlock;
}) {
  const isDragOverlay = useContext(DragOverlayContext);

  if (isDragOverlay) {
    return (
      <ExpressionBlockIdContext.Provider value={props.id}>
        <OuterContainer>
          <InnerExpressionBlock
            expressionBlock={props.expressionBlock}
            isDragging={false}
          />
        </OuterContainer>
      </ExpressionBlockIdContext.Provider>
    );
  } else {
    return (
      <ExpressionBlockIdContext.Provider value={props.id}>
        <DraggableExpressionBlock expressionBlock={props.expressionBlock} />
      </ExpressionBlockIdContext.Provider>
    );
  }
}
