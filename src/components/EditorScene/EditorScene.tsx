import { useEffect } from "react";
import { useRef } from "react";
import { useStore } from "react-redux";
import styled from "styled-components";
import { setupScene } from "../../editor/scene";

const Canvas = styled.canvas`
  width: 100%;
  height: 100%;
`;

export default function EditorScene(props: { id: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);

  const store = useStore();

  useEffect(() => {
    if (!canvas.current) throw new Error("Canvas is null");

    setupScene(canvas.current, store, props.id);
  });

  return <Canvas ref={canvas} />;
}
