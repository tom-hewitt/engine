import { useState } from "react";
import GeometryPicker from "../../GeometryPicker/GeometryPicker";
import OpenMenu from "../OpenMenu/OpenMenu";

export default function LiteralGeometry(props: {
  value: string;
  onSubmit: (value: string) => void;
}) {
  const [showPicker, setShowPicker] = useState(false);
  return (
    <>
      <OpenMenu value={props.value} onClick={() => setShowPicker(true)} />
      {showPicker ? (
        <GeometryPicker
          geometry={props.value}
          onCancel={() => setShowPicker(false)}
          onSubmit={props.onSubmit}
        />
      ) : null}
    </>
  );
}
