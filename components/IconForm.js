import styles from "../styles/IconForm.module.css";

// Icons
import { FiFeather } from "react-icons/fi";

// React
import { useState } from "react";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { addElement, updateIconElement } from "../store/elementSlice";

// Other libs
import { nanoid } from "nanoid";
import { toast } from "react-hot-toast";

// Components
import ColorPicker from "./ColorPicker";
import Icons from "./Icons";

// Firebase
import { push, set, ref } from "firebase/database";
import { database } from "../firebaseConfig";

// Custom Hook
import useElementUpdate from "../hooks/useElementUpdate";
import { useEffect } from "react";

const IconForm = () => {
  const dispatch = useDispatch();
  const elementUpdater = useElementUpdate();

  const page = useSelector((state) => state.page.current); // Gets the current page
  const roomId = useSelector((state) => state.room.id); // Gets the current room id
  const selected = useSelector((state) => state.selectedElement); // Gets the selected Element

  const [iconsOpen, setIconsOpen] = useState(false); // Icons Modal State
  const [color, setColor] = useState("#FFFFFF");
  const [size, setSize] = useState(16);
  const [name, setName] = useState(null);

  useEffect(() => {
    if (selected.type === "icon") {
      setColor(selected.color);
      setSize(selected.size);
    }
  }, [selected]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (!name && selected.type !== "icon") {
      toast.error("Choose an icon!");
      return;
    }
    if (selected.type === "icon") {
      // Updates the selected icon
      const data = {
        id: selected.id,
        size,
        color,
      };
      dispatch(updateIconElement(data));
      elementUpdater(data);
      toast.success("Icon Updated!");
    } else {
      // Adds a new icon
      const data = {
        page,
        id: nanoid(),
        width: 55,
        height: 55,
        x: 15,
        y: 15,
        type: "icon",
        name,
        set: "feather",
        size,
        color,
        roomId,
      };
      dispatch(addElement(data));
      const elementRef = ref(database, "elements/" + roomId);
      set(push(elementRef), data);
      setIconsOpen(false);
      toast.success("Icon Added!");
    }
  };

  return (
    <>
      {iconsOpen && <Icons setIconsOpen={setIconsOpen} setName={setName} />}
      <form>
        {selected.type !== "icon" && (
          <div
            className={styles.clickButtonUnshaded}
            style={{ cursor: "pointer" }}
            onClick={(e) => setIconsOpen(true)}
          >
            <FiFeather style={{ fontSize: "24px" }} />
            Launch Feather Icons
          </div>
        )}
        <div className={styles.alignRow}>
          <input
            type="number"
            className={styles.inputUnshaded}
            min="16"
            max="200"
            value={size}
            onChange={(e) => setSize(e.target.value)}
          />
          <ColorPicker color={color} setColor={setColor} />
        </div>
        <button className={styles.submitButton} onClick={submitHandler}>
          {selected.type === "icon" ? "Update Icon" : "Insert Icon"}
        </button>
      </form>
    </>
  );
};

export default IconForm;
