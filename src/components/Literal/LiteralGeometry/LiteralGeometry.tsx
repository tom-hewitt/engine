import OpenMenu from "../OpenMenu/OpenMenu";

export default function LiteralGeometry(props: {
  value: string;
  onSubmit: (value: string) => void;
}) {
  return <OpenMenu value={props.value} />;
}
