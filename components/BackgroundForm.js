import styles from "../styles/BackgroundForm.module.css";

// Icons
import { FiUploadCloud } from "react-icons/fi";
import { RiUnsplashFill } from "react-icons/ri";

// Other libs
import { toast } from "react-hot-toast";
import { nanoid } from "nanoid";

// React & Redux
import { useState } from "react";
import {
  addBackgroundColor,
  addBackgroundFirebase,
} from "../store/backgroundSlice";
import { useDispatch, useSelector } from "react-redux";

// Firebase
import { storage } from "../firebaseConfig";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { set, ref as refDatabase } from "firebase/database";
import { database } from "../firebaseConfig";

// Components
import ColorPicker from "./ColorPicker";
import { useEffect } from "react";

const BackgroundForm = ({ setUnsplashOpen }) => {
  const dispatch = useDispatch();

  const background = useSelector((state) => state.background); // Gets all the backgrounds of this room
  const page = useSelector((state) => state.page.current); // Gets the currnt page
  const roomId = useSelector((state) => state.room.id); // Gets the current room id
  const currentBg = background.filter((bg) => bg.page === page)[0]; // Gets the Bg of the Current Page

  const [color, setColor] = useState("#FFFFFF");

  useEffect(() => {
    if (!currentBg) {
      setColor("#FFFFFF");
      return;
    }
    if (currentBg.source === "color") {
      setColor(currentBg.background);
    } else {
      setColor("#FFFFFF");
    }
  }, [currentBg]);

  const uploadHandler = (e) => {
    const file = e.target.files[0];

    // This is the reference to the location where the uploaded file will be saved
    // Automatically overwrites the existing file if the background image of a page is changed
    const imageRef = ref(
      storage,
      `background/background_${roomId}_${page}.jpg`
    );

    const uploadingImage = uploadBytes(imageRef, file).then(() => {
      // Gets the URL of the uploaded Background Image
      const loadingImage = getDownloadURL(imageRef).then((url) => {
        const data = {
          id: nanoid(),
          page,
          background: url,
          roomId,
          source: "firebase",
        };
        dispatch(addBackgroundFirebase(data));
        // The Reference automatically overwrites the previous background if it is changed
        const backgroundRef = refDatabase(
          database,
          `background/${roomId}/${page}`
        );
        set(backgroundRef, data);
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

  const submitHandler = () => {
    console.log("Submitted!");
    const data = {
      id: nanoid(),
      page,
      background: color,
      roomId,
      source: "color",
    };

    dispatch(addBackgroundColor(data));
    // The Reference automatically overwrites the previous background if it is changed
    const backgroundRef = refDatabase(database, `background/${roomId}/${page}`);
    set(backgroundRef, data);
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
      <ColorPicker color={color} setColor={setColor} />
      <button
        className={`${styles.submitButton}`}
        style={{ cursor: "pointer" }}
        onClick={submitHandler}
      >
        Change Background Color
      </button>
    </div>
  );
};

export default BackgroundForm;
