import { createAsyncThunk, createReducer } from "@reduxjs/toolkit";
import defaultValues from "../defaultValues/defaultValues";
import blocks, { blocksInitialState, BlocksState } from "./blocks";
import blocksContainers, {
  blocksContainersInitialState,
  BlocksContainersState,
} from "./blocksContainers";
import {
  ExpressionBlockId,
  expressionBlocksInitialState,
  ExpressionBlocksState,
} from "./expressionBlocks";
import expressions, {
  Expression,
  ExpressionId,
  expressionsInitialState,
  ExpressionsState,
} from "./expressions";
import functions, { functionsInitialState, FunctionsState } from "./functions";
import { State } from "./reducer";
import scenes, { scenesInitialState, ScenesState } from "./scenes";

export interface CurrentState {
  scenes: ScenesState;
  blocksContainers: BlocksContainersState;
  blocks: BlocksState;
  expressions: ExpressionsState;
  expressionBlocks: ExpressionBlocksState;
  functions: FunctionsState;
}

export const initialCurrentState: CurrentState = {
  scenes: scenesInitialState,
  blocksContainers: blocksContainersInitialState,
  blocks: blocksInitialState,
  expressions: expressionsInitialState,
  expressionBlocks: expressionBlocksInitialState,
  functions: functionsInitialState,
};

export const insertExpressionBlock = createAsyncThunk(
  "INSERT_EXPRESSION_BLOCK",
  (
    {
      expressionId,
      expressionBlockId,
    }: { expressionId: ExpressionId; expressionBlockId: ExpressionBlockId },
    { getState }
  ) => {
    const state = getState() as State;

    return {
      undo: false,
      expressionId,
      expressionBlockId,
      replacedExpression: state.current.expressions[expressionId],
      parent: state.current.expressionBlocks[expressionBlockId].parent,
    };
  }
);

export const algorithms = {
  insertExpressionBlock: (
    state: CurrentState,
    expressionId: ExpressionId,
    expressionBlockId: ExpressionBlockId,
    parent: ExpressionId
  ) => {
    // If the block hasn't just been dragged back to the same place
    if (parent !== expressionId) {
      const type = state.expressions[expressionId].type;

      // If the type of the block matches the type of the expression
      if (state.expressionBlocks[expressionBlockId].type === type) {
        // Set the expression to point to the block
        state.expressions[expressionId] = {
          expressionType: "Block",
          type,
          expressionBlock: expressionBlockId,
        };

        const expressionBlock = state.expressionBlocks[expressionBlockId];

        // If possible, replace the expression block in it's original position with the default value for that type
        if (expressionBlock.type in defaultValues) {
          state.expressions[parent] =
            defaultValues[expressionBlock.type as ValueType];
          state.expressionBlocks[expressionBlockId].parent = expressionId;
        }
      } else {
        //TODO: Try convert types?
      }
    }

    return state;
  },
  undoInsertExpressionBlock: (
    state: CurrentState,
    expressionId: ExpressionId,
    expressionBlockId: ExpressionBlockId,
    parent: ExpressionId,
    replacedExpression: Expression
  ) => {
    const expression = state.expressions[expressionId];

    // If the block has actually been inserted
    if (
      expression.expressionType === "Block" &&
      expression.expressionBlock === expressionBlockId
    ) {
      // Put the replaced expression back
      state.expressions[expressionId] = replacedExpression;

      const expressionBlock = state.expressionBlocks[expressionBlockId];

      // If the expression block was replaced by the default value in it's original position
      if (expressionBlock.type in defaultValues) {
        // Put the expression block back into it's original position
        state.expressions[parent] = {
          expressionType: "Block",
          type: expressionBlock.type,
          expressionBlock: expressionBlockId,
        };

        // Set the parent back to the original parent
        state.expressionBlocks[expressionBlockId].parent = parent;
      }
    }

    return state;
  },
};

export const current = createReducer(initialCurrentState, (builder) => {
  builder
    .addCase(
      insertExpressionBlock.fulfilled,
      (
        state,
        {
          payload: {
            undo,
            expressionId,
            expressionBlockId,
            replacedExpression,
            parent,
          },
        }
      ) => {
        if (undo) {
          algorithms.undoInsertExpressionBlock(
            state,
            expressionId,
            expressionBlockId,
            parent,
            replacedExpression
          );
        } else {
          algorithms.insertExpressionBlock(
            state,
            expressionId,
            expressionBlockId,
            parent
          );
        }
      }
    )
    .addDefaultCase((state, action) => {
      state.scenes = scenes(state.scenes, action);
      state.blocksContainers = blocksContainers(state.blocksContainers, action);
      state.blocks = blocks(state.blocks, action);
      state.functions = functions(state.functions, action);
      state.expressions = expressions(state.expressions, action);
    });
});

export default current;
