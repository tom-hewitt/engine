import React from "react";
import { DndContext, DragEndEvent, DragStartEvent, LayoutRect, PointerSensor, RectEntry, useSensor, useSensors, ViewRect } from "@dnd-kit/core";
import { useDispatch } from "react-redux";
import { insertExpressionBlock } from "../../reducers/current";
import styled from "styled-components";
import { motion } from "framer-motion";
import { endBlockDrag, endExpressionBlockDrag, startBlockDrag, startExpressionBlockDrag } from "../../reducers/temp";

const Container = styled(motion.div)`
    display: inline-flex;
    flex-direction: column;
`;

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
    x: number,
    y: number
}

const euclidianDistance = (a: Point, b: Point) => {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}

const rectCenter = (rect: LayoutRect | ViewRect) => {
    return { x: rect.offsetLeft + (rect.width * 0.5), y: rect.offsetTop + (rect.height * 0.5)};
}

const collisions = (droppables: RectEntry[], draggable: ViewRect) => {
    let min: { id: string, score: number } | undefined = undefined;

    for (const [id, rect] of droppables) {
        const score = euclidianDistance(rectCenter(rect), rectCenter(draggable));
        if (!min || score < min.score) {
            min = { id, score };
        }
    }
    return min ? min.id : "";
}

export default function BlocksDndContext(props: { children: React.ReactNode }) {
    const dispatch = useDispatch();
    const mouseSensor = useSensor(Sensor);

    const sensors = useSensors(mouseSensor);

    const handleDragStart = (event: DragStartEvent) => {
        if (event.active.data.current?.draggableType) {
            switch (event.active.data.current.draggableType) {
                case "Block": {
                    dispatch(startBlockDrag({ id: event.active.data.current.id, parent: event.active.data.current.parent }));
                    break;
                }
                case "ExpressionBlock": {
                    dispatch(startExpressionBlockDrag({ blockParent: event.active.data.current.blockParent }));
                }
            }
        }
    }

    const handleDragEnd = (event: DragEndEvent) => {
        if (event.active.data.current?.draggableType) {
            switch (event.active.data.current.draggableType) {
                case "Block": {
                    dispatch(endBlockDrag());
                    break;
                }
                case "ExpressionBlock": {
                    dispatch(endExpressionBlockDrag())
                }
            }
        };

        if (event.over) {
            if (event.over.data.current?.droppableType) {
                switch (event.over.data.current.droppableType) {
                    case "Expression": {
                        if (event.active.data.current?.draggableType) {
                            switch (event.active.data.current.draggableType) {
                                case "ExpressionBlock": {
                                    dispatch(insertExpressionBlock({ expressionId: event.over.data.current.expression, expressionBlockId: event.active.data.current.expressionBlock }));
                                }
                            }
                        }
                    }
                }
            }
        }
    };

    return (
        <DndContext
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            sensors={sensors}
            collisionDetection={collisions}
        >
            <Container
                layout
            >
                {props.children}
            </Container>
        </DndContext>
    )
}