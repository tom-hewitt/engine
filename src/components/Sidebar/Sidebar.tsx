import { AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { State } from "../../reducers/reducer";
import { selectSceneObject } from "../../reducers/temp";
import LevelCard from "../LevelCard/LevelCard";
import SceneObjectCard from "../SceneObjectCard/SceneObjectCard";

const SidebarContainer = styled.div`
  position: absolute;
  top: 30px;
  right: 30px;
  margin-bottom: 30px;

  display: flex;
  flex-direction: column;

  z-index: 1;
`;

export default function Sidebar() {
  const dispatch = useDispatch();
  const selectedSceneObject = useSelector(
    (state: State) => state.temp.selectedSceneObject
  );

  return (
    <SidebarContainer>
      <LevelCard id="Level 1" />
      <AnimatePresence>
        {selectedSceneObject ? (
          <SceneObjectCard
            key={selectedSceneObject}
            id={selectedSceneObject}
            sceneId="Level 1"
            onClose={() =>
              dispatch(selectSceneObject({ id: undefined, sceneId: "Level 1" }))
            }
          />
        ) : null}
      </AnimatePresence>
    </SidebarContainer>
  );
}
