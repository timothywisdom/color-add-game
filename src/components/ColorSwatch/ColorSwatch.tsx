import styles from "../../../styles/ColorSwatch.module.css";
import chroma from "chroma-js";

type ColorSwatchProps = {
  color: chroma.Color;
  children?: JSX.Element;
  isMixedColor?: boolean;
  showAnswer?: boolean;
  onClick?: () => void;
};

const ColorSwatch: React.FC<ColorSwatchProps> = ({
  color,
  children,
  isMixedColor = false,
  showAnswer,
  onClick,
}) => {
  return (
    <div
      className={styles.colorSwatch}
      style={{
        backgroundColor: `${color.hex()}`,
        cursor: onClick ? "pointer" : "default",
        border:
          showAnswer && isMixedColor
            ? "4px solid rgb(14, 169, 0)"
            : "4px solid #999",
        color: `${chroma.contrast(color, "#000") < 4.5 ? "#ccc" : "#222"}`,
      }}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default ColorSwatch;
