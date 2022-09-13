import styles from "./Icons.module.css";
import * as FeatherIcons from "react-icons/fi";
import { FaReact } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { addElement } from "../store/elementSlice";
import { nanoid } from "nanoid";
import { toast } from "react-hot-toast";

const Icons = ({ setIconsOpen }) => {
  const dispatch = useDispatch();
  const icons = Object.keys(FeatherIcons);
  const values = Object.values(FeatherIcons);
  const element = FeatherIcons[icons[2]];
  const page = useSelector((state) => state.page.current);

  const addIconHandler = (e) => {
    const name = e.currentTarget.attributes.name.value;

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
      size: 18,
      color: "#FFFFFF",
    };
    console.log(data);
    dispatch(addElement(data));
    setIconsOpen(false);
    toast.success("Icon Added!");
  };

  return (
    <div className={styles.container}>
      <div className={styles.actionContainer}>
        <div className={styles.actionIcon} onClick={(e) => setIconsOpen(false)}>
          <MdClose style={{ fontSize: "18px" }} />
          Close
        </div>
        <div className={styles.actionIcon}>
          <FaReact style={{ fontSize: "18px" }} />
          Powered by React Icons
        </div>
      </div>
      <div className={styles.innerContainer}>
        {values.map((value, index) => {
          return (
            <div
              className={styles.icon}
              key={index}
              onClick={addIconHandler}
              name={icons[index]}
            >
              {value()}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Icons;