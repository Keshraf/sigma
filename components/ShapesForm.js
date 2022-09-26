import styles from "../styles/ShapesForm.module.css";

// Other libs
import { nanoid } from "nanoid";
import toast from "react-hot-toast";

// React & Redux
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addElement, updateShapeElement } from "../store/elementSlice";

// Firebase
import { push, set, ref } from "firebase/database";
import { database } from "../firebaseConfig";

// Custom Hook
import useElementUpdate from "../hooks/useElementUpdate";

const ShapesForm = () => {
  const dispatch = useDispatch();
  const elementUpdater = useElementUpdate();

  const [shapeSelected, setShapeSelected] = useState(null);
  const [color, setColor] = useState("#FFFFFF");

  const page = useSelector((state) => state.page.current); // gets the current page
  const roomId = useSelector((state) => state.room.id); // gets the current room id
  const selected = useSelector((state) => state.selectedElement); // Gets the selected Element

  useEffect(() => {
    if (isShape) {
      setColor(selected.color);
    } else {
      setColor("#FFFFFF");
    }
  }, [isShape, selected.color]);

  // Sets Color and Warns on wrong input
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

  const submitHandler = () => {
    console.log("Entered", selected);
    if (isShape) {
      const data = {
        color,
        id: selected.id,
      };
      dispatch(updateShapeElement(data));
      elementUpdater(data);
      toast.success(`${shapeSelected} color changed!`);
    } else {
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
    }
  };

  const shapes = ["square", "circle", "line", "triangle"];
  const isShape = selected.type === "shape";

  return (
    <div className={styles.formLayout}>
      {!isShape && (
        <div className={styles.shapesLayout}>
          {shapes.map((shape) => {
            return (
              <div
                className={styles.shapesContainer}
                onClick={() => setShapeSelected(shape)}
                style={{
                  borderColor: shapeSelected === shape ? "#2599FF" : "#171720",
                }}
                key={shape}
              >
                <div
                  className={styles[shape]}
                  style={{ backgroundColor: color }}
                ></div>
              </div>
            );
          })}
        </div>
      )}
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
        {isShape
          ? "Change Color"
          : `Insert ${shapeSelected === null ? "" : shapeSelected}`}
      </button>
    </div>
  );
};

export default ShapesForm;
