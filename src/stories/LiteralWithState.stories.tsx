import React, { useState } from "react";
import { Meta } from "@storybook/react";
import Literal from "../components/Literal/Literal";

export default {
    title: "Components/Literal/With State"
} as Meta;

export const Boolean = () => {
    const [value, setValue] = useState(false);
    return <Literal type="Boolean" value={value} onSubmit={(literal) => setValue(literal.value)}/>;
};

export const String = () => {
    const [value, setValue] = useState("Hello");
    return <Literal type="String" value={value} onSubmit={(literal) => setValue(literal.value)}/>;
};

export const Integer = () => {
    const [value, setValue] = useState(10);
    return <Literal type="Integer" value={value} onSubmit={(literal) => setValue(literal.value)}/>;
};

export const Float = () => {
    const [value, setValue] = useState(2.5);
    return <Literal type="Float" value={value} onSubmit={(literal) => setValue(literal.value)}/>;
};

export const Vector3D = () => {
    const [value, setValue] = useState({ x: 5.6, y: 0.1, z: 10.4 });
    return <Literal type="3D Vector" value={value} onSubmit={(literal) => setValue(literal.value)}/>;
};