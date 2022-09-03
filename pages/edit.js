import {
  TbSquaresFilled,
  TbTextResize,
  TbAlignLeft,
  TbAlignRight,
  TbAlignCenter,
} from "react-icons/tb";
import { IoMdImage } from "react-icons/io";
import { AiOutlineUserAdd, AiOutlinePlus } from "react-icons/ai";
import { FaShapes } from "react-icons/fa";
import styles from "../styles/Edit.module.css";
import Board from "../components/Board";

const Edit = () => {
  console.log(styles.navButton);
  return (
    <div className={styles.container}>
      <nav className={styles.nav}>
        <input
          type="text"
          placeholder="File Name"
          className={styles.inputShaded}
        ></input>
        <button className={`${styles.navButton} ${styles.navButtonActive}`}>
          <TbTextResize style={{ fontSize: "24px" }} />
          Text
        </button>
        <button className={`${styles.navButton}`}>
          <TbSquaresFilled style={{ fontSize: "24px" }} />
          Background
        </button>
        <button className={`${styles.navButton}`}>
          <IoMdImage style={{ fontSize: "24px" }} />
          Image
        </button>
        <button className={`${styles.navButton}`}>
          <FaShapes style={{ fontSize: "24px" }} />
          Shapes
        </button>
        <div className={styles.divider}></div>
        <form className={styles.textForm}>
          <input
            type="text"
            placeholder="Untitled"
            className={styles.inputShaded}
          ></input>

          <select
            name="fonts"
            id="font-select"
            className={styles.inputUnshaded}
          >
            <option value="roboto" className={styles.options}>
              Roboto
            </option>
            <option value="inter" className={styles.options}>
              Inter
            </option>
            <option value="poppins" className={styles.options}>
              Poppins
            </option>
            <option value="montserrat" className={styles.options}>
              Montserrat
            </option>
          </select>
          <div className={styles.alignRow}>
            <select
              name="weight"
              id="font-weight"
              className={styles.inputUnshaded}
            >
              <option value="light">Light</option>
              <option value="regular">Regular</option>
              <option value="bold">Bold</option>
            </select>
            <input
              type="number"
              className={styles.inputUnshaded}
              min="16"
              max="64"
            />
          </div>
          <div className={styles.alignRow}>
            <div className={styles.alignBox}>
              <div>
                <TbAlignLeft style={{ fontSize: "24px" }} />
              </div>
              <div>
                <TbAlignCenter style={{ fontSize: "24px" }} />
              </div>

              <div>
                <TbAlignRight style={{ fontSize: "24px" }} />
              </div>
            </div>
            <div className={styles.alignBox}>
              <input type="color" />
              <p>#000000</p>
            </div>
          </div>
          <button className={`${styles.submitButton}`}>Apply Changes</button>
        </form>
      </nav>
      <section className={styles.workspace}>
        <div className={styles.alignSpace}>
          <div className={styles.action}>
            <button className={styles.actionButton}>
              <AiOutlineUserAdd style={{ fontSize: "24px" }} />
              Invite
            </button>
            <button className={styles.actionButton}>
              <AiOutlinePlus style={{ fontSize: "24px" }} />
              Add Page
            </button>
          </div>
          <div className={styles.board}>
            <Board />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Edit;
