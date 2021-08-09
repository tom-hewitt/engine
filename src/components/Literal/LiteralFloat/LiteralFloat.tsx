import { useState, useEffect } from "react";
import InputField from "../InputField/InputField";
import typeColors from "../../../styles/typeColors";

export default function LiteralFloat(props: { value: number, onSubmit: (value: number) => void }) {
    const [stringValue, setStringValue] = useState(props.value.toString());

    useEffect(() => {
        setStringValue(props.value.toString());
    }, [props.value]);

    const onChange = (newValue: string) => {
        setStringValue(newValue);
    };

    const onSubmit = () => {
        const newValue = parseFloat(stringValue);
        if (!isNaN(newValue) && newValue !== props.value) {
            if (newValue !== props.value) {
                props.onSubmit(newValue);
            }
        } else {
            setStringValue(props.value.toString());
        }
    };

    return <InputField color={typeColors.Float} value={stringValue} onChange={onChange} onSubmit={onSubmit}/>;
};