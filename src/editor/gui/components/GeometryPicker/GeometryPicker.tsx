import { motion } from "framer-motion";
import { CloseButton } from "../Card/Card";
import Modal from "../Modal/Modal";
import styles from "./GeometryPicker.module.scss";

const geometries = {
  primitive: ["Box", "Plane"],
};

function Geometry(props: { geometry: string; onClick: () => void }) {
  return (
    <motion.div
      className={styles.geometry}
      initial={{ backgroundColor: "rgba(48, 48, 48, 0.5)" }}
      whileHover={{ backgroundColor: "rgba(48, 48, 48, 1)" }}
      onClick={props.onClick}
    >
      <canvas height="60px"></canvas>
      <span className={styles.geometryName}>{props.geometry}</span>
    </motion.div>
  );
}

export default function GeometryPicker(props: {
  geometry: string;
  onSubmit: (geometry: string) => void;
  onCancel: () => void;
}) {
  return (
    <Modal onClick={props.onCancel}>
      <motion.div
        className={styles.container}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.horizontal}>
          <div className={styles.sidebar}>
            <span className={styles.categoriesTitle}>CATEGORIES</span>
            <span className={styles.category}>Primitive</span>
          </div>
          <div className={styles.main}>
            <div className={styles.headerBar}>
              <CloseButton onClick={props.onCancel} />
            </div>
            <div className={styles.grid}>
              {geometries.primitive.map((geometry) => (
                <Geometry
                  key={geometry}
                  geometry={geometry}
                  onClick={() => props.onSubmit(geometry)}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </Modal>
  );
}
