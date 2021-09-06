import { createContext, useContext } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { useDroppable } from "@dnd-kit/core";
import { BlockId } from "../../../state/reducers/blocks";
import { State } from "../../../state/reducers/reducer";
import Block from "../Block/Block";
import { BlocksContainerId } from "../../../state/reducers/blocksContainers";
import { ExpressionBlockId } from "../../../state/reducers/expressionBlocks";
import { useState } from "react";
import produce from "immer";
import AddBlock from "../AddBlock/AddBlock";

const CenterContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ArrowFixedContainer = styled.div`
  display: fixed;

  height: 44px;
`;

const ArrowSVG = styled.svg<{ button?: boolean }>`
  display: absolute;

  transform: translate(0px, -7px);
  fill: #919191;
  width: 16px;
  height: 51px;
  ${(props) => (props.button ? "cursor: pointer;" : "")}
`;

const ArrowHeadSVG = styled.svg`
  fill: #919191;
  width: 16px;
  height: 35px;
  cursor: pointer;
`;

const StartContainer = styled(motion.div)`
  display: inline-flex;
  padding: 15px 50px;

  border: 2px solid #919191;
  box-sizing: border-box;
  border-radius: 30px;

  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);

  font-family: IBM Plex Mono;
  font-weight: 600;
  font-size: 10px;

  color: #919191;

  user-select: none;
`;

function ArrowIcon(props: { onClick?: () => void }) {
  return (
    <ArrowFixedContainer onClick={props.onClick}>
      <ArrowSVG viewBox="0 0 16 51" button={props.onClick !== undefined}>
        <path
          d="M8 0.226497L2.2265 6L8 11.7735L13.7735 6L8 0.226497ZM7.29289 50.7071C7.68342 51.0976 8.31658 51.0976 8.70711 50.7071L15.0711 44.3431C15.4616 43.9526 15.4616 43.3195 15.0711 42.9289C14.6805 42.5384 14.0474 42.5384 13.6569 42.9289L8 48.5858L2.34315 42.9289C1.95262 42.5384 1.31946 42.5384 0.928932 42.9289C0.538408 43.3195 0.538408 43.9526 0.928932 44.3431L7.29289 50.7071ZM7 6V50H9V6H7Z"
          fill="#919191"
        />
      </ArrowSVG>
    </ArrowFixedContainer>
  );
}

function ArrowHead(props: { onClick?: () => void }) {
  return (
    <ArrowHeadSVG viewBox="0 0 16 35" onClick={props.onClick}>
      <path
        d="M7.29289 34.7071C7.68342 35.0976 8.31658 35.0976 8.70711 34.7071L15.0711 28.3431C15.4616 27.9526 15.4616 27.3195 15.0711 26.9289C14.6805 26.5384 14.0474 26.5384 13.6569 26.9289L8 32.5858L2.34315 26.9289C1.95262 26.5384 1.31946 26.5384 0.928932 26.9289C0.538408 27.3195 0.538408 27.9526 0.928932 28.3431L7.29289 34.7071ZM7 0V34H9V0H7Z"
        fill="#919191"
      />
    </ArrowHeadSVG>
  );
}

function Arrow(props: { index?: number }) {
  const [isAdding, setIsAdding] = useState(false);

  return isAdding ? (
    <>
      <ArrowIcon />
      <AddBlock cancel={() => setIsAdding(false)} />
      <ArrowIcon />
    </>
  ) : (
    <ArrowIcon onClick={() => setIsAdding(true)} />
  );
}

function Start(props: { container: BlocksContainerId }) {
  const { setNodeRef } = useDroppable({
    id: props.container,
    data: {
      droppableType: "Block",
      container: props.container,
      index: 0,
    },
  });

  const [isAdding, setIsAdding] = useState(false);

  return (
    <>
      <CenterContainer>
        <StartContainer>START</StartContainer>
      </CenterContainer>
      <CenterContainer ref={setNodeRef}>
        <ArrowHead onClick={() => setIsAdding(true)} />
        {isAdding ? (
          <>
            <AddBlock cancel={() => setIsAdding(false)} />
            <ArrowIcon />
          </>
        ) : null}
      </CenterContainer>
    </>
  );
}

function BlockAndArrow(props: {
  container: BlocksContainerId;
  id: BlockId;
  index: number;
}) {
  const { setNodeRef } = useDroppable({
    id: props.id,
    data: {
      droppableType: "Block",
      container: props.container,
      index: props.index + 1,
    },
  });

  return (
    <>
      <Block id={props.id} index={props.index} />
      <CenterContainer ref={setNodeRef} layoutId={`arrow-${props.id}`}>
        <Arrow index={props.index} />
      </CenterContainer>
    </>
  );
}

