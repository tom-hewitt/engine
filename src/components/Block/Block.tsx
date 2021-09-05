import React from "react";
import { motion } from "framer-motion";
import { useDraggable } from "@dnd-kit/core";
import {
  Block,
  BlockId,
  BuiltInFunctionBlock,
  FunctionBlock,
  SetVariableBlock,
} from "../../reducers/blocks";
import hexToRGB from "../../utilities/hexToRGB";
import { useSelector } from "react-redux";
import { State } from "../../reducers/reducer";
import typeColors from "../../styles/typeColors";
import colors from "../../styles/colors";
import Expression from "../Expression/Expression";
import FunctionIcon from "../Icons/FunctionIcon/FunctionIcon";
import TypeText from "../TypeText/TypeText";
import { ExpressionId } from "../../reducers/expressions";
import { useContext } from "react";
import { BlocksContainerContext } from "../BlocksContainer/BlocksContainer";
import "./block.scss";

export const BlockContext = React.createContext<{ id?: BlockId }>({});

function SetVariableBlockView(props: { block: SetVariableBlock }) {
  return (
    <motion.div className="block">
      <span className={`opcode ${props.block.type}`}>SET VARIABLE</span>
      <div className="setVariableContainer">
        <Expression expression={props.block.variable} />
        <span className="blockEquals">=</span>
        <Expression expression={props.block.to} />
      </div>
    </motion.div>
  );
}

function ArgumentView(props: {
  name: string;
  expression: ExpressionId;
  setIsDragging?: (value: boolean) => void;
}) {
  const type = useSelector(
    (state: State) => state.current.expressions[props.expression].type
  );

  return (
    <>
      <div className="argumentDetails">
        <span className="functionParameterName">{props.name}</span>
        <TypeText type={type} />
      </div>
      <span className="blockEquals">=</span>
      <Expression expression={props.expression} />
    </>
  );
}

export function FunctionBlockView(props: {
  block: FunctionBlock | BuiltInFunctionBlock;
}) {
  const color = props.block.type
    ? typeColors[props.block.type]
    : colors.Primary;
  const { id } = useContext(BlockContext);
  const expressionBlock = useSelector((state: State) =>
    id ? state.current.blocks[id].parentType === "Expression Block" : undefined
  );

  return (
    <motion.div className="block">
      <span className={`opcode ${props.block.type ? props.block.type : ""}`}>
        FUNCTION
      </span>
      <div className="functionHeader">
        <FunctionIcon color={color} />
        <div className="functionDetails">
          <span className="blockTitle">{props.block.name}</span>
          {props.block.type ? <TypeText type={props.block.type} /> : null}
        </div>
      </div>
      {props.block.arguments.order ? (
        <>
          <span className="blockSubheading">PARAMETERS</span>
          <div className="arguments">
            {props.block.arguments.order.map((name) => (
              <ArgumentView
                name={name}
                expression={
                  props.block.arguments.byId[
                    name as keyof typeof props.block.arguments.byId
                  ]
                }
                key={name}
              />
            ))}
          </div>
        </>
      ) : null}
    </motion.div>
  );
}

function BlockView(props: { block: Block }) {
  switch (props.block.opcode) {
    case "Set Variable": {
      return <SetVariableBlockView block={props.block} />;
    }
    case "Function": {
      return <FunctionBlockView block={props.block} />;
    }
    case "Built In Function": {
      return <FunctionBlockView block={props.block} />;
    }
  }
}

export function BlockNode(props: { id: BlockId }) {
  const block = useSelector(
    (state: State) => state.current.blocks[props.id].block
  );

  if (!block) {
    throw new Error(`Block with id: "${props.id}" does not exist`);
  }

  return (
    <BlockContext.Provider value={{ id: props.id }}>
      <BlockView block={block} />
    </BlockContext.Provider>
  );
}

export default function DraggableBlock(props: { id: BlockId; index?: number }) {
  const { container } = useContext(BlocksContainerContext);

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `block-${props.id}`,
    data: {
      draggableType: "Block",
      id: props.id,
      index: props.index,
      container,
    },
  });

  return (
    <motion.div
      className="blockPlaceholder"
      layoutId={`block-placeholder-${props.id}`}
      animate={{
        backgroundColor: isDragging ? "#222222" : hexToRGB("#222222", "0"),
      }}
    >
      <motion.div
        className="draggableBlock"
        ref={setNodeRef}
        layoutId={`block-${props.id}`}
        animate={{
          opacity: isDragging ? 0 : 1,
        }}
        transition={{
          opacity: { duration: 0 },
        }}
        {...listeners}
        {...attributes}
      >
        <BlockNode id={props.id} />
      </motion.div>
    </motion.div>
  );
}
