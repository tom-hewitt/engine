import styled from "styled-components";
import { SceneObject } from "../../../../state/reducers/scenes";

const Container = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  width: 15px;
  height: 100%;
`;

const Icon = styled.svg``;

export const LightIcon = () => {
  return (
    <Icon width="12" height="17" viewBox="0 0 12 17" fill="none">
      <path
        d="M4.33333 15.5833H7.66667M3.5 6.41667C3.7497 4.46703 4.35197 3.99512 6 3.91667M6 1.41667C8.5 1.41667 11 3.08334 11 6.41667C11 9.75001 7.66667 9.75001 7.66667 13.0833H4.33333C4.33333 9.75001 1 9.75001 1 6.41667C1 3.08334 3.5 1.41667 6 1.41667Z"
        stroke="#D6D6D6"
      />
    </Icon>
  );
};

export const MeshIcon = () => {
  return (
    <Icon width="14" height="13" viewBox="0 0 14 13" fill="none">
      <path
        d="M1 6.5L4.27273 11.5909M1 6.5L4.27273 1.40909M1 6.5L6.81818 4.31818M1 6.5L6.81818 8.68182M4.27273 11.5909H10.0909M4.27273 11.5909L6.81818 8.68182M10.0909 11.5909L13 6.5M10.0909 11.5909L6.81818 8.68182M13 6.5L10.0909 1.40909M13 6.5L6.81818 4.31818M13 6.5L6.81818 8.68182M10.0909 1.40909H4.27273M10.0909 1.40909L6.81818 4.31818M4.27273 1.40909L6.81818 4.31818M6.81818 4.31818V8.68182"
        stroke="#D6D6D6"
      />
    </Icon>
  );
};

export function InnerSceneObjectIcon(props: { object: SceneObject }) {
  switch (props.object.type) {
    case "Directional Light": {
      return <LightIcon />;
    }
    case "Mesh": {
      return <MeshIcon />;
    }
  }
}

export function SceneObjectIcon(props: { object: SceneObject }) {
  return (
    <Container>
      <InnerSceneObjectIcon object={props.object} />
    </Container>
  );
}
