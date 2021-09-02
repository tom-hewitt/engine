import { State } from "./reducers/reducer";

const defaultState: State = {
  current: {
    levels: {
      "Level 1": {
        name: "Level 1",
        scene: "Level 1",
      },
    },
    scenes: {
      "Level 1": {
        children: ["0", "1"],
        objects: {
          "0": {
            name: "Light",
            type: "Directional Light",
            position: {
              x: -1,
              y: 2,
              z: 4,
            },
            rotation: {
              x: 0,
              y: 0,
              z: 0,
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
            name: "Floor",
            children: ["2"],
            type: "Mesh",
            position: {
              x: 0,
              y: 0,
              z: 0,
            },
            rotation: {
              x: 0,
              y: 0,
              z: 0,
            },
            size: {
              x: 1,
              y: 1,
              z: 1,
            },
            mesh: "Plane",
          },
          "2": {
            name: "Box",
            type: "Mesh",
            position: {
              x: 0,
              y: 0,
              z: 0,
            },
            rotation: {
              x: 0,
              y: 0,
              z: 0,
            },
            size: {
              x: 1,
              y: 1,
              z: 1,
            },
            mesh: "Box",
          },
        },
      },
    },
    meshes: {
      Box: {
        geometry: {
          type: "Primitive",
          primitive: "Box",
        },
        material: "Blue",
      },
    },
    materials: {
      Blue: {
        type: "Phong",
        color: 0x44aa88,
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
