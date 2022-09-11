import { useState } from "react";
import { FiUploadCloud } from "react-icons/fi";
import { RiUnsplashFill } from "react-icons/ri";
import styles from "./BackgroundForm.module.css";
import { toast } from "react-hot-toast";
import {
  addBackgroundColor,
  addBackgroundFirebase,
} from "../store/backgroundSlice";
import { useDispatch, useSelector } from "react-redux";
import { storage } from "../firebaseConfig";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { nanoid } from "nanoid";

const BackgroundForm = ({ setUnsplashOpen }) => {
  const dispatch = useDispatch();
  const background = useSelector((state) => state.background);
  const page = useSelector((state) => state.page.current);
  let bgColor = false;
  if (background.source === "color") {
    bgColor = true;
  }

  const [color, setColor] = useState(
    bgColor ? background.background : "#FFFFFF"
  );

  const uploadHandler = (e) => {
    const file = e.target.files[0];
    const imageRef = ref(storage, `background/background.jpg`);

    const uploadingImage = uploadBytes(imageRef, file).then((snapshot) => {
      const loadingImage = getDownloadURL(imageRef).then((url) => {
        const data = {
          page,
          src: url,
        };
        dispatch(addBackgroundFirebase(data));
      });

      toast.promise(loadingImage, {
        loading: "Loading Image",
        success: "Image Loaded",
        error: "Error when Loading",
      });
    });

    toast.promise(uploadingImage, {
      loading: "Uploading Image",
      success: "Image Uploaded",
      error: "Error when Uploading",
    });
  };

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
    console.log("Submitted!");
    const data = {
      page,
      color,
    };

    dispatch(addBackgroundColor(data));
    toast.success("Background Color Updated!");
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
      <button
        className={`${styles.submitButton}`}
        style={{ cursor: "pointer" }}
        onClick={submitHandler}
      >
        Apply Changes
      </button>
    </div>
  );
};

export default BackgroundForm;
