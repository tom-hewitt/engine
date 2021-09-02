import React from "react";
import styled from "styled-components";
import { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { State } from "../../reducers/reducer";
import { SceneId, SceneObjectId } from "../../reducers/scenes";
import colors from "../../styles/colors";
import { SceneObjectIcon } from "../Icons/SceneObjectIcons/SceneObjectIcons";
import { motion } from "framer-motion";
import { useState } from "react";
import { selectSceneObject } from "../../reducers/temp";

const SceneTreeContext = React.createContext<{
  sceneId?: SceneId;
}>({});

const ObjectContainer = styled(motion.div)`
  display: flex;
  flex-direction: row;
  align-items: center;

  padding: 5px 5px 5px 7px;

  margin-top: 7px;

  border-radius: 5px;

  user-select: none;
  cursor: pointer;
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
  const [isHovered, setIsHovered] = useState(false);
  const { sceneId } = useContext(SceneTreeContext);
  if (!sceneId) {
    throw new Error(
      "Scene Object Component must be inside a Scene Tree Component"
    );
  }

  const dispatch = useDispatch();

  const object = useSelector(
    (state: State) => state.current.scenes[sceneId].objects[props.objectId]
  );

  const isSelected = useSelector(
    (state: State) => state.temp.selectedSceneObject === props.objectId
  );

  return (
    <ObjectContainer
      animate={{
        backgroundColor: isSelected
          ? "rgba(255, 255, 255, 0.2)"
          : isHovered
          ? "rgba(255, 255, 255, 0.1)"
          : "rgba(255, 255, 255, 0)",
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() =>
        dispatch(selectSceneObject({ id: props.objectId, sceneId }))
      }
    >
      <SceneObjectIcon object={object} />
      <ObjectDetails>
        <ObjectName>{object.name}</ObjectName>
        <ObjectType>{object.type.toUpperCase()}</ObjectType>
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
          <SceneSubtree rootId={id} key={id} />
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
      {children
        ? children.map((id) => <SceneSubtree rootId={id} key={id} />)
        : null}
    </SceneTreeContext.Provider>
  );
}
