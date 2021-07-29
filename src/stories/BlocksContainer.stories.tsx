import React from "react";
import { Meta } from "@storybook/react";
import { Provider } from "react-redux";
import produce from "immer";
import { initialState } from "../reducers/reducer";
import mockStore from "./mockStore";
import BlocksDndContext from "../components/BlocksDndContext/BlocksDndContext";
import BlocksContainer from "../components/BlocksContainer/BlocksContainer";

export default {
    component: BlocksContainer,
    title: "Components/BlocksContainer"
} as Meta;

export const Default = () => {
    const store = mockStore(produce(initialState, (draft) => {
        draft.current.blocks = {
            "0": {
                child: "3"
            },
            "1": {
                parent: "3",
                block: {
                    opcode: "Set Variable",
                    variable: "2",
                    to: "3",
                    type: "3D Vector"
                },
                child: "2"
            },
            "2": {
                parent: "1",
                block: {
                    opcode: "Set Variable",
                    variable: "10",
                    to: "12",
                    type: "Float"
                }
            },
            "3": {
                parent: "0",
                block: {
                    opcode: "Set Variable",
                    variable: "18",
                    to: "19",
                    type: "3D Vector"
                },
                child: "1"
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
            },
            "10": {
                expressionType: "Block",
                type: "Float Reference",
                expressionBlock: "11"
            },
            "12": {
                expressionType: "Block",
                type: "Float",
                expressionBlock: "13"
            },
            "14": {
                expressionType: "Block",
                type: "Float",
                expressionBlock: "16"
            },
            "15": {
                expressionType: "Block",
                type: "Float",
                expressionBlock: "17"
            },
            "18": {
                expressionType: "Block",
                type: "3D Vector Reference",
                expressionBlock: "20"
            },
            "19": {
                expressionType: "Block",
                type: "3D Vector",
                expressionBlock: "21"
            },
            "22": {
                expressionType: "Block",
                type: "Float",
                expressionBlock: "25"
            },
            "23": {
                expressionType: "Block",
                type: "Float",
                expressionBlock: "26"
            },
            "24": {
                type: "Float",
                value: 0
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
            },
            "11": {
                expressionBlockType: "Variable Reference",
                type: "Float Reference",
                variable: {
                    variable: "New Velocity",
                    type: "3D Vector",
                    member: {
                        variable: "y",
                        type: "Float"
                    }
                },
                parent: "6"
            },
            "13": {
                expressionBlockType: "Operator",
                operation: "+",
                type: "Float",
                arguments: ["14", "15"],
                parent: "12"
            },
            "16": {
                expressionBlockType: "Variable",
                type: "Float",
                variable: {
                    variable: "New Velocity",
                    type: "3D Vector",
                    member: {
                        variable: "y",
                        type: "Float"
                    }
                },
                parent: "14"
            },
            "17": {
                expressionBlockType: "Variable",
                type: "Float",
                variable: {
                    variable: "Gravity",
                    type: "Float"
                },
                parent: "15"
            },
            "20": {
                expressionBlockType: "Variable Reference",
                type: "3D Vector Reference",
                variable: {
                    variable: "New Velocity",
                    type: "3D Vector"
                },
                parent: "18"
            },
            "21": {
                expressionBlockType: "3D Vector",
                type: "3D Vector",
                arguments: ["22", "23", "24"],
                parent: "19"
            },
            "25": {
                expressionBlockType: "Variable",
                type: "Float",
                variable: {
                    variable: "Input x",
                    type: "Float"
                },
                parent: "22"
            },
            "26": {
                expressionBlockType: "Variable",
                type: "Float",
                variable: {
                    variable: "Input y",
                    type: "Float"
                },
                parent: "23"
            },
        }
    }));

    return (
        <Provider store={store}>
            <BlocksDndContext>
                <BlocksContainer id="0"/>
            </BlocksDndContext>
        </Provider>
    )
}
