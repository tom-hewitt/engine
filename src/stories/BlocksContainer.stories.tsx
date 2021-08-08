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
        draft.current.blocksContainers = {
            "0": {
                blocks: ["1", "11", "22"]
            }
        }
        draft.current.blocks = {
            "1": {
                parent: "0",
                block: {
                    opcode: "Set Variable",
                    variable: "2",
                    to: "4",
                    type: "3D Vector"
                }
            },
            "11": {
                parent: "0",
                block: {
                    opcode: "Set Variable",
                    variable: "12",
                    to: "14",
                    type: "3D Vector"
                }
            },
            "22": {
                parent: "0",
                block: {
                    opcode: "Set Variable",
                    variable: "23",
                    to: "25",
                    type: "Float"
                }
            }
        };
        draft.current.expressions = {
            "2": {
                expressionType: "Block",
                type: "3D Vector Reference",
                expressionBlock: "3"
            },
            "4": {
                expressionType: "Block",
                type: "3D Vector",
                expressionBlock: "5"
            },
            "6": {
                expressionType: "Block",
                type: "Float",
                expressionBlock: "7"
            },
            "8": {
                expressionType: "Block",
                type: "Float",
                expressionBlock: "9"
            },
            "10": {
                type: "Float",
                value: 0
            },
            "12": {
                expressionType: "Block",
                type: "3D Vector Reference",
                expressionBlock: "13"
            },
            "14": {
                expressionType: "Block",
                type: "3D Vector",
                expressionBlock: "15"
            },
            "16": {
                expressionType: "Block",
                type: "3D Vector",
                expressionBlock: "17"
            },
            "18": {
                expressionType: "Block",
                type: "3D Vector",
                expressionBlock: "19"
            },
            "20": {
                expressionType: "Block",
                type: "Float",
                expressionBlock: "21"
            },
            "23": {
                expressionType: "Block",
                type: "Float Reference",
                expressionBlock: "24"
            },
            "25": {
                expressionType: "Block",
                type: "Float",
                expressionBlock: "26"
            },
            "27": {
                expressionType: "Block",
                type: "Float",
                expressionBlock: "28"
            },
            "29": {
                expressionType: "Block",
                type: "Float",
                expressionBlock: "30"
            }
        };
        draft.current.expressionBlocks = {
            "3": {
                expressionBlockType: "Variable Reference",
                type: "3D Vector Reference",
                variable: {
                    variable: "New Velocity",
                    type: "3D Vector"
                },
                parent: "2"
            },
            "5": {
                expressionBlockType: "3D Vector",
                type: "3D Vector",
                arguments: ["6", "8", "10"],
                parent: "4"
            },
            "7": {
                expressionBlockType: "Variable",
                type: "Float",
                variable: {
                    variable: "Input x",
                    type: "Float"
                },
                parent: "6"
            },
            "9": {
                expressionBlockType: "Variable",
                type: "Float",
                variable: {
                    variable: "Input y",
                    type: "Float"
                },
                parent: "8"
            },
            "13": {
                expressionBlockType: "Variable Reference",
                type: "3D Vector Reference",
                variable: {
                    variable: "New Velocity",
                    type: "3D Vector"
                },
                parent: "12"
            },
            "15": {
                expressionBlockType: "Operator",
                type: "3D Vector",
                operation: "*",
                arguments: ["16", "20"],
                parent: "14"
            },
            "17": {
                expressionBlockType: "Function",
                type: "3D Vector",
                block: {
                    opcode: "Built In Function",
                    name: "Normalise",
                    arguments: {
                        byId: {
                            "a": "18"
                        },
                        order: ["a"]
                    },
                    type: "3D Vector"
                },
                parent: "16"
            },
            "19": {
                expressionBlockType: "Variable",
                type: "3D Vector",
                variable: {
                    variable: "Velocity",
                    type: "3D Vector"
                },
                parent: "18"
            },
            "21": {
                expressionBlockType: "Variable",
                type: "Float",
                variable: {
                    variable: "Speed",
                    type: "Float"
                },
                parent: "20"
            },
            "24": {
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
                parent: "23"
            },
            "26": {
                expressionBlockType: "Operator",
                operation: "+",
                type: "Float",
                arguments: ["27", "29"],
                parent: "25"
            },
            "28": {
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
                parent: "27"
            },
            "30": {
                expressionBlockType: "Variable",
                type: "Float",
                variable: {
                    variable: "Gravity",
                    type: "Float"
                },
                parent: "29"
            }
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
