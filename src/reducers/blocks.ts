import { createAction, createReducer, nanoid } from "@reduxjs/toolkit";
import { addNode, deleteNode, reorderNode } from "../algorithms/nodes";
import { ExpressionId } from "./expressions";
import { FunctionId } from "./functions";

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

export const reorderBlock = createAction("blocks/REORDER_BLOCK", (id: string, newParent: string) => {
    return {
        payload: {
            name: "Reorder Block",
            id,
            newParent,
            undo: true
        }
    };
});

const blocks = createReducer(blocksInitialState, (builder) => {
    builder
        .addCase(addBlock, (state, { payload: { id, block, parent, undo }}) => {
            if (undo) {
                deleteNode(state, id);
            } else {
                addNode(state, { block: block }, id, parent);
            }
        })
        .addCase(reorderBlock, (state, { payload: { id, newParent, undo }}) => {
            if (undo) {

            } else {
                // Make sure it isn't a container
                if (state[id].parent) {
                    reorderNode(state, id, newParent);
                } else {
                    throw new Error("Containers can't be reordered");
                }
            }
        })
});

export default blocks;