import React from "react";
import { Meta } from "@storybook/react";
import Block from "../editor/gui/components/Block/Block";
import { Provider } from "react-redux";
import produce from "immer";
import { initialState } from "../editor/state/reducers/reducer";
import mockStore from "./mockStore";
import BlocksDndContext from "../editor/gui/components/BlocksDndContext/BlocksDndContext";

export default {
  component: Block,
  title: "Components/Block",
} as Meta;

export const SetVariable = () => {
  const store = mockStore(
    produce(initialState, (draft) => {
      draft.current.blocks = {
        "1": {
          parentType: "Blocks Container",
          parent: "0",
          block: {
            opcode: "Set Variable",
            variable: "2",
            to: "3",
            type: "Vector3D",
          },
        },
        "10": {
          parentType: "Expression Block",
          parent: "8",
          block: {
            opcode: "Built In Function",
            name: "Normalise",
            arguments: {
              byId: {
                a: "2",
              },
              order: ["a"],
            },
            type: "Vector3D",
          },
        },
      };
      draft.current.expressions = {
        "2": {
          expressionType: "Block",
          type: "Vector3D Reference",
          expressionBlock: "6",
        },
        "3": {
          expressionType: "Block",
          type: "Vector3D",
          expressionBlock: "7",
        },
        "4": {
          expressionType: "Block",
          type: "Vector3D",
          expressionBlock: "8",
        },
        "5": {
          expressionType: "Block",
          type: "Float",
          expressionBlock: "9",
        },
      };
      draft.current.expressionBlocks = {
        "6": {
          expressionBlockType: "Variable Reference",
          type: "Vector3D Reference",
          variable: {
            variable: "New Velocity",
            type: "Vector3D",
          },
          parent: "2",
        },
        "7": {
          expressionBlockType: "Operator",
          type: "Vector3D",
          operation: "*",
          arguments: ["4", "5"],
          parent: "3",
        },
        "8": {
          expressionBlockType: "Function",
          type: "Vector3D",
          block: "10",
          parent: "4",
        },
        "9": {
          expressionBlockType: "Variable",
          type: "Float",
          variable: {
            variable: "Speed",
            type: "Float",
          },
          parent: "5",
        },
      };
    })
  );

  return (
    <Provider store={store}>
      <BlocksDndContext>
        <Block id="1" />
      </BlocksDndContext>
    </Provider>
  );
};

export const BuiltInFunction = () => {
  const store = mockStore(
    produce(initialState, (draft) => {
      draft.current.blocks = {
        "1": {
          parentType: "Blocks Container",
          parent: "0",
          block: {
            opcode: "Built In Function",
            name: "Normalise",
            arguments: {
              byId: {
                a: "2",
              },
              order: ["a"],
            },
            type: "Vector3D",
          },
        },
      };
      draft.current.expressions = {
        "2": {
          expressionType: "Block",
          type: "Vector3D",
          expressionBlock: "3",
        },
      };
      draft.current.expressionBlocks = {
        "3": {
          expressionBlockType: "Variable",
          variable: {
            variable: "Velocity",
            type: "Vector3D",
          },
          type: "Vector3D",
          parent: "2",
        },
      };
    })
  );

  return (
    <Provider store={store}>
      <BlocksDndContext>
        <Block id="1" />
      </BlocksDndContext>
    </Provider>
  );
};
