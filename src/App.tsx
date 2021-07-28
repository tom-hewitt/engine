import { createGlobalStyle } from "styled-components";
import useUndoRedo from "./components/hooks/useUndoRedo";

createGlobalStyle`
    @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;700&display=swap');
`

export default function App() {
    useUndoRedo();
    
    return (
        <div>
            <h1>Hello, world!</h1>
        </div>
    );
};