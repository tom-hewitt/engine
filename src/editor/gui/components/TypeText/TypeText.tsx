import styled from "styled-components";
import typeColors from "../../styles/typeColors";

const Text = styled.span<{ color: string }>`
  font-family: IBM Plex Mono;
  font-weight: 600;
  font-size: 8px;

  color: ${(props) => props.color};
`;

export default function TypeText(props: { type: Type }) {
  return <Text color={typeColors[props.type]}>{props.type.toUpperCase()}</Text>;
}
