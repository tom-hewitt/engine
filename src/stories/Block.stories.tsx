import React, { useState } from "react";
import { Meta } from "@storybook/react";
import Block from "../components/Block/Block";
import { Provider } from "react-redux";
import produce from "immer";
import { initialState } from "../reducers/reducer";
import mockStore from "./mockStore";
import BlocksDndContext from "../components/BlocksDndContext/BlocksDndContext";

export default {
    component: Block,
    title: "Components/Block"
} as Meta;

export const SetVariable = () => {
    const store = mockStore(produce(initialState, (draft) => {
        draft.current.blocks = {
            "0": {
                child: "1"
            },
            "1": {
                parent: "0",
                block: {
                    opcode: "Set Variable",
                    variable: "2",
                    to: "3",
                    type: "3D Vector"
                }
            }
        };
        draft.current.expressions = {
            "2": {
                expressionType: "Block",
                type: "3D Vector Reference",
                expressionBlock: "6"
            },
            "3": {
                expressionType: "Block",
                type: "3D Vector",
                expressionBlock: "7"
            },
            "4": {
                expressionType: "Block",
                type: "3D Vector",
                expressionBlock: "8"
            },
            "5": {
                expressionType: "Block",
                type: "Float",
                expressionBlock: "9"
            }
        };
        draft.current.expressionBlocks = {
            "6": {
                expressionBlockType: "Variable Reference",
                type: "3D Vector Reference",
                variable: {
                    variable: "New Velocity",
                    type: "3D Vector"
                },
                parent: "2"
            },
            "7": {
                expressionBlockType: "Operator",
                type: "3D Vector",
                operation: "*",
                arguments: ["4", "5"],
                parent: "3"
            },
            "8": {
                expressionBlockType: "Function",
                type: "3D Vector",
                block: {
                    opcode: "Built In Function",
                    name: "Normalise",
                    arguments: {
                        byId: {
                            "a": "2"
                        },
                        order: ["a"]
                    },
                    type: "3D Vector"
                },
                parent: "4"
            },
            "9": {
                expressionBlockType: "Variable",
                type: "Float",
                variable: {
                    variable: "Speed",
                    type: "Float"
                },
                parent: "5"
            }
        }
    }));

    return (
        <Provider store={store}>
            <BlocksDndContext>
                <Block id="1"/>
            </BlocksDndContext>
        </Provider>
    )
}

export const BuiltInFunction = () => {
    const store = mockStore(produce(initialState, (draft) => {
        draft.current.blocks = {
            "0": {
                child: "1"
            },
            "1": {
                parent: "0",
                block: {
                    opcode: "Built In Function",
                    name: "Normalise",
                    arguments: {
                        byId: {
                            "a": "2"
                        },
                        order: ["a"]
                    },
                    type: "3D Vector"
                }
            }
        };
        draft.current.expressions = {
            "2": {
                expressionType: "Block",
                type: "3D Vector",
                expressionBlock: "3"
            }
        };
        draft.current.expressionBlocks = {
            "3": {
                expressionBlockType: "Variable",
                variable: {
                    variable: "Velocity",
                    type: "3D Vector"
                },
                type: "3D Vector",
                parent: "2"
            }
        };
    }));

    return (
        <Provider store={store}>
            <BlocksDndContext>
                <Block id="1"/>
            </BlocksDndContext>
        </Provider>
    )
}