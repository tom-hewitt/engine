import React from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { useDroppable } from "@dnd-kit/core";
import { BlockId } from "../../reducers/blocks";
import { State } from "../../reducers/reducer";
import Block from "../Block/Block";
import { ActiveBlock } from "../../reducers/temp";
import { BlocksContainerId } from "../../reducers/blocksContainers";
import { ReactElement } from "react";

const Container = styled.div`
    display: inline-flex;
    flex-direction: column;

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

const ArrowSVG = styled.svg`
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

function ArrowDroppable(props: { id: BlockId | BlocksContainerId, container: BlocksContainerId, index: number, disabled?: boolean }) {
    const {setNodeRef} = useDroppable({
        id: props.id,
        data: {
            droppableType: "Arrow",
            container: props.container,
            index: props.index,
        },
        disabled: props.disabled
    });

    return (
        <ArrowContainer ref={setNodeRef} layoutId={`arrow-${props.id}`}>
            <ArrowSVG viewBox="0 0 16 41">
                <path d="M8 0.226497L2.2265 6L8 11.7735L13.7735 6L8 0.226497ZM7.29289 40.7071C7.68342 41.0976 8.31658 41.0976 8.70711 40.7071L15.0711 34.3431C15.4616 33.9526 15.4616 33.3195 15.0711 32.9289C14.6805 32.5384 14.0474 32.5384 13.6569 32.9289L8 38.5858L2.34315 32.9289C1.95262 32.5384 1.31946 32.5384 0.928932 32.9289C0.538408 33.3195 0.538408 33.9526 0.928932 34.3431L7.29289 40.7071ZM7 6V40H9V6H7Z" fill="#919191"/>
            </ArrowSVG>
        </ArrowContainer>
    );
}

const Blocks = (container: BlocksContainerId, blocks: BlockId[], activeBlock?: ActiveBlock) => {
    let array: ReactElement[] = [];

    array.push(<ArrowDroppable id={container} container={container} index={0} key={`arrow-${container}`}/>);

    if (activeBlock && (activeBlock.newIndex === 0)) {
        array.push(<Block id={activeBlock.id} index={activeBlock.newIndex} key={`block-${activeBlock.id}`}/>);
        array.push(<ArrowDroppable id={activeBlock.id} container={container} index={1} key={`arrow-active`} disabled/>);
    }

    blocks.forEach((id, index) => {
        if (!activeBlock || (activeBlock.id !== id)) {
            array.push(<Block id={id} index={index} key={`block-${id}`}/>);
            array.push(<ArrowDroppable id={id} container={container} index={index + 1} key={`arrow-${index + 1}`}/>);
        }

        if (activeBlock && (index + 1 === activeBlock.newIndex)) {
            array.push(<Block id={activeBlock.id} index={activeBlock.newIndex} key={`block-${activeBlock.id}`}/>);
            array.push(<ArrowDroppable id={activeBlock.id} container={container} index={index + 1} key={`arrow-active`} disabled/>);
        }
    });

    return array;
}

export const BlocksContainerContext = React.createContext<{ container?: BlocksContainerId }>({});

export default function BlocksContainer(props: { id: BlocksContainerId }) {
    const blocks = useSelector((state: State) => state.current.blocksContainers[props.id].blocks);
    const activeBlock = useSelector((state: State) => state.temp.active?.draggableType === "Block" && state.temp.active?.container === props.id ? state.temp.active : undefined);

    return (
        <Container>
            <BlocksContainerContext.Provider value={{ container: props.id }}>
                <BlocksContainerStart/>
                { Blocks(props.id, blocks, activeBlock) }
            </BlocksContainerContext.Provider>
        </Container>
    )
}