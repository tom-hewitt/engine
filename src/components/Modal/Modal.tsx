import React from "react";
import ReactDOM from "react-dom";
import { motion } from "framer-motion";
import "./Modal.scss";

export default function Modal(props: {
  children?: React.ReactNode;
  onClick?: () => void;
}) {
  return ReactDOM.createPortal(
    <motion.div
      className="modal"
      onClick={props.onClick}
      animate={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
    >
      {props.children}
    </motion.div>,
    document.body
  );
}
