import { useState, useEffect } from "react";
import InputField from "../InputField/InputField";
import typeColors from "../../../styles/typeColors";

export default function LiteralString(props: { value: string, onSubmit: (value: string) => void }) {
    const [stringValue, setStringValue] = useState(props.value.toString());

    useEffect(() => {
        setStringValue(props.value);
    }, [props.value]);

    const onChange = (newValue: string) => {
        setStringValue(newValue);
    };

    const onSubmit = () => {
        if (stringValue !== props.value) {
            props.onSubmit(stringValue);
        }
    };

    return <InputField color={typeColors.String} value={stringValue} onChange={onChange} onSubmit={onSubmit}/>;
};