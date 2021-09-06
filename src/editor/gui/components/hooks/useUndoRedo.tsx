import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { redo, undo } from "../../../state/reducers/reducer";

export default function useUndoRedo() {
  const dispatch = useDispatch();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey) {
        switch (event.key) {
          case "z": {
            if (event.shiftKey) {
              console.log("redo");
              dispatch(redo());
            } else {
              console.log("undo");
              dispatch(undo());
            }
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Cleanup
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [dispatch]);
}
