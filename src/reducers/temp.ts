import { createAction, createReducer } from "@reduxjs/toolkit";
import { BlockId } from "./blocks";
import { BlocksContainerId } from "./blocksContainers";

export interface ActiveBlock {
    draggableType: "Block",
    id: BlockId,
    container: BlocksContainerId,
    oldIndex: number,
    newIndex: number
}

export interface ActiveExpressionBlock {
    draggableType: "Expression Block",
    blockParent?: BlockId
}

export interface TempState {
    active?: Active
}

export type Active = ActiveBlock | ActiveExpressionBlock;

export const initialTempState: TempState = {

};

export const endDrag = createAction("temp/END_DRAG");

export const startBlockDrag = createAction<{ id: BlockId, container: BlocksContainerId, index: number }>("temp/START_BLOCK_DRAG");

export const dragBlockOver = createAction<{ container: BlocksContainerId, newIndex: number }>("temp/DRAG_BLOCK_OVER");

export const startExpressionBlockDrag = createAction<{ blockParent?: BlockId }>("temp/START_EXPRESSION_BLOCK_DRAG");

const temp = createReducer(initialTempState, (builder) => {
    builder
        .addCase(endDrag, (state) => {
            state.active = undefined;
        })
        .addCase(startBlockDrag, (state, { payload: { id, container, index }}) => {
            state.active = {
                draggableType: "Block",
                id,
                container,
                oldIndex: index,
                newIndex: index
            };
        })
        .addCase(dragBlockOver, (state, { payload: { container, newIndex } }) => {
            if (state.active?.draggableType === "Block") {
                state.active.newIndex = newIndex;
                state.active.container = container;
            }
        })
        .addCase(startExpressionBlockDrag, (state, { payload: { blockParent }}) => {
            state.active = {
                draggableType: "Expression Block",
                blockParent
            };
        })
});

export default temp;