import EditorScene from "../EditorScene/EditorScene";
import useUndoRedo from "../hooks/useUndoRedo";

export default function Editor() {
  useUndoRedo();

  return <EditorScene id="Level 1" />;
}
