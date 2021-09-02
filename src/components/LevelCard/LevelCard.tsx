import { useSelector } from "react-redux";
import { LevelId } from "../../reducers/levels";
import { State } from "../../reducers/reducer";
import { Card, Header, SubHeading, SubTitle, Title } from "../Card/Card";
import SceneTree from "../SceneTree/SceneTree";

export default function LevelCard(props: { id: LevelId }) {
  const level = useSelector((state: State) => state.current.levels[props.id]);

  const isItemSelected = useSelector(
    (state: State) => state.temp.selectedSceneObject !== undefined
  );

  return (
    <Card
      width="400px"
      animate={{
        scale: isItemSelected ? 0.95 : 1,
        opacity: isItemSelected ? 0.97 : 1,
      }}
      transition={{ ease: "easeOut" }}
    >
      <Header>
        <Title>{level.name}</Title>
        <SubTitle color={"#FF6A6A"}>LEVEL</SubTitle>
      </Header>
      <SubHeading>SCENE</SubHeading>
      <SceneTree id={level.scene} />
    </Card>
  );
}
