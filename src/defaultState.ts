import { State } from "./reducers/reducer";

const defaultState: State = {
  current: {
    scenes: {
      "Level 1": {
        children: ["0", "1", "2"],
        objects: {
          "0": {
            name: "Light",
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
            name: "Box",
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
            material: {
              type: "Phong",
              color: 0x44aa88,
            },
          },
          "2": {
            name: "Plane",
            objectType: "Plane",
            position: {
              x: 0,
              y: 0,
              z: 0,
            },
            size: {
              x: 5,
              y: 5,
            },
            material: {
              type: "Phong",
              color: 0x8c8c8c,
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
