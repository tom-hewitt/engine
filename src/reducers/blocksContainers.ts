import { createAction, createReducer } from "@reduxjs/toolkit";
import { BlockId } from "./blocks";

export type BlocksContainerId = string;

export interface BlocksContainersState {
    [key: string]: BlocksContainer
};

export interface BlocksContainer {
    blocks: BlockId[]
};

export const blocksContainersInitialState: BlocksContainersState = {};

export const reorderBlock = createAction(
    "blocksContainers/REORDER_BLOCK",
    (container: BlocksContainerId, oldIndex: number, newIndex: number) => ({
        payload: {
            undo: false,
            container,
            oldIndex,
            newIndex
        }
    })
);

export const algorithms = {
    reorderBlock: (state: BlocksContainersState, container: BlocksContainerId, oldIndex: number, newIndex: number) => {
        state[container].blocks.splice(oldIndex, 0, state[container].blocks.splice(newIndex, 1)[0]);

        return state;
    }
};

const blocksContainers = createReducer(blocksContainersInitialState, (builder) => {
    builder
        .addCase(reorderBlock, (state, { payload: { undo, container, oldIndex, newIndex } }) => {
            if (undo) {
                algorithms.reorderBlock(state, container, newIndex, oldIndex);
            } else {
                algorithms.reorderBlock(state, container, oldIndex, newIndex);
            }
        })
});

export default blocksContainers;