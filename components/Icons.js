import styles from "../styles/Icons.module.css";

// Imports all the icons in feather icons
import * as FeatherIcons from "react-icons/fi";

// Icons
import { FaReact } from "react-icons/fa";
import { MdClose } from "react-icons/md";

const Icons = ({ setIconsOpen, setName }) => {
  const icons = Object.keys(FeatherIcons);
  const values = Object.values(FeatherIcons);

  const addIconHandler = (e) => {
    // Gets the name of the icon that was passed to the attribute name while rendering the icon
    const name = e.currentTarget.attributes.name.value;
    setName(name);
  };

  return (
    <div className={styles.container} onClick={() => setIconsOpen(false)}>
      <div className={styles.actionContainer}>
        <div className={styles.actionIcon} onClick={() => setIconsOpen(false)}>
          <MdClose style={{ fontSize: "18px" }} />
          Close
        </div>
        <div className={styles.actionIcon}>
          <FaReact style={{ fontSize: "18px" }} />
          Powered by React Icons
        </div>
      </div>
      <div className={styles.innerContainer}>
        {/* It maps over each function in the react-icons package and executes it */}
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
