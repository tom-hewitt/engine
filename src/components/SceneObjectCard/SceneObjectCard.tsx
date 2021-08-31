import { useSelector } from "react-redux";
import styled from "styled-components";
import { State } from "../../reducers/reducer";
import { SceneId, SceneObjectId } from "../../reducers/scenes";
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

export default function SceneObjectCard(props: {
  id: SceneObjectId;
  sceneId: SceneId;
}) {
  const object = useSelector(
    (state: State) => state.current.scenes[props.sceneId].objects[props.id]
  );

  const color = typeColors["String"];
  return (
    <Card>
      <HeaderBar>
        <Header>
          <Title>{object.name}</Title>
          <SubTitle color={color}>{object.objectType.toUpperCase()}</SubTitle>
        </Header>
        <CloseButton onClick={() => {}} />
      </HeaderBar>
    </Card>
  );
}
