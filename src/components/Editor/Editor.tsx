import styled from "styled-components";
import EditorScene from "../EditorScene/EditorScene";
import useUndoRedo from "../hooks/useUndoRedo";
import LevelCard from "../LevelCard/LevelCard";

const OverlayContainer = styled.div`
  position: relative;

  width: 100%;
  height: 100%;
`;

const SceneContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;

  z-index: 0;

  width: 100%;
  height: 100%;
`;

const UI = styled.div`
  z-index: 10;
`;

export default function Editor() {
  useUndoRedo();

  return (
    <OverlayContainer>
      <SceneContainer>
        <EditorScene id="Level 1" />
      </SceneContainer>
      <UI>
        <LevelCard id="Level 1" />
      </UI>
    </OverlayContainer>
  );
}
