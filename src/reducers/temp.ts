import { createAction, createReducer } from "@reduxjs/toolkit";
import { BlockId } from "./blocks";

export interface ActiveBlock {
    draggableType: "Block",
    id: BlockId,
    parent: BlockId
}

export interface ActiveExpressionBlock {
    draggableType: "Expression Block",
    blockParent?: BlockId
}

export interface TempState {
    active?: ActiveBlock | ActiveExpressionBlock
}

export const initialTempState: TempState = {

};

export const endDrag = createAction("temp/END_DRAG");

export const startBlockDrag = createAction<{ id: BlockId, parent: BlockId }>("temp/START_BLOCK_DRAG");

export const dragBlockOver = createAction<{ newParent: BlockId }>("temp/DRAG_BLOCK_OVER");

export const startExpressionBlockDrag = createAction<{ blockParent?: BlockId }>("temp/START_EXPRESSION_BLOCK_DRAG");

const temp = createReducer(initialTempState, (builder) => {
    builder
        .addCase(endDrag, (state) => {
            state.active = undefined;
        })
        .addCase(startBlockDrag, (state, { payload: { id, parent }}) => {
            state.active = {
                draggableType: "Block",
                id,
                parent
            };
        })
        .addCase(dragBlockOver, (state, { payload: { newParent } }) => {
            if (state.active?.draggableType === "Block") {
                state.active.parent = newParent;
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