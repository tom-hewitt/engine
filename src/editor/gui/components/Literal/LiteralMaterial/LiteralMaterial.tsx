import OpenMenu from "../OpenMenu/OpenMenu";

export default function LiteralMaterial(props: {
  value: string;
  onSubmit: (value: string) => void;
}) {
  return <OpenMenu value={props.value} />;
}
