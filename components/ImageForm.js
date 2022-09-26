import styles from "../styles/ImageForm.module.css";

// Icons
import { FiUploadCloud } from "react-icons/fi";
import { RiUnsplashFill } from "react-icons/ri";

// Other Libs
import { nanoid } from "nanoid";
import { toast } from "react-hot-toast";

// Redux
import { addElement } from "../store/elementSlice";
import { useDispatch, useSelector } from "react-redux";

// Firebase
import { push, set, ref as refDatabase } from "firebase/database";
import { database } from "../firebaseConfig";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebaseConfig";

const ImageForm = ({ setUnsplashOpen }) => {
  const dispatch = useDispatch();

  const page = useSelector((state) => state.page.current); // Gets the current page number
  const roomId = useSelector((state) => state.room.id); // Gets the current roomId

  const uploadHandler = (e) => {
    const file = e.target.files[0];
    console.log(file);

    // Creates a image location in the firebase storage
    const imageRef = ref(storage, `images/image_${nanoid()}.jpg`);

    // Uploads the file to the above location
    const uploadingImage = uploadBytes(imageRef, file).then((snapshot) => {
      console.log(snapshot, "Snapshot");

      // Fetches the URL of the uploaded Image
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
      <button className={styles.submitButton}>Insert Image</button>
    </div>
  );
};

export default ImageForm;
