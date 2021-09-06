import { useEffect } from "react";
import { useRef } from "react";
import { useStore } from "react-redux";
import styled from "styled-components";
import { EditorScene } from "../../../sceneRenderer/scene";

const Canvas = styled.canvas`
  width: 100%;
  height: 100%;
`;

export default function EditorSceneView(props: { id: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);

  const store = useStore();

  useEffect(() => {
    if (!canvas.current) throw new Error("Canvas is null");

    const scene = new EditorScene(canvas.current, store, props.id);

    return scene.dispose;
  }, [canvas, store, props.id]);

  return <Canvas ref={canvas} />;
}
