import { algorithms, BlocksContainersState } from "../../reducers/blocksContainers"

it("reorders a block", () => {
    const initialState: BlocksContainersState = {
        "0": {
            blocks: ["1", "2", "3"]
        }
    };

    const state = algorithms.reorderBlock(initialState, "0", 0, 2);

    expect(state).toEqual({
        "0": {
            blocks: ["2", "3", "1"]
        }
    })
});