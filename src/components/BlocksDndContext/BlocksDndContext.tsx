import React, { useContext } from "react";
import { closestCenter, DndContext, DragEndEvent, MouseSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { ReactReduxContext, useDispatch } from "react-redux";
import { insertExpressionBlock } from "../../reducers/current";
import styled from "styled-components";
import { motion } from "framer-motion";

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

export default function BlocksDndContext(props: { children: React.ReactNode }) {
    const dispatch = useDispatch();
    const mouseSensor = useSensor(Sensor);

    const sensors = useSensors(mouseSensor);

    const { store } = useContext(ReactReduxContext)

    const handleDragEnd = (event: DragEndEvent) => {
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
            onDragEnd={handleDragEnd}
            sensors={sensors}
        >
            <Container
                layout
            >
                {props.children}
            </Container>
        </DndContext>
    )
}