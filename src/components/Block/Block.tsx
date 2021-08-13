import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useDraggable } from "@dnd-kit/core";
import { Block, BlockId, BuiltInFunctionBlock, FunctionBlock, SetVariableBlock } from "../../reducers/blocks";
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

const Placeholder = styled(motion.div)`
    display: inline-block;
    padding: 0;

    border-radius: 5px;
`;

const DraggableContainer = styled(motion.div)`
    display: flex;
    flex-direction: column;

    cursor: grab;

    outline: none;
`;

const OuterBlock = styled(motion.div)<{ color?: string }>`
    display: flex;
    flex-direction: column;

    padding: 15px;
    
    box-sizing: border-box;
    border-radius: 5px;

    ${props => props.color ? "border: 1px solid #FFA215;": ""};

    background-color: ${colors.Block};

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

export const BlockContext = React.createContext<{ id?: BlockId }>({
    
});

function SetVariableBlockView(props: { block: SetVariableBlock }) {
    return (
        <OuterBlock>
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

export function FunctionBlockView(props: { block: FunctionBlock | BuiltInFunctionBlock, expressionBlock?: boolean }) {
    const color = props.block.type ? typeColors[props.block.type] : colors.Primary;

    return (
        <OuterBlock color={props.expressionBlock ? color : undefined}>
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
                    key={name}
                />
            )}
        </OuterBlock>
    )
}

function BlockView(props: { block: Block }) {
    switch (props.block.opcode) {
        case "Set Variable": {
            return <SetVariableBlockView block={props.block}/>
        }
        case "Function": {
            return <FunctionBlockView block={props.block}/>
        }
        case "Built In Function": {
            return <FunctionBlockView block={props.block}/>
        }
    }
};

export function BlockNode(props: { id: BlockId }) {
    const block = useSelector((state: State) => state.current.blocks[props.id].block);

    if (!block) {
        throw new Error(`Block with id: "${props.id}" does not exist`)
    };

    return (
        <BlockContext.Provider value={{ id: props.id }}>
            <BlockView block={block}/>
        </BlockContext.Provider>
    );
}

export default function DraggableBlock(props: { id: BlockId, index?: number }) {
    const { container } = useContext(BlocksContainerContext);

    const {attributes, listeners, setNodeRef, isDragging} = useDraggable({
        id: `block-${props.id}`,
        data: {
            draggableType: "Block",
            id: props.id,
            index: props.index,
            container
        }
    });

    return (
        <Placeholder
            layoutId={`block-placeholder-${props.id}`}
            animate={{
                border: isDragging ? `1px solid ${colors.Primary}` : `1px solid ${hexToRGB(colors.Primary, "0")}`
            }}
        >
            <DraggableContainer
                ref={setNodeRef}
                layoutId={`block-${props.id}`}
                animate={{
                    opacity: isDragging ? 0 : 1
                }}
                transition={{
                    opacity: { duration: 0 }
                }}
                {...listeners}
                {...attributes}
            >
                <BlockNode id={props.id}/>
            </DraggableContainer>
        </Placeholder>
    )
}