import { CurrentState, algorithms } from "../../reducers/current";

it("inserts an expression block", () => {
    const initialState: CurrentState = {
        blocks: {},
        functions: {},
        expressions: {
            "0": {
                type: "String",
                value: "Hello"
            },
            "1": {
                expressionType: "Block",
                type: "String",
                expressionBlock: "2"
            }
        },
        expressionBlocks: {
            "2": {
                expressionBlockType: "Variable",
                type: "String",
                variable: {
                    variable: "Name",
                    type: "String"
                },
                parent: "1"
            }
        }
    }

    const state = algorithms.insertExpressionBlock(initialState, "0", "2", "1");

    expect(state.expressions["0"]).toEqual({
        expressionType: "Block",
        type: "String",
        expressionBlock: "2"
    });
});

it("undos an expression block insertion", () => {
    const initialState: CurrentState = {
        blocks: {},
        functions: {},
        expressions: {
            "0": {
                type: "String",
                value: "Hello"
            },
            "1": {
                expressionType: "Block",
                type: "String",
                expressionBlock: "2"
            }
        },
        expressionBlocks: {
            "2": {
                expressionBlockType: "Variable",
                type: "String",
                variable: {
                    variable: "Name",
                    type: "String"
                },
                parent: "1"
            }
        }
    };

    const state = algorithms.undoInsertExpressionBlock(initialState, "0", "2", "1", {
        type: "String",
        value: "Hello"
    });

    expect(state).toEqual(initialState);
});