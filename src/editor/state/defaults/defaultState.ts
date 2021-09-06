import { State } from "../reducers/reducer";

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
                type: "Vector3D",
                value: {
                  x: -1,
                  y: 2,
                  z: 4,
                },
              },
              "Light Target": {
                type: "Vector3D",
                value: {
                  x: 0,
                  y: 0,
                  z: 0,
                },
              },
              Color: {
                type: "Color",
                value: {
                  r: 255,
                  g: 255,
                  b: 255,
                },
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
                type: "Vector3D",
                value: {
                  x: 0,
                  y: 0,
                  z: 0,
                },
              },
              Rotation: {
                type: "Vector3D",
                value: {
                  x: -90,
                  y: 0,
                  z: 0,
                },
              },
              Size: {
                type: "Vector3D",
                value: {
                  x: 5,
                  y: 5,
                  z: 1,
                },
              },
              Geometry: {
                type: "Geometry",
                value: "Plane",
              },
              Material: {
                type: "Material",
                value: "Grey",
              },
            },
          },
          "2": {
            name: "Box",
            type: "Mesh",
            attributes: {
              Position: {
                type: "Vector3D",
                value: {
                  x: 0,
                  y: 0.5,
                  z: 0,
                },
              },
              Rotation: {
                type: "Vector3D",
                value: {
                  x: 0,
                  y: 0,
                  z: 0,
                },
              },
              Size: {
                type: "Vector3D",
                value: {
                  x: 1,
                  y: 1,
                  z: 1,
                },
              },
              Geometry: {
                type: "Geometry",
                value: "Box",
              },
              Material: {
                type: "Material",
                value: "Blue",
              },
            },
          },
        },
      },
    },
    materials: {
      Blue: {
        color: {
          r: 0,
          g: 0,
          b: 255,
        },
        opacity: 1,
        emissive: {
          r: 0,
          g: 0,
          b: 0,
        },
        roughness: 1,
        metalness: 0,
      },
      Grey: {
        color: {
          r: 200,
          g: 200,
          b: 200,
        },
        opacity: 1,
        emissive: {
          r: 0,
          g: 0,
          b: 0,
        },
        roughness: 1,
        metalness: 0,
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
