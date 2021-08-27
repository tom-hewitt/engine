import React from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  RectEntry,
  useSensor,
  useSensors,
  ViewRect,
} from "@dnd-kit/core";
import { useDispatch, useSelector, useStore } from "react-redux";
import { insertExpressionBlock } from "../../reducers/current";
import styled from "styled-components";
import { motion } from "framer-motion";
import {
  Active,
  dragBlockOver,
  endDrag,
  startBlockDrag,
  startExpressionBlockDrag,
} from "../../reducers/temp";
import { State } from "../../reducers/reducer";
import {
  BlocksContainerId,
  reorderBlock,
} from "../../reducers/blocksContainers";
import { BlockNode } from "../Block/Block";
import { ExpressionBlockOverlay } from "../ExpressionBlock/ExpressionBlock";

const Container = styled(motion.div)`
  display: inline-flex;
  flex-direction: column;
`;

export const DragOverlayContext = React.createContext(false);

function ActiveOverlay(props: { active: Active }) {
  if (props.active) {
    switch (props.active.draggableType) {
      case "Block": {
        return <BlockNode id={props.active.id} />;
      }
      case "Expression Block": {
        return <ExpressionBlockOverlay id={props.active.id} />;
      }
    }
  }

  return null;
}

class Sensor extends PointerSensor {
  static activators = [
    {
      eventName: "onPointerDown" as const,
      handler: (event: React.PointerEvent) => {
        // If it is an input, don't let anything get dragged, because the user may want to select text in the input field
        if (event.currentTarget.getAttribute("class") === "input") {
          event.stopPropagation();
          return false;
        }

        return true;
      },
    },
  ];
}

interface Point {
  x: number;
  y: number;
}

const euclidianDistance = (a: Point, b: Point) => {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
};

const draggableCenter = (rect: {
  top: number;
  left: number;
  height: number;
  width: number;
}) => {
  return { x: rect.left + rect.width * 0.5, y: rect.top + rect.height * 0.5 };
};

const droppableCenter = (rect: {
  offsetTop: number;
  offsetLeft: number;
  height: number;
  width: number;
}) => {
  return {
    x: rect.offsetLeft + rect.width * 0.5,
    y: rect.offsetTop + rect.height * 0.5,
  };
};

export default function BlocksDndContext(props: { children: React.ReactNode }) {
  const active = useSelector((state: State) => state.temp.active);

  const store = useStore();
  const dispatch = useDispatch();
  const mouseSensor = useSensor(Sensor, {
    activationConstraint: {
      delay: 150,
      tolerance: 100,
    },
  });

  const sensors = useSensors(mouseSensor);

  const handleDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.draggableType) {
      switch (event.active.data.current.draggableType) {
        case "Block": {
          dispatch(
            startBlockDrag({
              id: event.active.data.current.id,
              container: event.active.data.current.container,
              index: event.active.data.current.index,
            })
          );
          break;
        }
        case "ExpressionBlock": {
          dispatch(
            startExpressionBlockDrag({
              id: event.active.data.current.expressionBlock,
              blockParent: event.active.data.current.blockParent,
            })
          );
        }
      }
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    if (event.active.data.current?.draggableType) {
      switch (event.active.data.current.draggableType) {
        case "Block": {
          const container: BlocksContainerId | undefined =
            event.over?.data.current?.container;
          const index: number | undefined = event.over?.data.current?.index;
          if (container && index !== undefined)
            dispatch(dragBlockOver({ container, newIndex: index }));
          break;
        }
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const state = store.getState() as State;

    if (state.temp.active) {
      switch (state.temp.active.draggableType) {
        case "Block": {
          if (state.temp.active.newIndex !== state.temp.active.oldIndex) {
            dispatch(
              reorderBlock(
                state.temp.active.container,
                state.temp.active.oldIndex,
                state.temp.active.newIndex
              )
            );
          }
        }
      }
    }

    if (event.over) {
      if (event.over.data.current?.droppableType) {
        switch (event.over.data.current.droppableType) {
          case "Expression": {
            if (event.active.data.current?.draggableType) {
              switch (event.active.data.current.draggableType) {
                case "ExpressionBlock": {
                  dispatch(
                    insertExpressionBlock({
                      expressionId: event.over.data.current.expression,
                      expressionBlockId:
                        event.active.data.current.expressionBlock,
                    })
                  );
                }
              }
            }
            break;
          }
        }
      }
    }

    dispatch(endDrag());
  };

  const collisions = (droppables: RectEntry[], draggable: ViewRect) => {
    const state = store.getState() as State;
    const active = state.temp.active;

    if (active) {
      let min: { id: string; score: number } | undefined = undefined;

      for (const [id, rect] of droppables) {
        let score: number | undefined = undefined;
        switch (active.draggableType) {
          case "Block": {
            if (
              state.current.blocks[id] ||
              state.current.blocksContainers[id]
            ) {
              score = euclidianDistance(
                droppableCenter(rect),
                draggableCenter(draggable)
              );
            }
            break;
          }
          case "Expression Block": {
            if (state.current.expressions[id]) {
              score = euclidianDistance(
                droppableCenter(rect),
                draggableCenter(draggable)
              );
            }
            break;
          }
        }
        if (score) {
          if (!min || (min && score < min.score)) {
            min = { id, score };
          }
        }
      }

      if (min) return min.id;
    }

    return "";
  };

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      sensors={sensors}
      collisionDetection={collisions}
    >
      <Container>{props.children}</Container>
      <DragOverlay style={{ cursor: "grabbing" }}>
        {active ? (
          <DragOverlayContext.Provider value={true}>
            <ActiveOverlay active={active} />
          </DragOverlayContext.Provider>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
