import styled from "styled-components";
import EditorScene from "../EditorScene/EditorScene";
import useUndoRedo from "../hooks/useUndoRedo";
import LevelCard from "../LevelCard/LevelCard";
import Sidebar from "../Sidebar/Sidebar";

const Container = styled.div`
  position: relative;

  width: 100%;
  height: 100%;
`;

const SceneContainer = styled.div`
  position: absolute;
  z-index: 0;

  width: 100%;
  height: 100%;
`;

export default function Editor() {
  useUndoRedo();

  return (
    <Container>
      <SceneContainer>
        <EditorScene id="Level 1" />
      </SceneContainer>
      <Sidebar />
    </Container>
  );
}
