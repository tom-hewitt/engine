import { createAction, createReducer } from "@reduxjs/toolkit";
import { ExpressionBlockId } from "./expressionBlocks";

export type ExpressionId = string;

export interface ExpressionsState {
    [key: string]: Expression
};

export type Expression = Literal | DynamicExpression;

export interface DynamicExpression {
    type: Type,
    expressionBlock: ExpressionBlockId,
    expressionType: "Block"
};

export const expressionsInitialState: ExpressionsState = {};

export const setExpression = createAction("expressions/SET_EXPRESSION", (id: ExpressionId, expression: Expression) => {
    return {
        payload: {
            id,
            expression,
            reversible: true
        }
    }
});

const expressions = createReducer(expressionsInitialState, (builder) => {
    builder
        .addCase(setExpression, (state, action) => {
            state[action.payload.id] = action.payload.expression;
        })
});

export default expressions;