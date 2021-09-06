import { motion } from "framer-motion";
import colors from "../../../styles/colors";
import hexToRGB from "../../../utilities/hexToRGB";
import "./OpenMenu.scss";

const background = hexToRGB(colors.Primary, "0");
const focusedBackground = hexToRGB(colors.Primary, "0.1");

export default function OpenMenu(props: { value: string }) {
  return (
    <motion.div
      className="openMenuContainer"
      whileTap={{ scale: 0.99 }}
      animate={{ backgroundColor: background }}
      whileHover={{ backgroundColor: focusedBackground }}
    >
      <span className="openMenuText">{props.value}</span>
    </motion.div>
  );
}
