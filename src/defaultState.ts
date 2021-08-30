import { State } from "./reducers/reducer";

const defaultState: State = {
  current: {
    scenes: {
      "Level 1": {
        children: ["0", "1"],
        objects: {
          "0": {
            objectType: "Directional Light",
            position: {
              x: -1,
              y: 2,
              z: 4,
            },
            lightTarget: {
              x: 0,
              y: 0,
              z: 0,
            },
            color: 0xffffff,
            intensity: 1,
          },
          "1": {
            objectType: "Box",
            position: {
              x: 0,
              y: 0,
              z: 0,
            },
            size: {
              x: 1,
              y: 1,
              z: 1,
            },
          },
        },
      },
    },
    blocksContainers: {},
    blocks: {},
    expressions: {},
    expressionBlocks: {},
    functions: {},
  },
  history: [],
  index: 0,
  temp: {},
};

export default defaultState;
