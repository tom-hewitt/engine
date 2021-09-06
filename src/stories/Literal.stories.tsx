import React from "react";
import { Story, Meta } from "@storybook/react";
import Literal, {
  LiteralProps,
} from "../editor/gui/components/Literal/Literal";

export default {
  component: Literal,
  title: "Components/Literal/Literal",
} as Meta;

const Template: Story<LiteralProps> = (args) => <Literal {...args} />;

export const Boolean = Template.bind({});

Boolean.args = { type: "Boolean", value: false };

export const String = Template.bind({});

String.args = { type: "String", value: "Hello" };

export const Integer = Template.bind({});

Integer.args = { type: "Integer", value: 10 };

export const Float = Template.bind({});

Float.args = { type: "Float", value: 2.5 };

export const Vector3 = Template.bind({});

Vector3.args = { type: "Vector3D", value: { x: 5.6, y: 0.1, z: 10.4 } };

export const Geometry = Template.bind({});

Geometry.args = { type: "Geometry", value: "Box" };
