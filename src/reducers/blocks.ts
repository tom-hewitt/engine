import { createAction, createAsyncThunk, createReducer, nanoid } from "@reduxjs/toolkit";
import { ExpressionId } from "./expressions";
import { FunctionId } from "./functions";
import { State } from "./reducer";

export interface BlocksState {
    [key: string]: BlocksNode
};

export type BlockId = string;

export type BlocksNode = BlockNode | BlocksContainer;

export interface BlockNode {
    parent: BlockId,
    child?: BlockId,
    block: Block
};

export interface BlocksContainer {
    parent?: undefined,
    child?: BlockId,
    block?: undefined
};

export type Block = SetVariableBlock | FunctionBlock | BuiltInFunctionBlock;

export interface SetVariableBlock {
    opcode: "Set Variable",
    variable: ExpressionId,
    to: ExpressionId,
    type: ValueType
};

export interface FunctionBlock {
    opcode: "Function",
    function: FunctionId,
    name: string,
    arguments: {
        byId: {
            [key: string]: ExpressionId
        }
        order: string[]
    },
    type?: Type
};

export interface ReturnableFunctionBlock extends FunctionBlock {
    type: Type
}

export type BuiltInFunctionBlock = ReturnableBuiltInFunctionBlock;

export type ReturnableBuiltInFunctionBlock = NormaliseBuiltInFunctionBlock;

interface BaseBuiltInFunctionBlock {
    opcode: "Built In Function",
    arguments: {
        byId: {
            [key: string]: ExpressionId
        }
        order: string[]
    },
    type?: Type
}

export interface NormaliseBuiltInFunctionBlock extends BaseBuiltInFunctionBlock {
    name: "Normalise",
    arguments: {
        byId: {
            "a": ExpressionId
        },
        order: ["a"]
    },
    type: "3D Vector"
}

export const blocksInitialState: BlocksState = {};

export const addBlock = createAction("blocks/ADD_BLOCk", (block: Block, parent: BlockId, child?: BlockId) => {
    return {
        payload: {
            name: "Add Block",
            id: nanoid(),
            block,
            parent,
            child,
            undo: false
        }
    };
});

export const reorderBlock = createAsyncThunk(
    "blocks/REORDER_BLOCK",
    ({ id, newParent }: { id: BlockId, newParent: BlockId }, { getState, rejectWithValue }) => {
        const state = getState() as State;

        const oldParent = state.current.blocks[id].parent
        if (oldParent) {
            return {
                undo: false,
                id,
                newParent,
                oldParent
            };
        } else {
            return rejectWithValue({});
        }
    }
);

export const algorithms = {
    addBlock: (state: BlocksState, block: Block, id: BlockId, parent: BlockId) => {
        // Add the new block
        state[id] = {
            parent,
            block,
            child: state[parent].child
        };

        // Make the new block the parent's child
        state[parent].child = id;

        const child = state[parent].child;
        // If the new parent had a child
        if (child) {
            // Make the new block the child's parent
            state[child].parent = id;
        }
    
        return state;
    },
    deleteBlock: (state: BlocksState, id: BlockId) => {
        const parent = state[id].parent;
        const child = state[id].child;

        if (child) {
            state[child].parent = parent;

            if (parent) {
                state[parent].child = child;
            } else {
                // The block being deleted is a blocks container, so all the children should also be deleted
                // TODO
            }
        } else {
            if (parent) {
                state[parent].child = undefined;
            }
        }
    
        delete state[id];
    
        return state;
    },
    reorderBlock: (state: BlocksState, id: string, newParent: string) => {
        const newChild = state[newParent].child;
        const oldParent = state[id].parent;
        const oldChild = state[id].child;

        // If the block isn't a container
        if (oldParent) {
            // Link the old parent and the old child
            state[oldParent].child = oldChild;

            if (oldChild) {
                state[oldChild].parent = oldParent;
            }
        
            // Link the block and it's new parent
            state[id].parent = newParent;
            state[newParent].child = id;
        
            // Link the block and it's new child
            state[id].child = newChild;
            if (newChild) {
                state[newChild].parent = id;
            }
        }
    
        return state;
    }
}

const blocks = createReducer(blocksInitialState, (builder) => {
    builder
        .addCase(addBlock, (state, { payload: { undo, id, block, parent }}) => {
            if (undo) {
                algorithms.deleteBlock(state, id);
            } else {
                algorithms.addBlock(state, block, id, parent);
            }
        })
        .addCase(reorderBlock.fulfilled, (state, { payload: { undo, id, newParent, oldParent }}) => {
            if (undo) {
                algorithms.reorderBlock(state, id, oldParent);
            } else {
                algorithms.reorderBlock(state, id, newParent);
            }
        })
});

export default blocks;