import { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { ExpressionId, setExpression } from "../../reducers/expressions";
import Literal from "../Literal/Literal";
import { useDispatch, useSelector } from "react-redux";
import { State } from "../../reducers/reducer";
import { useDroppable } from "@dnd-kit/core";
import { DynamicExpression } from "../../reducers/expressions";
import ExpressionBlock, { ParentDragContext } from "../ExpressionBlock/ExpressionBlock";
import colors from "../../styles/colors";
import hexToRGB from "../../utilities/hexToRGB";
const Placeholder = styled(motion.div)`
    display: inline-flex;

    border-radius: 6px;
    background-color: rgba(70, 70, 70, 1);
`;

export interface ExpressionProps {
    expression: ExpressionId
};

function DynamicExpressionView(props: { id: ExpressionId, expression: DynamicExpression, isParentDragging?: boolean }) {
    const expressionBlock = useSelector((store: State) => store.current.expressionBlocks[props.expression.expressionBlock]);

    return <ExpressionBlock id={props.expression.expressionBlock} expressionBlock={expressionBlock}/>;
};

export default function ExpressionView(props: { expression: ExpressionId, isParentDragging?: boolean }) {
    const expression = useSelector((state: State) => state.current.expressions[props.expression]);
    const dispatch = useDispatch();

    const isParentDragging = useContext(ParentDragContext);

    const {setNodeRef, isOver, active} = useDroppable({
        id: props.expression,
        data: {
            droppableType: "Expression",
            expression: props.expression
        },
        disabled: isParentDragging
    });

    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        setIsHovered(isOver && active?.data.current?.draggableType === "ExpressionBlock");
    }, [isOver, active]);

    return (
        <Placeholder
            ref={setNodeRef}
            animate={{
                border: isHovered ? `1px solid ${colors.Primary}` : `1px solid ${hexToRGB(colors.Primary, "0")}`
            }}
        >
            { expression.expressionType === "Block" ?
                <DynamicExpressionView id={props.expression} expression={expression} isParentDragging={props.isParentDragging}/>
            :
                <Literal {...expression} onSubmit={(literal: Literal) => dispatch(setExpression(props.expression, literal))}/>
            }
        </Placeholder>
    );
};