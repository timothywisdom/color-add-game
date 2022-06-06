import styles from "../../../styles/ColorSwatch.module.css";

type ColorSwatchProps = {
  color: string;
  hex: string;
  isMixedColor?: boolean;
  showAnswer?: boolean;
  onClick?: () => void;
};

const ColorSwatch: React.FC<ColorSwatchProps> = ({
  color,
  hex,
  isMixedColor = false,
  showAnswer,
  onClick,
}) => {
  return (
    <div
      className={styles.colorSwatch}
      style={{
        backgroundColor: `${color}`,
        cursor: onClick ? "pointer" : "default",
        border:
          showAnswer && isMixedColor
            ? "4px solid rgb(14, 169, 0)"
            : "4px solid #999",
      }}
      onClick={onClick}
    >
      {hex}
    </div>
  );
};

export default ColorSwatch;
