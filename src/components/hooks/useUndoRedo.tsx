import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { redo, undo } from "../../reducers/reducer";

export default function useUndoRedo() {
    const dispatch = useDispatch();

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

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);

        // Cleanup
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);
};