import styled from "styled-components";
import colors from "../../styles/colors";

export const Card = styled.div`
  display: inline-flex;
  flex-direction: column;

  padding: 30px;

  background: #1e1e1e;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.25);
  border-radius: 20px;
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
`;
