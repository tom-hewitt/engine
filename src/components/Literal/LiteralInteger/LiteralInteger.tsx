import { useState, useEffect } from "react";
import InputField from "../InputField/InputField";
import typeColors from "../../../styles/typeColors";

export default function LiteralInteger(props: { value: number, onSubmit: (value: number) => void }) {
    const [stringValue, setStringValue] = useState(props.value.toString());

    useEffect(() => {
        setStringValue(props.value.toString());
    }, [props.value]);

    const onChange = (newValue: string) => {
        setStringValue(newValue);
    };

    const onSubmit = () => {
        const newValue = parseInt(stringValue, 10);
        if (!isNaN(newValue) && newValue !== props.value) {
            if (newValue !== props.value) {
                props.onSubmit(newValue);
            }
        } else {
            setStringValue(props.value.toString());
        }
    };

    return <InputField color={typeColors.Integer} value={stringValue} onChange={onChange} onSubmit={onSubmit}/>;
}