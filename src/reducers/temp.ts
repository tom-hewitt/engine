import { createAction, createReducer } from "@reduxjs/toolkit";
import { BlockId } from "./blocks";

export interface TempState {
    draggingBlock?: {
        id: BlockId,
        parent: BlockId
    },
    draggingExpressionBlock?: {
        blockParent?: BlockId
    }
}

export const initialTempState: TempState = {

};

export const startBlockDrag = createAction<{ id: BlockId, parent: BlockId }>("temp/START_BLOCK_DRAG");

export const dragBlockOver = createAction<{ newParent: BlockId }>("temp/DRAG_BLOCK_OVER");

export const endBlockDrag = createAction("temp/END_BLOCK_DRAG");

export const startExpressionBlockDrag = createAction<{ blockParent?: BlockId }>("temp/START_EXPRESSION_BLOCK_DRAG");

export const endExpressionBlockDrag = createAction("temp/END_EXPRESSION_BLOCK_DRAG");

const temp = createReducer(initialTempState, (builder) => {
    builder
        .addCase(startBlockDrag, (state, { payload: { id, parent }}) => {
            state.draggingBlock = {
                id,
                parent
            };
        })
        .addCase(dragBlockOver, (state, { payload: { newParent } }) => {
            if (state.draggingBlock) {
                state.draggingBlock.parent = newParent;
            }
        })
        .addCase(endBlockDrag, (state) => {
            state.draggingBlock = undefined;
        })
        .addCase(startExpressionBlockDrag, (state, { payload: { blockParent }}) => {
            state.draggingExpressionBlock = {
                blockParent
            };
        })
        .addCase(endExpressionBlockDrag, (state) => {
            state.draggingExpressionBlock = undefined;
        })
});

export default temp;