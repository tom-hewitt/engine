import React from "react";
import { Meta } from "@storybook/react";
import FunctionCard from "../components/FunctionCard/FunctionCard";
import mockStore from "./mockStore";
import produce from "immer";
import { initialState } from "../reducers/reducer";
import { Provider } from "react-redux";
import BlocksDndContext from "../components/BlocksDndContext/BlocksDndContext";

export default {
  component: FunctionCard,
  title: "Components/FunctionCard",
} as Meta;

export const Default = () => {
  const store = mockStore(
    produce(initialState, (draft) => {
      draft.current.functions["a"] = {
        name: "Calculate Velocity",
        blocksContainer: "0",
        variables: [],
        type: "Vector3D",
      };

      draft.current.blocksContainers = {
        "0": {
          blocks: ["1", "11", "22", "31"],
        },
      };
      draft.current.blocks = {
        "1": {
          parentType: "Blocks Container",
          parent: "0",
          block: {
            opcode: "Set Variable",
            variable: "2",
            to: "4",
            type: "Vector3D",
          },
        },
        "11": {
          parentType: "Blocks Container",
          parent: "0",
          block: {
            opcode: "Set Variable",
            variable: "12",
            to: "14",
            type: "Vector3D",
          },
        },
        "22": {
          parentType: "Blocks Container",
          parent: "0",
          block: {
            opcode: "Set Variable",
            variable: "23",
            to: "25",
            type: "Float",
          },
        },
        "31": {
          parentType: "Blocks Container",
          parent: "0",
          block: {
            opcode: "Set Variable",
            variable: "32",
            to: "34",
            type: "Boolean",
          },
        },
        "40": {
          parentType: "Expression Block",
          parent: "17",
          block: {
            opcode: "Built In Function",
            name: "Normalise",
            arguments: {
              byId: {
                a: "18",
              },
              order: ["a"],
            },
            type: "Vector3D",
          },
        },
        "41": {
          parentType: "Expression Block",
          parent: "37",
          block: {
            opcode: "Built In Function",
            name: "Modulus",
            arguments: {
              byId: {
                a: "38",
              },
              order: ["a"],
            },
            type: "Float",
          },
        },
      };
      draft.current.expressions = {
        "2": {
          expressionType: "Block",
          type: "Vector3D Reference",
          expressionBlock: "3",
        },
        "4": {
          expressionType: "Block",
          type: "Vector3D",
          expressionBlock: "5",
        },
        "6": {
          expressionType: "Block",
          type: "Float",
          expressionBlock: "7",
        },
        "8": {
          expressionType: "Block",
          type: "Float",
          expressionBlock: "9",
        },
        "10": {
          type: "Float",
          value: 0,
        },
        "12": {
          expressionType: "Block",
          type: "Vector3D Reference",
          expressionBlock: "13",
        },
        "14": {
          expressionType: "Block",
          type: "Vector3D",
          expressionBlock: "15",
        },
        "16": {
          expressionType: "Block",
          type: "Vector3D",
          expressionBlock: "17",
        },
        "18": {
          expressionType: "Block",
          type: "Vector3D",
          expressionBlock: "19",
        },
        "20": {
          expressionType: "Block",
          type: "Float",
          expressionBlock: "21",
        },
        "23": {
          expressionType: "Block",
          type: "Float Reference",
          expressionBlock: "24",
        },
        "25": {
          expressionType: "Block",
          type: "Float",
          expressionBlock: "26",
        },
        "27": {
          expressionType: "Block",
          type: "Float",
          expressionBlock: "28",
        },
        "29": {
          expressionType: "Block",
          type: "Float",
          expressionBlock: "30",
        },
        "32": {
          expressionType: "Block",
          type: "Boolean Reference",
          expressionBlock: "33",
        },
        "34": {
          expressionType: "Block",
          type: "Boolean",
          expressionBlock: "35",
        },
        "36": {
          expressionType: "Block",
          type: "Float",
          expressionBlock: "37",
        },
        "38": {
          expressionType: "Block",
          type: "Vector3D",
          expressionBlock: "39",
        },
        "40": {
          expressionType: "Literal",
          type: "Float",
          value: 0,
        },
      };
      draft.current.expressionBlocks = {
        "3": {
          expressionBlockType: "Variable Reference",
          type: "Vector3D Reference",
          variable: {
            variable: "New Velocity",
            type: "Vector3D",
          },
          parent: "2",
        },
        "5": {
          expressionBlockType: "Vector3D",
          type: "Vector3D",
          arguments: ["6", "8", "10"],
          parent: "4",
        },
        "7": {
          expressionBlockType: "Variable",
          type: "Float",
          variable: {
            variable: "Input x",
            type: "Float",
          },
          parent: "6",
        },
        "9": {
          expressionBlockType: "Variable",
          type: "Float",
          variable: {
            variable: "Input y",
            type: "Float",
          },
          parent: "8",
        },
        "13": {
          expressionBlockType: "Variable Reference",
          type: "Vector3D Reference",
          variable: {
            variable: "New Velocity",
            type: "Vector3D",
          },
          parent: "12",
        },
        "15": {
          expressionBlockType: "Operator",
          type: "Vector3D",
          operation: "*",
          arguments: ["16", "20"],
          parent: "14",
        },
        "17": {
          expressionBlockType: "Function",
          type: "Vector3D",
          block: "40",
          parent: "16",
        },
        "19": {
          expressionBlockType: "Variable",
          type: "Vector3D",
          variable: {
            variable: "Velocity",
            type: "Vector3D",
          },
          parent: "18",
        },
        "21": {
          expressionBlockType: "Variable",
          type: "Float",
          variable: {
            variable: "Speed",
            type: "Float",
          },
          parent: "20",
        },
        "24": {
          expressionBlockType: "Variable Reference",
          type: "Float Reference",
          variable: {
            variable: "New Velocity",
            type: "Vector3D",
            member: {
              variable: "y",
              type: "Float",
            },
          },
          parent: "23",
        },
        "26": {
          expressionBlockType: "Operator",
          operation: "+",
          type: "Float",
          arguments: ["27", "29"],
          parent: "25",
        },
        "28": {
          expressionBlockType: "Variable",
          type: "Float",
          variable: {
            variable: "New Velocity",
            type: "Vector3D",
            member: {
              variable: "y",
              type: "Float",
            },
          },
          parent: "27",
        },
        "30": {
          expressionBlockType: "Variable",
          type: "Float",
          variable: {
            variable: "Gravity",
            type: "Float",
          },
          parent: "29",
        },
        "33": {
          expressionBlockType: "Variable Reference",
          type: "Boolean Reference",
          variable: {
            variable: "Is Moving?",
            type: "Boolean",
          },
          parent: "32",
        },
        "35": {
          expressionBlockType: "Operator",
          operation: ">",
          type: "Boolean",
          arguments: ["36", "40"],
          parent: "34",
        },
        "37": {
          expressionBlockType: "Function",
          type: "Float",
          block: "41",
          parent: "36",
        },
        "39": {
          expressionBlockType: "Variable",
          type: "Vector3D",
          variable: {
            variable: "New Velocity",
            type: "Vector3D",
          },
          parent: "38",
        },
      };
    })
  );
  return (
    <Provider store={store}>
      <BlocksDndContext>
        <FunctionCard id="a" />
      </BlocksDndContext>
    </Provider>
  );
};
