import styles from "../styles/ColorPicker.module.css";

import { toast } from "react-hot-toast";

const ColorPicker = ({ color, setColor }) => {
  // Sets Color and Warns on & Resets wrong input
  const colorBlurHandler = (e) => {
    const value = e.target.value;
    if (value.length < 7) {
      toast.error("Invalid Color Input");
      setColor("#FFFFFF");
      return;
    }
    if (!value.startsWith("#")) {
      toast.error(`Add '#' to your Color Input`);
      setColor("#FFFFFF");
      return;
    }
  };

  return (
    <div className={styles.alignBox}>
      <label
        htmlFor="color"
        className={styles.colorLabel}
        style={{ backgroundColor: color }}
      ></label>
      <input
        id="color"
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        style={{ display: "none", backgroundColor: color }}
      />
      <input
        type="text"
        value={color.toUpperCase()}
        onBlur={colorBlurHandler}
        onChange={(e) => setColor(e.target.value)}
        className={styles.colorInputText}
      ></input>
    </div>
  );
};

export default ColorPicker;
