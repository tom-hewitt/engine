import { algorithms, BlocksState } from "../../reducers/blocks"

it("reorders a block", () => {
    const initialState: BlocksState = {
        "0": {
            child: "1"
        },
        "1": {
            parent: "0",
            block: {
                opcode: "Set Variable",
                variable: "3",
                to: "4",
                type: "3D Vector"
            },
            child: "2"
        },
        "2": {
            parent: "1",
            block: {
                opcode: "Set Variable",
                variable: "5",
                to: "6",
                type: "Float"
            }
        },
    };

    const state = algorithms.reorderBlock(initialState, "1", "2");

    expect(state).toEqual({
        "0": {
            child: "2"
        },
        "1": {
            parent: "2",
            block: {
                opcode: "Set Variable",
                variable: "3",
                to: "4",
                type: "3D Vector"
            }
        },
        "2": {
            parent: "0",
            block: {
                opcode: "Set Variable",
                variable: "5",
                to: "6",
                type: "Float"
            },
            child: "1"
        },
    });
});

it("undos reordering a block", () => {
    const initialState: BlocksState = {
        "0": {
            child: "1"
        },
        "1": {
            parent: "0",
            block: {
                opcode: "Set Variable",
                variable: "3",
                to: "4",
                type: "3D Vector"
            },
            child: "2"
        },
        "2": {
            parent: "1",
            block: {
                opcode: "Set Variable",
                variable: "5",
                to: "6",
                type: "Float"
            }
        },
    };

    const state = algorithms.reorderBlock(algorithms.reorderBlock(initialState, "1", "2"), "1", "0");

    expect(state).toEqual(initialState);
})