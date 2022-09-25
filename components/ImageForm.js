import styles from "../styles/ImageForm.module.css";
import { FiUploadCloud } from "react-icons/fi";
import { CgUnsplash } from "react-icons/cg";
import { RiUnsplashFill } from "react-icons/ri";
import { SiIcons8 } from "react-icons/si";
import { storage } from "../firebaseConfig";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { nanoid } from "nanoid";
import { addElement } from "../store/elementSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { push, set, ref as refDatabase } from "firebase/database";
import { database } from "../firebaseConfig";

const ImageForm = ({ setUnsplashOpen, setIconsOpen }) => {
  const dispatch = useDispatch();
  const page = useSelector((state) => state.page.current);
  const roomId = useSelector((state) => state.room.id);
  const uploadHandler = (e) => {
    const file = e.target.files[0];
    console.log(file);
    const imageRef = ref(storage, `images/image_${nanoid()}.jpg`);

    const uploadingImage = uploadBytes(imageRef, file).then((snapshot) => {
      console.log(snapshot, "Snapshot");
      const loadingImage = getDownloadURL(imageRef).then((url) => {
        const data = {
          page,
          src: url,
          width: 200,
          height: 100,
          x: 15,
          y: 15,
          type: "image",
          id: nanoid(),
          roomId,
        };
        dispatch(addElement(data));
        const elementRef = refDatabase(database, "elements/" + roomId);
        set(push(elementRef), data);
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
      <div
        className={styles.clickButtonUnshaded}
        style={{ cursor: "pointer" }}
        onClick={(e) => setIconsOpen(true)}
      >
        <SiIcons8 style={{ fontSize: "24px" }} />
        Launch Iconify
      </div>
      <button className={`${styles.submitButton}`}>Insert</button>
    </div>
  );
};

export default ImageForm;
