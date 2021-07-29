import React, { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import hexToRGB from "../../../utilities/hexToRGB";
import { useDraggable } from "@dnd-kit/core";

export type InputFieldProps = {
    color: string,
    value: string,
    onChange: (newValue: string) => void,
    onSubmit: () => void
};

const Container = styled(motion.div)`
    display: inline-grid;
    align-items: center;
    justify-items: start;

    padding: 0;

    border: 1px solid ${props => props.color};
    box-sizing: border-box;
    border-radius: 5px;
`;

const Input = styled.input.attrs((props: { color: string }) => ({
    type: "text",
    size: "1",
}))`
    grid-area: 1 / 1 / 2 / 2;
    width: 100%;
    padding: 10px;

    border: none;
    outline: none;

    font-family: IBM Plex Mono;
    font-weight: 500;
    font-size: 10px;
    color: ${props => props.color};
    background: none;
`;

const HiddenSpan = styled.span`
    grid-area: 1 / 1 / 2 / 2;
    visibility: hidden;
    height: 0;

    padding: 10px;

    font-family: IBM Plex Mono;
    font-weight: 500;
    font-size: 10px;
`;

/**
 * An auto-growing input field that submits on blur or on enter
 * @param {string} color The color to use for the field
 * @param {string} value The value that is in the field
 * @param {(newValue: string) => void} onChange Callback for when the value is changed
 * @param {() => void} onSubmit Callback for when the value is submitted
 */
export default function InputField(props: InputFieldProps) {
    const [focused, setFocused] = useState(false);

    // Store backgrounds as state so they are not recalculated every time
    const [background] = useState(hexToRGB(props.color, "0"));
    const [focusedBackground] = useState(hexToRGB(props.color, "0.1"));

    const onKeyDown = (event: any) => {
        if (event.keyCode === 13) {
            event.target.blur();
        }
    }

    const onFocus = (event: any) => {
        setFocused(true);
    }

    const onBlur = (event: any) => {
        setFocused(false);

        props.onSubmit()
    }

    // Must make this a draggable so it blocks any draggables underneath from being dragged when the user is trying to select text
    const {attributes, listeners, setNodeRef} = useDraggable({
        id: "input"
    });

    return (
        <div
            className="input"
            ref={setNodeRef}
            {...attributes}
            {...listeners}
        >
            <Container
                color={props.color}
                animate={{ backgroundColor: focused ? focusedBackground : background }}
                className="input"
            >
                <Input
                    color={props.color}
                    value={props.value}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => props.onChange(event.target.value)}
                    onKeyDown={onKeyDown}
                    onFocus={onFocus}
                    onBlur={onBlur}
                />
                <HiddenSpan>
                    {props.value === "" ? "_" : props.value}
                </HiddenSpan>
            </Container>
        </div>
    );
};