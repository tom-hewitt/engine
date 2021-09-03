import styled from "styled-components";
import { motion } from "framer-motion";
import colors from "../../styles/colors";

export const Card = styled(motion.div)<{ width?: string }>`
  display: inline-flex;
  flex-direction: column;

  ${(props) => (props.width ? `width: ${props.width};` : "")}

  padding: 30px;

  background: #1e1e1e;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.25);
  border-radius: 20px;
`;

export const HeaderBar = styled.div`
  display: flex;
  flex-direction: row;
`;

export const Header = styled.div`
  display: flex;
  flex-direction: column;

  width: 100%;
`;

export const Title = styled.span`
  font-family: IBM Plex Mono;
  font-weight: bold;
  font-size: 25px;

  color: ${colors.Primary};
`;

export const SubTitle = styled.span<{ color: string }>`
  font-family: IBM Plex Mono;
  font-weight: normal;
  font-size: 12px;

  color: ${(props) => props.color};

  margin-bottom: 20px;
`;

export const SubHeading = styled.span`
  font-family: IBM Plex Mono;
  font-weight: 600;
  font-size: 12px;

  color: ${colors.Secondary};
`;

const ButtonContainer = styled(motion.button)`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  height: 32px;
  width: 32px;

  border: none;

  cursor: pointer;

  background: #292929;
  border-radius: 10px;
`;

const CloseSVG = styled.svg`
  width: 14px;
  height: 14px;
`;

export const CloseButton = (props: { onClick: () => void }) => {
  return (
    <ButtonContainer
      onClick={props.onClick}
      animate={{ scale: 1 }}
      whileTap={{ scale: 0.9 }}
    >
      <CloseSVG>
        <path d="M1 1L13 13M1 13L13 1" stroke="#6D6D6D" strokeWidth="2" />
      </CloseSVG>
    </ButtonContainer>
  );
};
