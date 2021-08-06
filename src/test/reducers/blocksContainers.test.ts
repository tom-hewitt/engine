import { algorithms, BlocksContainersState } from "../../reducers/blocksContainers"

it("reorders a block", () => {
    const initialState: BlocksContainersState = {
        "0": {
            blocks: ["1", "2"]
        }
    };

    const state = algorithms.reorderBlock(initialState, "0", 1, 0);

    expect(state).toEqual({
        "0": {
            blocks: ["2", "1"]
        }
    })
});