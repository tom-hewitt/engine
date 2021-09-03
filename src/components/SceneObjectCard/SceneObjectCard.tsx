import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { State } from "../../reducers/reducer";
import {
  SceneId,
  SceneObject,
  SceneObjectId,
  setObjectAttribute,
} from "../../reducers/scenes";
import {
  Card,
  CloseButton,
  Header,
  HeaderBar,
  SubTitle,
  Title,
} from "../Card/Card";
import colors from "../../styles/colors";
import TypeText from "../TypeText/TypeText";
import Literal from "../Literal/Literal";
import { useState } from "react";

const Attributes = styled.div`
  display: grid;
  grid-template-columns: fit-content(100px) fit-content(50px) fit-content(250px);
  gap: 10px;
`;

const Cell = styled.div`
  display: inline-flex;
  flex-direction: column;

  justify-content: center;
`;

const Name = styled.span`
  font-family: IBM Plex Mono;
  font-weight: 700;
  font-size: 10px;

  color: ${colors.Primary};
`;

const EqualsText = styled.div`
  font-family: IBM Plex Mono;
  font-weight: normal;
  font-size: 11px;

  color: ${colors.Primary};
`;

const getAttributeOrder = (object: SceneObject) => {
  switch (object.type) {
    case "Directional Light":
      return ["Position", "Light Target", "Color", "Intensity"];
    case "Mesh":
      return ["Position", "Rotation", "Size", "Mesh"];
  }
};

function Attribute(props: {
  objectId: SceneObjectId;
  sceneId: SceneId;
  attribute: string;
}) {
  const literal = useSelector(
    (state: State) =>
      state.current.scenes[props.sceneId].objects[props.objectId].attributes[
        props.attribute
      ]
  );

  const dispatch = useDispatch();

  const onSubmit = (literal: Literal) => {
    dispatch(
      setObjectAttribute(
        props.sceneId,
        props.objectId,
        props.attribute,
        literal
      )
    );
  };

  return (
    <>
      <Cell>
        <Name>{props.attribute}</Name>
        <TypeText type={literal.type} />
      </Cell>
      <Cell>
        <EqualsText>=</EqualsText>
      </Cell>
      <Cell>
        <Literal {...literal} onSubmit={onSubmit} />
      </Cell>
    </>
  );
}

export default function SceneObjectCard(props: {
  id: SceneObjectId;
  sceneId: SceneId;
  onClose?: () => void;
}) {
  const object = useSelector(
    (state: State) => state.current.scenes[props.sceneId].objects[props.id]
  );

  const [order] = useState(getAttributeOrder(object));

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
        <CloseButton onClick={props.onClose} />
      </HeaderBar>
      <Attributes>
        {order.map((attribute) => (
          <Attribute
            sceneId={props.sceneId}
            objectId={props.id}
            attribute={attribute}
          />
        ))}
      </Attributes>
    </Card>
  );
}
