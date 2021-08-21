import { createContext, useContext } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { useDroppable } from "@dnd-kit/core";
import { BlockId } from "../../reducers/blocks";
import { State } from "../../reducers/reducer";
import Block, { FunctionBlockView } from "../Block/Block";
import { BlocksContainerId } from "../../reducers/blocksContainers";
import { ExpressionBlockId } from "../../reducers/expressionBlocks";

const Container = styled(motion.div)`
    display: inline-flex;
    flex-direction: column;

    height: 100%;

    padding: 30px;

    background: #1E1E1E;
    border-radius: 20px;
`;

const CenterContainer = styled(motion.div)`
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

const ArrowHeadSVG = styled.svg`
    fill: #919191;
    width: 16px;
    height: 35px;
`;

const StartContainer = styled(motion.div)`
    display: inline-flex;
    padding: 15px 50px;

    border: 2px solid #919191;
    box-sizing: border-box;
    border-radius: 30px;

    font-family: IBM Plex Mono;
    font-weight: 600;
    font-size: 10px;

    color: #919191;

    user-select: none;
`;

const StartText = styled.span`
    font-family: IBM Plex Mono;
    font-weight: 600;
    font-size: 10px;

    color: #919191;
`;

function Arrow() {
    return (
        <ArrowFixedContainer>
            <ArrowSVG viewBox="0 0 16 41">
                <path d="M8 0.226497L2.2265 6L8 11.7735L13.7735 6L8 0.226497ZM7.29289 40.7071C7.68342 41.0976 8.31658 41.0976 8.70711 40.7071L15.0711 34.3431C15.4616 33.9526 15.4616 33.3195 15.0711 32.9289C14.6805 32.5384 14.0474 32.5384 13.6569 32.9289L8 38.5858L2.34315 32.9289C1.95262 32.5384 1.31946 32.5384 0.928932 32.9289C0.538408 33.3195 0.538408 33.9526 0.928932 34.3431L7.29289 40.7071ZM7 6V40H9V6H7Z" fill="#919191"/>
            </ArrowSVG>
        </ArrowFixedContainer>
    );
}

function ArrowHead() {
    return (
        <ArrowHeadSVG viewBox="0 0 16 35">
            <path d="M7.29289 34.7071C7.68342 35.0976 8.31658 35.0976 8.70711 34.7071L15.0711 28.3431C15.4616 27.9526 15.4616 27.3195 15.0711 26.9289C14.6805 26.5384 14.0474 26.5384 13.6569 26.9289L8 32.5858L2.34315 26.9289C1.95262 26.5384 1.31946 26.5384 0.928932 26.9289C0.538408 27.3195 0.538408 27.9526 0.928932 28.3431L7.29289 34.7071ZM7 0V34H9V0H7Z" fill="#919191"/>
        </ArrowHeadSVG>
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
        <CenterContainer ref={setNodeRef}>
            <Arrow/>
        </CenterContainer>
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
            <CenterContainer ref={setNodeRef} layoutId={`arrow-${props.id}`}>
                <Arrow/>
            </CenterContainer>
        </>
    );
};

function ActiveBlockAndArrow(props: { container: BlocksContainerId, id: BlockId }) {
    return (
        <>
            <Block id={props.id}/>
            <CenterContainer layoutId={`arrow-${props.id}`}>
                <Arrow/>
            </CenterContainer>
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

export const BlocksContainerContext = createContext<{ container?: BlocksContainerId }>({});

function ContainerBlock(props: { id: BlockId, index: number }) {
    const activeBlock = useSelector((state: State) => state.temp.active?.draggableType === "Block" && state.temp.active?.newIndex === props.index ? state.temp.active : undefined);
    const isActive = useSelector((state: State) => state.temp.active?.draggableType === "Block" && state.temp.active?.id === props.id);
    const { container } = useContext(BlocksContainerContext);
    if (!container) throw new Error(`Container for container block ${props.id} is undefined`);
    const expandedExpressionBlocks = useSelector((state: State) => state.temp.expandedExpressionBlocks[props.id]);

    return (
        <>
            { activeBlock ?
                <ActiveBlockAndArrow id={activeBlock.id} container={container} key={activeBlock.id}/>
            : null }
            { expandedExpressionBlocks ?
                expandedExpressionBlocks.map((expressionBlock) =>
                    <ExpandedFunctionBlock expressionBlock={expressionBlock} key={expressionBlock}/>
                )
            : null }
            { !isActive ?
                <BlockAndArrow id={props.id} container={container} index={props.index} key={props.id}/>
            : null }
        </>
    );
}

function Start(props: { container: BlocksContainerId }) {
    const {setNodeRef} = useDroppable({
        id: props.container,
        data: {
            droppableType: "Block",
            container: props.container,
            index: 0
        }
    });

    return (
        <>
            <CenterContainer>
                <StartContainer>
                    START
                </StartContainer>
            </CenterContainer>
            <CenterContainer ref={setNodeRef}>
                <ArrowHead/>
            </CenterContainer>
        </>
    )
}

export default function BlocksContainer(props: { id: BlocksContainerId }) {
    const blocks = useSelector((state: State) => state.current.blocksContainers[props.id].blocks);
    const activeBlock = useSelector((state: State) => state.temp.active?.draggableType === "Block" && state.temp.active?.newIndex === blocks.length ? state.temp.active : undefined);

    return (
        <Container>
            <BlocksContainerContext.Provider value={{ container: props.id }}>
                <Start container={props.id}/>
                { blocks.map((id, index) => 
                    <ContainerBlock id={id} index={index} key={id}/>
                ) }
                { activeBlock ?
                    <ActiveBlockAndArrow id={activeBlock.id} container={props.id} key={activeBlock.id}/>
                : null }
            </BlocksContainerContext.Provider>
        </Container>
    );
}