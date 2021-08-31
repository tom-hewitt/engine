import React, { Children } from "react";
import styled from "styled-components";
import { useContext } from "react";
import { useSelector } from "react-redux";
import { State } from "../../reducers/reducer";
import { SceneId, SceneObjectId } from "../../reducers/scenes";
import colors from "../../styles/colors";
import { SceneObjectIcon } from "../Icons/SceneObjectIcons/SceneObjectIcons";

const SceneTreeContext = React.createContext<{
  sceneId?: SceneId;
}>({});

const ObjectContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  margin-top: 10px;
`;

const ChildrenContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 10px;
`;

const ObjectName = styled.span`
  font-family: IBM Plex Mono;
  font-weight: bold;
  font-size: 10px;

  color: ${colors.Primary};
`;

const ObjectDetails = styled.div`
  display: flex;
  flex-direction: column;

  margin-left: 7px;
`;

const ObjectType = styled.span`
  font-family: IBM Plex Mono;
  font-weight: normal;
  font-size: 8px;

  color: #6adbff;
`;

const SceneObject = (props: { objectId: SceneObjectId }) => {
  const { sceneId } = useContext(SceneTreeContext);
  if (!sceneId) {
    throw new Error(
      "Scene Object Component must be inside a Scene Tree Component"
    );
  }

  const object = useSelector(
    (state: State) => state.current.scenes[sceneId].objects[props.objectId]
  );

  return (
    <ObjectContainer>
      <SceneObjectIcon object={object} />
      <ObjectDetails>
        <ObjectName>{object.name}</ObjectName>
        <ObjectType>{object.objectType.toUpperCase()}</ObjectType>
      </ObjectDetails>
    </ObjectContainer>
  );
};

const SceneSubtree = (props: { rootId: SceneObjectId }) => {
  const { sceneId } = useContext(SceneTreeContext);
  if (!sceneId) {
    throw new Error(
      "Scene Subtree Component must be inside a Scene Tree Component"
    );
  }

  const children = useSelector(
    (state: State) =>
      state.current.scenes[sceneId].objects[props.rootId].children
  );

  return (
    <>
      <SceneObject objectId={props.rootId} />
      <ChildrenContainer>
        {children?.map((id) => (
          <SceneSubtree rootId={id} />
        ))}
      </ChildrenContainer>
    </>
  );
};

export default function SceneTree(props: { id: SceneId }) {
  const children = useSelector(
    (state: State) => state.current.scenes[props.id].children
  );

  return (
    <SceneTreeContext.Provider value={{ sceneId: props.id }}>
      {children ? children.map((id) => <SceneSubtree rootId={id} />) : null}
    </SceneTreeContext.Provider>
  );
}
