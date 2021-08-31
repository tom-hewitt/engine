import styled from "styled-components";
import { SceneObject } from "../../../reducers/scenes";

const Icon = styled.svg``;

export const LightIcon = () => {
  return (
    <Icon width="12" height="17" viewBox="0 0 12 17">
      <path
        d="M4.33333 15.5833H7.66667M3.5 6.41667C3.7497 4.46703 4.35197 3.99512 6 3.91667M6 1.41667C8.5 1.41667 11 3.08334 11 6.41667C11 9.75001 7.66667 9.75001 7.66667 13.0833H4.33333C4.33333 9.75001 1 9.75001 1 6.41667C1 3.08334 3.5 1.41667 6 1.41667Z"
        stroke="#D6D6D6"
      />
    </Icon>
  );
};

export function SceneObjectIcon(props: { object: SceneObject }) {
  switch (props.object.objectType) {
    default: {
      return <LightIcon />;
    }
  }
}
