import { useSelector } from "react-redux";
import styled from "styled-components";
import { FunctionId } from "../../reducers/functions";
import { State } from "../../reducers/reducer";
import colors from "../../styles/colors";
import typeColors from "../../styles/typeColors";
import BlocksContainer from "../BlocksContainer/BlocksContainer";
import {
  Card,
  CloseButton,
  Header,
  HeaderBar,
  SubTitle,
  Title,
} from "../Card/Card";
import FunctionIcon from "../Icons/FunctionIcon/FunctionIcon";

const HorizontalContainer = styled.div`
  display: flex;
  flex-direction: row;

  margin-bottom: 30px;
`;

export default function FunctionCard(props: { id: FunctionId }) {
  const func = useSelector((state: State) => state.current.functions[props.id]);

  const color = func.type ? typeColors[func.type] : colors.Secondary;
  return (
    <Card>
      <HeaderBar>
        <Header>
          <Title>{func.name}</Title>
          <HorizontalContainer>
            <FunctionIcon color={color} />
            <SubTitle color={color}>
              {func.type ? func.type.toUpperCase() : "FUNCTION"}
            </SubTitle>
          </HorizontalContainer>
        </Header>
        <CloseButton onClick={() => {}} />
      </HeaderBar>
      <BlocksContainer id={func.blocksContainer} />
    </Card>
  );
}
