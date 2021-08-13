import React from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { useDroppable } from "@dnd-kit/core";
import { BlockId } from "../../reducers/blocks";
import { State } from "../../reducers/reducer";
import Block, { FunctionBlockView } from "../Block/Block";
import { ActiveBlock, ExpandedExpressionBlocks } from "../../reducers/temp";
import { BlocksContainerId } from "../../reducers/blocksContainers";
import { ReactElement } from "react";
import { ExpressionBlockId } from "../../reducers/expressionBlocks";

const Container = styled(motion.div)`
    display: inline-flex;
    flex-direction: column;

    height: 100%;

    padding: 30px;

    background: #1E1E1E;
    border-radius: 20px;
`;

const StartSVG = styled.svg`
    stroke: #3A3A3A;
    height: 40px;
    fill: none;
`;

const ArrowContainer = styled(motion.div)`
    display: flex;
    flex-direction: column;
    align-items: center;

    
`;

const ArrowFixedContainer = styled.div`
    display: fixed;

    height: 34px;
`;

const ArrowSVG = styled.svg`
    display: absolute;

    transform: translate(0px, -7px);
    fill: #919191;
    width: 16px;
    height: 41px;
`;

function BlocksContainerStart() {
    return (
        <StartSVG viewBox="0 0 501 40">
            <path d="M1 1C1 1 1.00337 38.8055 45.0034 38.8096C89.0033 38.8136 410.503 38.781 455.003 38.8014C499.503 38.8218 499.5 1 499.5 1" strokeWidth="2" strokeLinecap="square" strokeLinejoin="round"/>
        </StartSVG>
    )
}

function Arrow() {
    return (
        <ArrowFixedContainer>
            <ArrowSVG viewBox="0 0 16 41">
                <path d="M8 0.226497L2.2265 6L8 11.7735L13.7735 6L8 0.226497ZM7.29289 40.7071C7.68342 41.0976 8.31658 41.0976 8.70711 40.7071L15.0711 34.3431C15.4616 33.9526 15.4616 33.3195 15.0711 32.9289C14.6805 32.5384 14.0474 32.5384 13.6569 32.9289L8 38.5858L2.34315 32.9289C1.95262 32.5384 1.31946 32.5384 0.928932 32.9289C0.538408 33.3195 0.538408 33.9526 0.928932 34.3431L7.29289 40.7071ZM7 6V40H9V6H7Z" fill="#919191"/>
            </ArrowSVG>
        </ArrowFixedContainer>
    )
}

function ArrowDroppable(props: { container: BlocksContainerId, index: number }) {
    const {setNodeRef} = useDroppable({
        id: props.container,
        data: {
            droppableType: "Block",
            container: props.container,
            index: props.index,
        }
    });

    return (
        <ArrowContainer ref={setNodeRef}>
            <Arrow/>
        </ArrowContainer>
    );
}

function BlockAndArrow(props: { container: BlocksContainerId, id: BlockId, index: number }) {
    const {setNodeRef} = useDroppable({
        id: props.id,
        data: {
            droppableType: "Block",
            container: props.container,
            index: props.index + 1
        }
    });

    return (
        <>
            <Block id={props.id} index={props.index}/>
            <ArrowContainer ref={setNodeRef}>
                <Arrow/>
            </ArrowContainer>
        </>
    );
};

function ActiveBlockAndArrow(props: { container: BlocksContainerId, id: BlockId }) {
    return (
        <>
            <Block id={props.id}/>
            <ArrowContainer layoutId={`arrow-${props.id}`}>
                <Arrow/>
            </ArrowContainer>
        </>
    );
};

function ExpandedFunctionBlock(props: { expressionBlock: ExpressionBlockId }) {
    const expressionBlock = useSelector((state: State) => state.current.expressionBlocks[props.expressionBlock]);
    if (expressionBlock.expressionBlockType !== "Function") throw new Error("Block passed to expanded function block must be a function");
    
    const { block } = useSelector((state: State) => state.current.blocks[expressionBlock.block]);
    if (!(block.opcode === "Function" || block.opcode === "Built In Function")) throw new Error("Block passed to expanded function block must be a function");

    return <FunctionBlockView block={block} expressionBlock/>;
}

export const BlocksContainerContext = React.createContext<{ container?: BlocksContainerId }>({});

const Blocks = (container: BlocksContainerId, blocks: BlockId[], expandedExpressionBlocks: ExpandedExpressionBlocks, activeBlock?: ActiveBlock) => {
    let elements: ReactElement[] = [];

    blocks.forEach((id, index) => {
        if (activeBlock && activeBlock.newIndex === index) {
            elements.push(<ActiveBlockAndArrow id={activeBlock.id} container={container} key={activeBlock.id}/>);
        }

        if (expandedExpressionBlocks[id]) {
            expandedExpressionBlocks[id].forEach((expressionBlock) => {
                elements.push(<ExpandedFunctionBlock expressionBlock={expressionBlock} key={expressionBlock}/>)
            })
        }

        if (!activeBlock || activeBlock.id !== id) {
            elements.push(<BlockAndArrow id={id} container={container} index={index} key={id}/>);
        }
    });

    if (activeBlock && activeBlock.newIndex === blocks.length) {
        elements.push(<ActiveBlockAndArrow id={activeBlock.id} container={container} key={activeBlock.id}/>);
    }

    return elements;
}

export default function BlocksContainer(props: { id: BlocksContainerId }) {
    const blocks = useSelector((state: State) => state.current.blocksContainers[props.id].blocks);
    const activeBlock = useSelector((state: State) => state.temp.active?.draggableType === "Block" && state.temp.active?.container === props.id ? state.temp.active : undefined);
    const expandedExpressionBlocks = useSelector((state: State) => state.temp.expandedExpressionBlocks);

    return (
        <Container>
            <BlocksContainerContext.Provider value={{ container: props.id }}>
                <BlocksContainerStart key="start"/>
                <ArrowDroppable container={props.id} index={0} key="arrow-start"/>
                { Blocks(props.id, blocks, expandedExpressionBlocks, activeBlock) }
            </BlocksContainerContext.Provider>
        </Container>
    )
}