import { useSelector } from "react-redux";
import styled from "styled-components";
import { State } from "../../reducers/reducer";
import { SceneId, SceneObjectId } from "../../reducers/scenes";
import {
  Card,
  CloseButton,
  Header,
  HeaderBar,
  SubTitle,
  Title,
} from "../Card/Card";

const HorizontalContainer = styled.div`
  display: flex;
  flex-direction: row;

  margin-bottom: 30px;
`;

export default function SceneObjectCard(props: {
  id: SceneObjectId;
  sceneId: SceneId;
  onClose?: () => void;
}) {
  const object = useSelector(
    (state: State) => state.current.scenes[props.sceneId].objects[props.id]
  );

  const color = "#6adbff";
  return (
    <Card
      initial={{ y: 200, scale: 0.9, opacity: 0 }}
      animate={{ y: -25, scale: 1, opacity: 1 }}
      exit={{ y: 200, scale: 0.9, opacity: 0 }}
      transition={{ ease: "easeOut", duration: 0.25 }}
    >
      <HeaderBar>
        <Header>
          <Title>{object.name}</Title>
          <SubTitle color={color}>{object.type.toUpperCase()}</SubTitle>
        </Header>
        <CloseButton
          onClick={() => {
            if (props.onClose) props.onClose();
          }}
        />
      </HeaderBar>
    </Card>
  );
}
