import blocks, { addBlock, Block, BlocksState } from "../../reducers/blocks"

it("adds a block to an empty container", () => {
    const initialState: BlocksState = {
        "0": {}
    };

    const block: Block = {
        opcode: "Set Variable",
        variable: "Message",
        to: {
            type: "String",
            value: "Hello"
        }
    };

    const state = blocks(initialState, addBlock(block, "0"));

    const blockId = state["0"].child

    if (blockId) {
        expect(state).toEqual({
            "0": {
                child: blockId
            },
            [blockId]: {
                parent: "0",
                block: block
            }
        });
    } else {
        throw new Error("blockId is undefined");
    }
});

it("adds a block after another block", () => {
    const initialState: BlocksState = {
        "0": {
            child: "1"
        },
        "1": {
            parent: "0",
            block: {
                opcode: "Set Variable",
                variable: "Message",
                to: {
                    type: "String",
                    value: "Hello" 
                }
            }
        }
    };

    const block: Block = {
        opcode: "Set Variable",
        variable: "Subject",
        to: {
            type: "String",
            value: "World"
        }
    };

    const state = blocks(initialState, addBlock(block, "1"));

    const blockId = state["1"].child

    if (blockId) {
        expect(state).toEqual({
            "0": {
                child: "1"
            },
            "1": {
                parent: "0",
                child: blockId,
                block: {
                    opcode: "Set Variable",
                    variable: "Message",
                    to: {
                        type: "String",
                        value: "Hello" 
                    }
                }
            },
            [blockId]: {
                parent: "1",
                block: block
            }
        });
    } else {
        throw new Error("blockId is undefined");
    }
});

it("adds a block before another block", () => {
    const initialState: BlocksState = {
        "0": {
            child: "1"
        },
        "1": {
            parent: "0",
            block: {
                opcode: "Set Variable",
                variable: "Message",
                to: {
                    type: "String",
                    value: "Hello" 
                }
            }
        }
    };

    const block: Block = {
        opcode: "Set Variable",
        variable: "Subject",
        to: {
            type: "String",
            value: "World"
        }
    };

    const state = blocks(initialState, addBlock(block, "0"));

    const blockId = state["0"].child

    if (blockId) {
        expect(state).toEqual({
            "0": {
                child: blockId
            },
            "1": {
                parent: blockId,
                block: {
                    opcode: "Set Variable",
                    variable: "Message",
                    to: {
                        type: "String",
                        value: "Hello" 
                    }
                }
            },
            [blockId]: {
                parent: "0",
                child: "1",
                block: block
            }
        });
    } else {
        throw new Error("blockId is undefined");
    }
});