import styled from "styled-components";
import { motion } from "framer-motion";
import typeColors from "../../../styles/typeColors";
import hexToRGB from "../../../utilities/hexToRGB";

const focusedBackground = typeColors.Boolean
const background = hexToRGB(focusedBackground, "0.1")

const Container = styled.div`
    display: inline-block;
    vertical-align: middle;
`;

const Icon = styled(motion.svg)`
    fill: none;
    stroke: white;
    stroke-width: 2px;
`;

const HiddenCheckbox = styled.input.attrs({ type: "checkbox" })`
    border: 0;
    clip: rect(0 0 0 0);
    clippath: inset(50%);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    white-space: nowrap;
    width: 1px;
`;

const StyledCheckbox = styled(motion.div)`
    display: inline-block;
    width: 16px;
    height: 16px;
    border-radius: 3px;

    border: 1px solid ${focusedBackground};
    box-sizing: border-box;
    border-radius: 5px;
`;

export default function LiteralBoolean(props: { value: boolean, onSubmit: (value: boolean) => void }) {
    return (
        <label>
            <Container>
                <HiddenCheckbox checked={props.value} onChange={() => props.onSubmit(!props.value)}/>
                <StyledCheckbox
                    animate={{ backgroundColor: props.value ? focusedBackground : background }}
                >
                    <Icon
                        viewBox="0 0 24 24" 
                        animate={{ opacity: props.value ? 1 : 0 }}
                    >
                        <polyline points="20 6 9 17 4 12"/>
                    </Icon>
                </StyledCheckbox>
            </Container>
        </label>
    )
}