function ActiveBlockAndArrow(props: {
  container: BlocksContainerId;
  id: BlockId;
}) {
  return (
    <>
      <Block id={props.id} />
      <CenterContainer layoutId={`arrow-${props.id}`}>
        <Arrow />
      </CenterContainer>
    </>
  );
}

const useExpandExpressionBlock: () => [
  ExpressionBlockId[],
  (id: ExpressionBlockId) => void
] = () => {
  const [expandedExpressionBlocks, setExpandedExpressionBlocks] = useState<
    ExpressionBlockId[]
  >([]);

  const toggle = (id: ExpressionBlockId) => {
    setExpandedExpressionBlocks((oldState) =>
      produce(oldState, (state) => {
        const index = state.findIndex((value) => value === id);

        // If the id is not in the array add it
        if (index === -1) {
          state.push(id);
        } else {
          state.splice(index, 1);
        }
      })
    );
  };

  return [expandedExpressionBlocks, toggle];
};

function ExpandedFunctionBlock(props: { expressionBlock: ExpressionBlockId }) {
  const expressionBlock = useSelector(
    (state: State) => state.current.expressionBlocks[props.expressionBlock]
  );
  if (expressionBlock.expressionBlockType !== "Function")
    throw new Error(
      "Block passed to expanded function block must be a function"
    );

  const [expandedExpressionBlocks, toggle] = useExpandExpressionBlock();

  return (
    <ExpandExpressionBlockContext.Provider value={{ toggle }}>
      {expandedExpressionBlocks
        ? expandedExpressionBlocks.map((expressionBlock) => (
            <ExpandedFunctionBlock
              expressionBlock={expressionBlock}
              key={expressionBlock}
            />
          ))
        : null}
      <Block id={expressionBlock.block} />
    </ExpandExpressionBlockContext.Provider>
  );
}

export const BlocksContainerContext = createContext<{
  container?: BlocksContainerId;
}>({});

export const ExpandExpressionBlockContext = createContext<{
  toggle?: (id: ExpressionBlockId) => void;
}>({});

function ContainerBlock(props: { id: BlockId; index: number }) {
  const activeBlock = useSelector((state: State) =>
    state.temp.active?.draggableType === "Block" &&
    state.temp.active?.newIndex === props.index
      ? state.temp.active
      : undefined
  );

  const isActive = useSelector(
    (state: State) =>
      state.temp.active?.draggableType === "Block" &&
      state.temp.active?.id === props.id
  );

  const { container } = useContext(BlocksContainerContext);

  const [expandedExpressionBlocks, toggle] = useExpandExpressionBlock();

  if (!container) {
    throw new Error(`Container for container block ${props.id} is undefined`);
  }

  return (
    <ExpandExpressionBlockContext.Provider value={{ toggle }}>
      {activeBlock ? (
        <ActiveBlockAndArrow
          id={activeBlock.id}
          container={container}
          key={activeBlock.id}
        />
      ) : null}
      {expandedExpressionBlocks
        ? expandedExpressionBlocks.map((expressionBlock) => (
            <ExpandedFunctionBlock
              expressionBlock={expressionBlock}
              key={expressionBlock}
            />
          ))
        : null}
      {!isActive ? (
        <BlockAndArrow
          id={props.id}
          container={container}
          index={props.index}
          key={props.id}
        />
      ) : null}
    </ExpandExpressionBlockContext.Provider>
  );
}

export default function BlocksContainer(props: { id: BlocksContainerId }) {
  const blocks = useSelector(
    (state: State) => state.current.blocksContainers[props.id].blocks
  );
  const activeBlock = useSelector((state: State) =>
    state.temp.active?.draggableType === "Block" &&
    state.temp.active?.newIndex === blocks.length
      ? state.temp.active
      : undefined
  );

  return (
    <BlocksContainerContext.Provider value={{ container: props.id }}>
      <Start container={props.id} />
      {blocks.map((id, index) => (
        <ContainerBlock id={id} index={index} key={id} />
      ))}
      {activeBlock ? (
        <ActiveBlockAndArrow
          id={activeBlock.id}
          container={props.id}
          key={activeBlock.id}
        />
      ) : null}
    </BlocksContainerContext.Provider>
  );
}
