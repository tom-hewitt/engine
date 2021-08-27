import React from "react";
import { Meta } from "@storybook/react";
import Expression from "../components/Expression/Expression";
import mockStore from "./mockStore";
import { Provider } from "react-redux";
import { initialState } from "../reducers/reducer";
import produce from "immer";
import BlocksDndContext from "../components/BlocksDndContext/BlocksDndContext";

export default {
  component: Expression,
  title: "Components/Expression",
} as Meta;

export const Literal = () => {
  const store = mockStore(
    produce(initialState, (draft) => {
      draft.current.expressions = {
        "0": {
          type: "String",
          value: "Hello",
        },
      };
    })
  );

  return (
    <Provider store={store}>
      <Expression expression="0" />
    </Provider>
  );
};

export const Variable = () => {
  const store = mockStore(
    produce(initialState, (draft) => {
      draft.current.expressions = {
        "0": {
          type: "String",
          expressionType: "Block",
          expressionBlock: "0",
        },
      };
      draft.current.expressionBlocks = {
        "0": {
          expressionBlockType: "Variable",
          type: "String",
          variable: {
            variable: "Name",
            type: "String",
          },
          parent: "0",
        },
      };
    })
  );

  return (
    <Provider store={store}>
      <BlocksDndContext>
        <Expression expression="0" />
      </BlocksDndContext>
    </Provider>
  );
};

export const VariableReference = () => {
  const store = mockStore(
    produce(initialState, (draft) => {
      draft.current.expressions = {
        "0": {
          type: "String Reference",
          expressionType: "Block",
          expressionBlock: "0",
        },
      };
      draft.current.expressionBlocks = {
        "0": {
          expressionBlockType: "Variable Reference",
          type: "String Reference",
          variable: {
            variable: "Name",
            type: "String",
          },
          parent: "0",
        },
      };
    })
  );

  return (
    <Provider store={store}>
      <BlocksDndContext>
        <Expression expression="0" />
      </BlocksDndContext>
    </Provider>
  );
};

export const StructMemberReference = () => {
  const store = mockStore(
    produce(initialState, (draft) => {
      draft.current.expressions = {
        "0": {
          type: "3D Vector Reference",
          expressionType: "Block",
          expressionBlock: "0",
        },
      };
      draft.current.expressionBlocks = {
        "0": {
          expressionBlockType: "Variable Reference",
          type: "3D Vector Reference",
          variable: {
            variable: "Velocity",
            type: "3D Vector",
            member: {
              variable: "y",
              type: "Float",
            },
          },
          parent: "0",
        },
      };
    })
  );

  return (
    <Provider store={store}>
      <BlocksDndContext>
        <Expression expression="0" />
      </BlocksDndContext>
    </Provider>
  );
};

export const StructMember = () => {
  const store = mockStore(
    produce(initialState, (draft) => {
      draft.current.expressions = {
        "0": {
          type: "Float",
          expressionType: "Block",
          expressionBlock: "0",
        },
      };
      draft.current.expressionBlocks = {
        "0": {
          expressionBlockType: "Variable",
          type: "Float",
          variable: {
            variable: "Velocity",
            type: "3D Vector",
            member: {
              variable: "y",
              type: "Float",
            },
          },
          parent: "0",
        },
      };
    })
  );

  return (
    <Provider store={store}>
      <BlocksDndContext>
        <Expression expression="0" />
      </BlocksDndContext>
    </Provider>
  );
};

export const Function = () => {
  const store = mockStore(
    produce(initialState, (draft) => {
      draft.current.expressions = {
        "0": {
          type: "3D Vector",
          expressionType: "Block",
          expressionBlock: "0",
        },
      };
      draft.current.expressionBlocks = {
        "0": {
          expressionBlockType: "Function",
          type: "3D Vector",
          block: {
            opcode: "Built In Function",
            name: "Normalise",
            arguments: {
              byId: {
                a: "1",
              },
              order: ["a"],
            },
            type: "3D Vector",
          },
          parent: "0",
        },
      };
    })
  );

  return (
    <Provider store={store}>
      <BlocksDndContext>
        <Expression expression="0" />
      </BlocksDndContext>
    </Provider>
  );
};

export const Operator = () => {
  const store = mockStore(
    produce(initialState, (draft) => {
      draft.current.expressions = {
        "0": {
          type: "Float",
          expressionType: "Block",
          expressionBlock: "1",
        },
        "2": {
          type: "Float",
          expressionType: "Block",
          expressionBlock: "4",
        },
        "3": {
          type: "Float",
          expressionType: "Block",
          expressionBlock: "5",
        },
      };
      draft.current.expressionBlocks = {
        "1": {
          expressionBlockType: "Operator",
          type: "Float",
          operation: "*",
          arguments: ["2", "3"],
          parent: "0",
        },
        "4": {
          expressionBlockType: "Variable",
          type: "Float",
          variable: {
            variable: "Speed",
            type: "Float",
          },
          parent: "2",
        },
        "5": {
          expressionBlockType: "Variable",
          type: "Float",
          variable: {
            variable: "Delta",
            type: "Float",
          },
          parent: "3",
        },
      };
    })
  );

  return (
    <Provider store={store}>
      <BlocksDndContext>
        <Expression expression="0" />
      </BlocksDndContext>
    </Provider>
  );
};

export const Vector3D = () => {
  const store = mockStore(
    produce(initialState, (draft) => {
      draft.current.expressions = {
        "0": {
          type: "3D Vector",
          expressionType: "Block",
          expressionBlock: "5",
        },
        "2": {
          type: "Float",
          expressionType: "Block",
          expressionBlock: "6",
        },
        "3": {
          type: "Float",
          expressionType: "Block",
          expressionBlock: "7",
        },
        "4": {
          type: "Float",
          value: 0,
        },
      };
      draft.current.expressionBlocks = {
        "5": {
          expressionBlockType: "3D Vector",
          type: "3D Vector",
          arguments: ["2", "3", "4"],
          parent: "0",
        },
        "6": {
          expressionBlockType: "Variable",
          type: "Float",
          variable: {
            variable: "Input x",
            type: "Float",
          },
          parent: "2",
        },
        "7": {
          expressionBlockType: "Variable",
          type: "Float",
          variable: {
            variable: "Input y",
            type: "Float",
          },
          parent: "3",
        },
      };
    })
  );

  return (
    <Provider store={store}>
      <BlocksDndContext>
        <Expression expression="0" />
      </BlocksDndContext>
    </Provider>
  );
};

export const Move = () => {
  const store = mockStore(
    produce(initialState, (draft) => {
      draft.current.expressions = {
        "0": {
          type: "String",
          value: "Hello",
        },
        "1": {
          expressionType: "Block",
          type: "String",
          expressionBlock: "3",
        },
      };
      draft.current.expressionBlocks = {
        "3": {
          expressionBlockType: "Variable",
          type: "String",
          variable: {
            variable: "Name",
            type: "String",
          },
          parent: "1",
        },
      };
    })
  );

  return (
    <Provider store={store}>
      <BlocksDndContext>
        <Expression expression="0" />
        <Expression expression="1" />
      </BlocksDndContext>
    </Provider>
  );
};
