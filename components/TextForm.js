import { useEffect, useState } from "react";
import { TbAlignLeft, TbAlignRight, TbAlignCenter } from "react-icons/tb";
import styles from "./TextForm.module.css";
import { nanoid } from "nanoid";
import { useDispatch, useSelector } from "react-redux";
import { addElement, updateTextElement } from "../store/elementSlice";
import toast from "react-hot-toast";
import { push, set, ref } from "firebase/database";
import { database } from "../firebaseConfig";

const TextForm = () => {
  const selected = useSelector((state) => state.selectedElement);
  const page = useSelector((state) => state.page.current);
  const roomId = useSelector((state) => state.room.id);
  const [content, setContent] = useState("");
  const [color, setColor] = useState("#FFFFFF");
  const [size, setSize] = useState(16);
  const [font, setFont] = useState("Roboto");
  const [weight, setWeight] = useState("400");
  const [align, setAlign] = useState("center");

  useEffect(() => {
    if (selected.type === "text") {
      setContent(selected.content);
      setColor(selected.color);
      setSize(selected.size);
      setFont(selected.font);
      setWeight(selected.weight);
      setAlign(selected.align);
    } else {
      setContent("");
      setColor("#FFFFFF");
      setSize(16);
      setFont("Roboto");
      setWeight("400");
      setAlign("center");
    }
  }, [selected]);

  const dispatch = useDispatch();

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

  const clickHandler = (e) => {
    e.preventDefault();
    if (content === "") {
      toast.error("Can't Insert Empty Text!");
      return;
    }

    if (selected.type === "text") {
      const data = {
        id: selected.id,
        content,
        color,
        size,
        font,
        weight,
        align,
      };
      dispatch(updateTextElement(data));
      toast.success("Text Updated!");
    } else {
      const data = {
        id: nanoid(),
        content,
        color,
        size,
        font,
        weight,
        align,
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        type: "text",
        page,
        roomId,
      };

      dispatch(addElement(data));
      const elementRef = ref(database, "elements/" + roomId);
      set(push(elementRef), data);
      toast.success("Text Added!");
      setContent("");
    }
  };

  return (
    <form className={styles.textForm}>
      <input
        type="text"
        placeholder="Untitled"
        className={styles.inputShaded}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      ></input>

      <select
        name="fonts"
        id="font-select"
        className={styles.inputUnshaded}
        onChange={(e) => setFont(e.target.value)}
        style={{ cursor: "pointer" }}
        value={font}
      >
        <option
          value="Roboto"
          className={styles.options}
          style={{ fontFamily: "Roboto" }}
        >
          Roboto
        </option>
        <option
          value="Inter"
          className={styles.options}
          style={{ fontFamily: "Inter" }}
        >
          Inter
        </option>
        <option
          value="Poppins"
          className={styles.options}
          style={{ fontFamily: "Poppins" }}
        >
          Poppins
        </option>
        <option
          value="Montserrat"
          className={styles.options}
          style={{ fontFamily: "Montserrat" }}
        >
          Montserrat
        </option>
      </select>
      <div className={styles.alignRow}>
        <select
          name="weight"
          id="font-weight"
          className={styles.inputUnshaded}
          onChange={(e) => setWeight(e.target.value)}
          style={{ cursor: "pointer" }}
        >
          <option value="400" className={styles.options}>
            Light
          </option>
          <option value="500" className={styles.options}>
            Regular
          </option>
          <option value="700" className={styles.options}>
            Bold
          </option>
        </select>
        <input
          type="number"
          className={styles.inputUnshaded}
          min="16"
          max="64"
          value={size}
          onChange={(e) => setSize(e.target.value)}
        />
      </div>
      <div className={styles.alignRow}>
        <div className={styles.alignBox}>
          <div
            className={styles.alignDiv}
            style={{
              backgroundColor: `${
                align === "left" ? "#121219" : "transparent"
              }`,
            }}
            onClick={(e) => setAlign("left")}
          >
            <TbAlignLeft style={{ fontSize: "24px" }} />
          </div>
          <div
            className={styles.alignDiv}
            style={{
              backgroundColor: `${
                align === "center" ? "#121219" : "transparent"
              }`,
            }}
            onClick={(e) => setAlign("center")}
          >
            <TbAlignCenter style={{ fontSize: "24px" }} />
          </div>

          <div
            className={styles.alignDiv}
            style={{
              backgroundColor: `${
                align === "right" ? "#121219" : "transparent"
              }`,
            }}
            onClick={(e) => setAlign("right")}
          >
            <TbAlignRight style={{ fontSize: "24px" }} />
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
      </div>
      <button className={styles.submitButton} onClick={clickHandler}>
        Insert
      </button>
    </form>
  );
};

export default TextForm;
