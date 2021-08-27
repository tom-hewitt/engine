import { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import {
  Expression,
  ExpressionId,
  setExpression,
} from "../../reducers/expressions";
import Literal from "../Literal/Literal";
import { useDispatch, useSelector } from "react-redux";
import { State } from "../../reducers/reducer";
import { useDroppable } from "@dnd-kit/core";
import { DynamicExpression } from "../../reducers/expressions";
import ExpressionBlock, {
  ParentDragContext,
} from "../ExpressionBlock/ExpressionBlock";
import colors from "../../styles/colors";
import hexToRGB from "../../utilities/hexToRGB";
import { DragOverlayContext } from "../BlocksDndContext/BlocksDndContext";
const Placeholder = styled(motion.div)`
  display: inline-flex;

  border-radius: 6px;
  background-color: rgba(70, 70, 70, 1);
`;

export interface ExpressionProps {
  expression: ExpressionId;
}

function DynamicExpressionView(props: {
  id: ExpressionId;
  expression: DynamicExpression;
}) {
  const expressionBlock = useSelector(
    (store: State) =>
      store.current.expressionBlocks[props.expression.expressionBlock]
  );

  return (
    <ExpressionBlock
      id={props.expression.expressionBlock}
      expressionBlock={expressionBlock}
    />
  );
}

function InnerExpression(props: { id: ExpressionId; expression: Expression }) {
  const dispatch = useDispatch();

  if (props.expression.expressionType === "Block") {
    return (
      <DynamicExpressionView id={props.id} expression={props.expression} />
    );
  } else {
    return (
      <Literal
        {...props.expression}
        onSubmit={(literal: Literal) =>
          dispatch(setExpression(props.id, literal))
        }
      />
    );
  }
}

function DroppableExpression(props: {
  id: ExpressionId;
  expression: Expression;
}) {
  const isParentDragging = useContext(ParentDragContext);

  const { setNodeRef, isOver, active } = useDroppable({
    id: props.id,
    data: {
      droppableType: "Expression",
      expression: props.id,
    },
    disabled: isParentDragging,
  });

  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setIsHovered(
      isOver && active?.data.current?.draggableType === "ExpressionBlock"
    );
  }, [isOver, active]);

  return (
    <Placeholder
      ref={setNodeRef}
      animate={{
        border: isHovered
          ? `1px solid ${colors.Primary}`
          : `1px solid ${hexToRGB(colors.Primary, "0")}`,
      }}
    >
      <InnerExpression id={props.id} expression={props.expression} />
    </Placeholder>
  );
}

export default function ExpressionView(props: { expression: ExpressionId }) {
  const expression = useSelector(
    (state: State) => state.current.expressions[props.expression]
  );

  const isDragOverlay = useContext(DragOverlayContext);

  if (isDragOverlay) {
    return (
      <Placeholder style={{ border: "1px solid rgba(0, 0, 0, 0)" }}>
        <InnerExpression id={props.expression} expression={expression} />
      </Placeholder>
    );
  } else {
    return (
      <DroppableExpression id={props.expression} expression={expression} />
    );
  }
}
