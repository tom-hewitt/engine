import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useDraggable } from "@dnd-kit/core";
import { BlockId, BuiltInFunctionBlock, FunctionBlock, SetVariableBlock } from "../../reducers/blocks";
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

const Placeholder = styled(motion.div)`
    display: inline-block;
    padding: 0;

    border-radius: 5px;
`;

const Container = styled(motion.div)<{ color?: string }>`
    display: flex;
    flex-direction: column;

    padding: 15px;
    
    box-sizing: border-box;
    border-radius: 5px;

    ${props => props.color ? "border: 1px solid #FFA215;": ""};

    user-select: none;

    outline: none;
`;

const HorizontalContainer = styled.div`
    display: inline-flex;
    flex-direction: row;
    align-items: center;
`;

const VerticalContainer = styled.div`
    display: inline-flex;
    flex-direction: column;
`;

const Opcode = styled.span<{ color: string }>`
    margin: 0px 0px 10px 0px;

    font-family: IBM Plex Mono;
    font-weight: 600;
    font-size: 10px;

    color: ${props => props.color};
`;

const Text = styled.span`
    margin: 10px;

    font-family: IBM Plex Mono;
    font-weight: 600;
    font-size: 10px;

    color: ${colors.Primary};
`;

const Title = styled.span`
    font-family: IBM Plex Mono;
    font-weight: 700;
    font-size: 12px;

    color: ${colors.Primary};
`;

const ParametersText = styled.span`
    margin-top: 10px;

    font-family: IBM Plex Mono;
    font-weight: 700;
    font-size: 10px;

    color: ${colors.Secondary};
`;

const ParameterName = styled.span`
    font-family: IBM Plex Mono;
    font-weight: 700;
    font-size: 10px;

    color: ${colors.Primary};
`;

export const BlockContext = React.createContext({
    id: ""
})

function OuterBlock(props: { parent: BlockId, children: React.ReactNode }) {
    const { id } = useContext(BlockContext);

    const isChildDragging = useSelector((state: State) => state.temp.draggingExpressionBlock?.blockParent === id);

    const {attributes, listeners, setNodeRef, transform, isDragging} = useDraggable({
        id: `block-${id}`,
        data: {
            draggableType: "Block",
            id: id,
            parent: props.parent
        }
    });

    return (
        <Placeholder
            ref={setNodeRef}
            animate={{
                backgroundColor: isDragging ? "rgba(40, 40, 40, 1)" : "rgba(40, 40, 40, 0)",
                zIndex: isDragging || isChildDragging ? 1 : 0
            }}
            transition={{
                zIndex: { delay: isDragging || isChildDragging ? 0 : 0.25 }
            }}
        >
            <Container
                ref={setNodeRef}
                layoutId={`block-${id}`}
                animate={{
                    x: transform ? transform.x : 0,
                    y: transform ? transform.y : 0,
                    cursor: isDragging ? "grabbing" : "grab",
                    scale: isDragging ? 1.03 : 1,
                    boxShadow: isDragging
                    ? "0px 15px 15px 0 rgba(0, 0, 0, 0.25)"
                    : "0px 0px 0px 0 rgba(0, 0, 0, 0.25)",
                    backgroundColor: isDragging ? hexToRGB("#3A3A3A", "0.9") : "#3A3A3A"
                }}
                transition={{
                    duration: 0.25,
                    x: { duration: isDragging ? 0 : 0.25 },
                    y: { duration: isDragging ? 0 : 0.25 }
                }}
                {...listeners}
                {...attributes}
            >
                {props.children}
            </Container>
        </Placeholder>
    )
};

function SetVariableBlockView(props: { parent: BlockId, block: SetVariableBlock }) {
    return (
        <OuterBlock parent={props.parent}>
            <Opcode color={typeColors[props.block.type]}>SET VARIABLE</Opcode>
            <HorizontalContainer>
                <Expression expression={props.block.variable}/>
                <Text>=</Text>
                <Expression expression={props.block.to}/>
            </HorizontalContainer>
        </OuterBlock>
    );
};

function ArgumentView(props: { name: string, expression: ExpressionId, setIsDragging?: (value: boolean) => void }) {
    const type = useSelector((state: State) => state.current.expressions[props.expression].type);

    return (
        <HorizontalContainer>
            <VerticalContainer>
                <ParameterName>{props.name}</ParameterName>
                <TypeText type={type}/>
            </VerticalContainer>
            <Text>=</Text>
            <Expression expression={props.expression}/>
        </HorizontalContainer>
    )
}

function FunctionBlockView(props: { parent: BlockId, block: FunctionBlock | BuiltInFunctionBlock }) {
    const color = props.block.type ? typeColors[props.block.type] : colors.Primary;

    return (
        <OuterBlock parent={props.parent}>
            <Opcode color={color}>FUNCTION</Opcode>
            <HorizontalContainer>
                <FunctionIcon color={color}/>
                <VerticalContainer>
                    <Title>{props.block.name}</Title>
                    { props.block.type ?
                        <TypeText type={props.block.type}/>
                    : null}
                </VerticalContainer>
            </HorizontalContainer>
            { props.block.arguments.order ?
                <ParametersText>PARAMETERS</ParametersText>
            : null }
            { props.block.arguments.order.map((name) => 
                <ArgumentView
                    name={name}
                    expression={props.block.arguments.byId[name as keyof typeof props.block.arguments.byId]}
                />
            )}
        </OuterBlock>
    )
}

function InnerBlock() {
    const { id } = useContext(BlockContext);
    const { block, parent: _parent} = useSelector((state: State) => state.current.blocks[id]);

    if (!block) {
        throw new Error("Block cannot be undefined")
    };

    // It is a block so must have a parent
    const parent = _parent as BlockId;

    switch (block.opcode) {
        case "Set Variable": {
            return <SetVariableBlockView parent={parent} block={block}/>
        }
        case "Function": {
            return <FunctionBlockView parent={parent} block={block}/>
        }
        case "Built In Function": {
            return <FunctionBlockView parent={parent} block={block}/>
        }
    }
};

export default function BlockView(props: { id: BlockId }) {
    return (
        <BlockContext.Provider value={{ id: props.id }}>
            <InnerBlock/>
        </BlockContext.Provider>
    )
}