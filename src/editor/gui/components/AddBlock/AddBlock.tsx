import styled from "styled-components";
import { motion } from "framer-motion";
import colors from "../../styles/colors";

const Container = styled(motion.div)`
  display: flex;
  flex-direction: row;

  width: 100%;

  padding: 15px;

  background-color: ${colors.Block};

  box-sizing: border-box;
  border-radius: 5px;
`;

const Input = styled.input`
  background: none;
  border: none;
  outline: none;

  width: 100%;

  color: ${colors.Primary};

  font-family: IBM Plex Mono;
  font-weight: 600;
  font-size: 10px;
`;

const CancelSVG = styled.svg`
  width: 14px;
  height: 14px;

  cursor: pointer;

  stroke-width: 2;
  stroke: #6d6d6d;
`;

export default function AddBlock(props: { cancel: () => void }) {
  return (
    <Container onClick={props.cancel}>
      <Input placeholder="ADD BLOCK..." autoFocus />
      <CancelSVG>
        <path d="M1 1L13 13M1 13L13 1" />
      </CancelSVG>
    </Container>
  );
}
