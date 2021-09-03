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
            attributes: {
              Position: {
                type: "3D Vector",
                value: {
                  x: -1,
                  y: 2,
                  z: 4,
                },
              },
              "Light Target": {
                type: "3D Vector",
                value: {
                  x: 0,
                  y: 0,
                  z: 0,
                },
              },
              Color: {
                type: "Color",
                value: 0xffffff,
              },
              Intensity: {
                type: "Float",
                value: 1,
              },
            },
          },
          "1": {
            name: "Floor",
            children: ["2"],
            type: "Mesh",
            attributes: {
              Position: {
                type: "3D Vector",
                value: {
                  x: 0,
                  y: 0,
                  z: 0,
                },
              },
              Rotation: {
                type: "3D Vector",
                value: {
                  x: -90,
                  y: 0,
                  z: 0,
                },
              },
              Size: {
                type: "3D Vector",
                value: {
                  x: 5,
                  y: 5,
                  z: 1,
                },
              },
              Mesh: {
                type: "Mesh",
                value: "Plane",
              },
            },
          },
          "2": {
            name: "Box",
            type: "Mesh",
            attributes: {
              Position: {
                type: "3D Vector",
                value: {
                  x: 0,
                  y: 0.5,
                  z: 0,
                },
              },
              Rotation: {
                type: "3D Vector",
                value: {
                  x: -90,
                  y: 0,
                  z: 0,
                },
              },
              Size: {
                type: "3D Vector",
                value: {
                  x: 1,
                  y: 1,
                  z: 1,
                },
              },
              Mesh: {
                type: "Mesh",
                value: "Box",
              },
            },
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
      Plane: {
        geometry: {
          type: "Primitive",
          primitive: "Plane",
        },
        material: "Grey",
      },
    },
    materials: {
      Blue: {
        type: "Phong",
        color: 0x44aa88,
      },
      Grey: {
        type: "Phong",
        color: 0xc4c4c4,
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
