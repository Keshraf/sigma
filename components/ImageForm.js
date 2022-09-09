import styles from "./ImageForm.module.css";
import { FiUploadCloud } from "react-icons/fi";
import { CgUnsplash } from "react-icons/cg";
import { RiUnsplashFill } from "react-icons/ri";
import { SiIcons8 } from "react-icons/si";

const ImageForm = ({ setUnsplashOpen }) => {
  const uploadHandler = (e) => {
    const image = document.getElementById("output");
    image.src = URL.createObjectURL(e.target.files[0]);
  };
  return (
    <div className={styles.bgLayout}>
      <div className={styles.clickButtonShaded}>
        <label
          htmlFor="file"
          style={{ cursor: "pointer" }}
          className={styles.buttonLabel}
        >
          <FiUploadCloud style={{ fontSize: "24px" }} />
          Upload Image
        </label>
        <input
          type="file"
          placeholder="Upload Image"
          id="file"
          onInput={uploadHandler}
          style={{ display: "none" }}
        ></input>
      </div>
      <div
        className={styles.clickButtonUnshaded}
        style={{ cursor: "pointer" }}
        onClick={(e) => setUnsplashOpen(true)}
      >
        <RiUnsplashFill style={{ fontSize: "24px" }} />
        Launch Unsplash
      </div>
      <div className={styles.clickButtonUnshaded} style={{ cursor: "pointer" }}>
        <SiIcons8 style={{ fontSize: "24px" }} />
        Launch Iconify
      </div>
      <button className={`${styles.submitButton}`}>Insert</button>
    </div>
  );
};

export default ImageForm;
