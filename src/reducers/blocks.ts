import { createReducer } from "@reduxjs/toolkit";
import { ExpressionId } from "./expressions";
import { FunctionId } from "./functions";

export interface BlocksState {
    [key: string]: BlockNode
};

export type BlockId = string;

export interface BlockNode {
    parentType: "Blocks Container" | "Expression Block",
    parent: string,
    block: Block
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

export type ReturnableBuiltInFunctionBlock = NormaliseBuiltInFunctionBlock | ModulusBuiltInFunctionBlock;

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

export interface ModulusBuiltInFunctionBlock extends BaseBuiltInFunctionBlock {
    name: "Modulus",
    arguments: {
        byId: {
            "a": ExpressionId
        },
        order: ["a"]
    },
    type: "Float"
}

export const blocksInitialState: BlocksState = {};

const blocks = createReducer(blocksInitialState, (builder) => {

});

export default blocks;