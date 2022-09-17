import { nanoid } from "nanoid";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { addElement } from "../store/elementSlice";
import styles from "./ShapesForm.module.css";
import { push, set, ref } from "firebase/database";
import { database } from "../firebaseConfig";

const ShapesForm = () => {
  const [shapeSelected, setShapeSelected] = useState(null);
  const [color, setColor] = useState("#FFFFFF");
  const dispatch = useDispatch();
  const page = useSelector((state) => state.page.current);
  const roomId = useSelector((state) => state.room.id);

  const colorBlurHandler = (e) => {
    const value = e.target.value;
    const x = "#123456";
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

  const submitHandler = () => {
    if (shapeSelected === null) {
      return;
    }
    const data = {
      id: nanoid(),
      x: 15,
      y: 15,
      width: 100,
      height: 100,
      type: "shape",
      shape: shapeSelected,
      color,
      page,
      roomId,
    };
    dispatch(addElement(data));
    const elementRef = ref(database, "elements/" + roomId);
    set(push(elementRef), data);
    toast.success(`${shapeSelected} added!`);
  };

  return (
    <div className={styles.formLayout}>
      <div className={styles.shapesLayout}>
        <div
          className={styles.shapesContainer}
          onClick={() => setShapeSelected("square")}
          style={{
            borderColor: shapeSelected === "square" ? "#2599FF" : "#171720",
          }}
        >
          <div
            className={styles.square}
            style={{ backgroundColor: color }}
          ></div>
        </div>
        <div
          className={styles.shapesContainer}
          onClick={() => setShapeSelected("circle")}
          style={{
            borderColor: shapeSelected === "circle" ? "#2599FF" : "#171720",
          }}
        >
          <div
            className={styles.circle}
            style={{ backgroundColor: color }}
          ></div>
        </div>
        <div
          className={styles.shapesContainer}
          onClick={() => setShapeSelected("line")}
          style={{
            borderColor: shapeSelected === "line" ? "#2599FF" : "#171720",
          }}
        >
          <div className={styles.line} style={{ backgroundColor: color }}></div>
        </div>
        <div
          className={styles.shapesContainer}
          onClick={() => setShapeSelected("triangle")}
          style={{
            borderColor: shapeSelected === "triangle" ? "#2599FF" : "#171720",
          }}
        >
          <div
            className={styles.triangle}
            style={{ backgroundColor: color }}
          ></div>
        </div>
      </div>
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
      <button className={styles.submitButton} onClick={submitHandler}>
        Insert
      </button>
    </div>
  );
};

export default ShapesForm;
