import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
import { State } from "../../reducers/reducer";
import SceneObjectCard from "./SceneObjectCard";
import { selectSceneObject } from "../../reducers/temp";
import { LevelId } from "../../reducers/levels";

const Container = styled.div`
  position: relative;
`;

const CardContainer = styled(motion.div)`
  position: absolute;
  left: 0;
  right: 0;
`;

export default function SelectedSceneObject(props: { level: LevelId }) {
  const dispatch = useDispatch();
  const selectedSceneObject = useSelector(
    (state: State) => state.temp.selectedSceneObject
  );

  return (
    <Container>
      <AnimatePresence>
        {selectedSceneObject ? (
          <CardContainer
            key={selectedSceneObject}
            initial={{ y: 200, scale: 0.9, opacity: 0 }}
            animate={{ y: -25, scale: 1, opacity: 1 }}
            exit={{
              y: 0,
              scale: 0.9,
              opacity: 0,
              transition: {
                duration: 0.2,
              },
            }}
            transition={{ ease: "easeOut", duration: 0.25 }}
          >
            <SceneObjectCard
              key={selectedSceneObject}
              id={selectedSceneObject}
              sceneId="Level 1"
              onClose={() =>
                dispatch(
                  selectSceneObject({ id: undefined, sceneId: props.level })
                )
              }
            />
          </CardContainer>
        ) : null}
      </AnimatePresence>
    </Container>
  );
}
