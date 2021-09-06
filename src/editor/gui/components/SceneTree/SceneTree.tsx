import React from "react";
import styled from "styled-components";
import { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { State } from "../../../state/reducers/reducer";
import { SceneId, SceneObjectId } from "../../../state/reducers/scenes";
import colors from "../../styles/colors";
import { SceneObjectIcon } from "../Icons/SceneObjectIcons/SceneObjectIcons";
import { motion } from "framer-motion";
import { useState } from "react";
import { selectSceneObject } from "../../../state/reducers/temp";
import hexToRGB from "../../utilities/hexToRGB";

const SceneTreeContext = React.createContext<{
  sceneId?: SceneId;
}>({});

const ObjectContainer = styled(motion.div)<{ margin?: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;

  ${(props) => (props.margin ? "margin-top: 3px;" : "")}

  padding: 7px;

  border-radius: 5px;

  user-select: none;
  cursor: pointer;
`;

const ChildrenHorizontalContainer = styled.div`
  display: flex;
  flex-direction: row;

  margin-top: 3px;
`;

const ChildrenContainer = styled.div`
  display: flex;
  flex-direction: column;

  width: 100%;
`;

const ChildrenLineContainer = styled(motion.div)`
  display: flex;
  flex-direction: row;

  cursor: pointer;
`;

const ChildrenLine = styled(motion.div)`
  margin-left: 14px;
  margin-right: 7px;

  height: inherit;
  width: 1px;
`;

const ExpandContainer = styled(motion.div)`
  display: flex;
  flex-direction: row;
  align-items: center;

  margin-top: 5px;
  margin-left: 11px;

  cursor: pointer;
`;

const ExpandText = styled.span`
  font-family: IBM Plex Mono;
  font-weight: normal;
  font-size: 8px;

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

const SceneObject = (props: { objectId: SceneObjectId; margin?: boolean }) => {
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
          ? "rgba(255, 255, 255, 0.1)"
          : isHovered
          ? "rgba(255, 255, 255, 0.05)"
          : "rgba(255, 255, 255, 0)",
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() =>
        dispatch(selectSceneObject({ id: props.objectId, sceneId }))
      }
      margin={props.margin}
    >
      <SceneObjectIcon object={object} />
      <ObjectDetails>
        <ObjectName>{object.name}</ObjectName>
        <ObjectType>{object.type.toUpperCase()}</ObjectType>
      </ObjectDetails>
    </ObjectContainer>
  );
};

const SceneObjectChildren = (props: { rootId: SceneObjectId }) => {
  const { sceneId } = useContext(SceneTreeContext);
  if (!sceneId) {
    throw new Error(
      "Scene Object Children must be inside a Scene Tree Component"
    );
  }

  const children = useSelector(
    (state: State) =>
      state.current.scenes[sceneId].objects[props.rootId].children
  );

  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return children ? (
    isExpanded ? (
      <ChildrenHorizontalContainer>
        <ChildrenLineContainer
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          onClick={() => {
            setIsExpanded(false);
            setIsHovered(false);
          }}
        >
          <ChildrenLine
            animate={{
              backgroundColor: isHovered
                ? colors.Primary
                : hexToRGB(colors.Primary, "0.4"),
            }}
          />
        </ChildrenLineContainer>
        <ChildrenContainer>
          {children.map((id, index) => (
            <SceneSubtree rootId={id} key={id} margin={index !== 0} />
          ))}
        </ChildrenContainer>
      </ChildrenHorizontalContainer>
    ) : (
      <ExpandContainer
        onClick={() => {
          setIsExpanded(true);
          setIsHovered(false);
        }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        animate={{
          color: isHovered ? colors.Primary : hexToRGB(colors.Primary, "0.4"),
        }}
      >
        <motion.svg
          width="7"
          height="5"
          viewBox="0 0 7 5"
          animate={{
            stroke: isHovered
              ? colors.Primary
              : hexToRGB(colors.Primary, "0.6"),
          }}
        >
          <path d="M1 0.5L3.5 3.5L6 0.5" />
        </motion.svg>
        <ExpandText>
          {children.length} {children.length > 1 ? "CHILDREN" : "CHILD"}
        </ExpandText>
      </ExpandContainer>
    )
  ) : null;
};

const SceneSubtree = (props: { rootId: SceneObjectId; margin?: boolean }) => {
  const { sceneId } = useContext(SceneTreeContext);
  if (!sceneId) {
    throw new Error(
      "Scene Subtree Component must be inside a Scene Tree Component"
    );
  }

  return (
    <>
      <SceneObject objectId={props.rootId} margin={props.margin} />
      <SceneObjectChildren rootId={props.rootId} />
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
        ? children.map((id) => <SceneSubtree rootId={id} key={id} margin />)
        : null}
    </SceneTreeContext.Provider>
  );
}
