import { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { ExpressionId, setExpression } from "../../reducers/expressions";
import Literal from "../Literal/Literal";
import { useDispatch, useSelector } from "react-redux";
import { State } from "../../reducers/reducer";
import { useDroppable } from "@dnd-kit/core";
import { DynamicExpression } from "../../reducers/expressions";
import ExpressionBlock from "../ExpressionBlock/ExpressionBlock";
import colors from "../../styles/colors";
import hexToRGB from "../../utilities/hexToRGB";
import { useEffect } from "react";
import { useContext } from "react";
import { BlockDragContext } from "../Block/Block";

const Placeholder = styled(motion.div)`
    display: inline-flex;

    border-radius: 6px;
`;

export interface ExpressionProps {
    expression: ExpressionId
};

function DynamicExpressionView(props: { id: ExpressionId, expression: DynamicExpression, setIsDragging: (value: boolean) => void}) {
    const expressionBlock = useSelector((store: State) => store.current.expressionBlocks[props.expression.expressionBlock]);

    return <ExpressionBlock id={props.expression.expressionBlock} expressionBlock={expressionBlock}setIsDragging={props.setIsDragging}/>;
};

export default function ExpressionView(props: { expression: ExpressionId, setIsDragging?: (value: boolean) => void }) {
    const { setIsChildDragging } = useContext(BlockDragContext);
    const [isDragging, _setIsDragging] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const expression = useSelector((state: State) => state.current.expressions[props.expression]);
    const dispatch = useDispatch();

    const setIsDragging = (value: boolean) => {
        _setIsDragging(value);
        setIsChildDragging(value);
    }

    const {setNodeRef, isOver, active} = useDroppable({
        id: props.expression,
        data: {
            droppableType: "Expression",
            expression: props.expression
        }
    });

    useEffect(() => {
        setIsHovered(isOver && active?.data.current?.draggableType === "ExpressionBlock");
    }, [isOver, active]);

    return (
        <Placeholder
            ref={setNodeRef}
            animate={{
                backgroundColor: isDragging ? "rgba(70, 70, 70, 1)" : "rgba(70, 70, 70, 0)",
                border: isHovered ? `1px solid ${colors.Primary}` : `1px solid ${hexToRGB(colors.Primary, "0")}`
            }}
        >
            { expression.expressionType === "Block" ?
                <DynamicExpressionView id={props.expression} expression={expression} setIsDragging={setIsDragging}/>
            :
                <Literal {...expression} onSubmit={(literal: Literal) => dispatch(setExpression(props.expression, literal))}/>
            }
        </Placeholder>
    );
};