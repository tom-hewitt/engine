import { createReducer } from "@reduxjs/toolkit";
import { BlockId } from "./blocks";
import { ExpressionId } from "./expressions";

export type ExpressionBlockId = string;

export interface ExpressionBlocksState {
    [key: string]: ExpressionBlock
};

export type ExpressionBlock = VariableExpressionBlock | VariableReferenceBlock | FunctionExpressionBlock | OperatorExpressionBlock | Vector3DExpressionBlock;

interface BaseExpressionBlock {
    type: Type,
    parent: ExpressionId
}

export interface VariableExpressionBlock extends BaseExpressionBlock {
    expressionBlockType: "Variable",
    type: ValueType,
    variable: VariableReference
};

export interface VariableReference {
    variable: string,
    type: ValueType,
    member?: VariableReference
};

export interface VariableReferenceBlock extends BaseExpressionBlock {
    expressionBlockType: "Variable Reference",
    type: ReferenceType,
    variable: VariableReference
};

export interface FunctionExpressionBlock extends BaseExpressionBlock {
    expressionBlockType: "Function",
    block: BlockId
};

export type Operation = 
    "+" | "-" | "*" | "/" | "^" |
    "=" | "<" | "<=" | ">" | ">="
;

export interface OperatorExpressionBlock extends BaseExpressionBlock {
    expressionBlockType: "Operator",
    operation: Operation,
    arguments: [ExpressionId, ExpressionId],
    type: ValueType
};

export interface Vector3DExpressionBlock extends BaseExpressionBlock {
    expressionBlockType: "3D Vector",
    type: "3D Vector",
    arguments: [ExpressionId, ExpressionId, ExpressionId]
}

export const expressionBlocksInitialState: ExpressionBlocksState = {};

const expressions = createReducer(expressionBlocksInitialState, (builder) => {

});

export default expressions;