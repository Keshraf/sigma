import styles from "../styles/TextForm.module.css";

// Icons
import { TbAlignLeft, TbAlignRight, TbAlignCenter } from "react-icons/tb";

// Other Libs
import { nanoid } from "nanoid";
import toast from "react-hot-toast";

// React & Redux
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addElement, updateTextElement } from "../store/elementSlice";

// Firebase
import { push, set, ref } from "firebase/database";
import { database } from "../firebaseConfig";

// Custom Hook
import useElementUpdate from "../hooks/useElementUpdate";

// Components
import ColorPicker from "./ColorPicker";

const TextForm = () => {
  const dispatch = useDispatch();
  const elementUpdater = useElementUpdate();

  const selected = useSelector((state) => state.selectedElement); // Gets the selected Element
  const page = useSelector((state) => state.page.current); // gets the current page
  const roomId = useSelector((state) => state.room.id); // gets the room id

  // Different states for each text property
  const [content, setContent] = useState("");
  const [color, setColor] = useState("#FFFFFF");
  const [size, setSize] = useState(16);
  const [font, setFont] = useState("Roboto");
  const [weight, setWeight] = useState("400");
  const [align, setAlign] = useState("center");

  // Sets the form
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

  // Updates or Inserts Text
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
      elementUpdater(data);
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

  // Contains all the font data
  const fontsList = [
    {
      fontName: "Roboto",
      weights: [100, 300, 400, 500, 600, 700, 900],
    },
    {
      fontName: "Inter",
      weights: [100, 300, 400, 500, 600, 700, 800, 900],
    },
    {
      fontName: "Poppins",
      weights: [100, 300, 400, 500, 600, 700, 800, 900],
    },
    {
      fontName: "Montserrat",
      weights: [100, 300, 400, 500, 600, 700, 800, 900],
    },
  ];

  // Conatins font weight and its equivalent text form
  const weightDefine = {
    100: "Thin",
    200: "Extra Light",
    300: "Light",
    400: "Regular",
    500: "Medium",
    600: "Semi-Bold",
    700: "Bold",
    800: "Extra Bold",
    900: "Black",
  };

  return (
    <form className={styles.textForm}>
      <input
        type="text"
        placeholder="Enter your text"
        className={styles.inputShaded}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      ></input>

      <select
        name="fonts"
        id="font-select"
        className={styles.inputUnshaded}
        onChange={(e) => {
          setFont(e.target.value);
          setWeight(400);
        }}
        style={{ cursor: "pointer" }}
        value={font}
      >
        {/* Lists all the fonts in the font list */}
        {fontsList.map((fontInfo) => {
          return (
            <option
              value={fontInfo.fontName}
              style={{ fontFamily: fontInfo.fontName }}
              className={styles.options}
              key={fontInfo.fontName}
            >
              {fontInfo.fontName}
            </option>
          );
        })}
      </select>
      <div className={styles.alignRow}>
        <select
          name="weight"
          id="font-weight"
          className={styles.inputUnshaded}
          onChange={(e) => setWeight(e.target.value)}
          style={{ cursor: "pointer" }}
        >
          {/* Lists all the font weights that are available for the chosen font */}
          {fontsList.map((fontInfo) => {
            if (fontInfo.fontName === font) {
              return fontInfo.weights.map((weight) => {
                const weightName = weightDefine[weight];
                return (
                  <option
                    value={weight}
                    className={styles.options}
                    key={`${font}_${weightName}`}
                    style={{ fontWeight: weight }}
                  >
                    {weightName}
                  </option>
                );
              });
            }
          })}
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
                align === "left" ? "#303544" : "transparent"
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
                align === "center" ? "#303544" : "transparent"
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
                align === "right" ? "#303544" : "transparent"
              }`,
            }}
            onClick={(e) => setAlign("right")}
          >
            <TbAlignRight style={{ fontSize: "24px" }} />
          </div>
        </div>
        <ColorPicker color={color} setColor={setColor} />
      </div>
      <button className={styles.submitButton} onClick={clickHandler}>
        {selected.type === "text" ? "Update Text" : "Insert Text"}
      </button>
    </form>
  );
};

export default TextForm;
