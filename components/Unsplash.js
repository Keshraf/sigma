import { useEffect, useState } from "react";
import { createApi } from "unsplash-js";
import styles from "../styles/Unsplash.module.css";
import { AiOutlineEnter } from "react-icons/ai";
import { RiUnsplashFill } from "react-icons/ri";
import { MdClose } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { nanoid } from "nanoid";
import { addElement } from "../store/elementSlice";
import { addBackgroundUnsplash } from "../store/backgroundSlice";
import toast from "react-hot-toast";
import { push, set, ref } from "firebase/database";
import { database } from "../firebaseConfig";

const Unsplash = ({ setUnsplashOpen, type }) => {
  const [photos, setPhotos] = useState([]);
  const [query, setQuery] = useState("wallpaper");
  const dispatch = useDispatch();
  const page = useSelector((state) => state.page.current);
  const roomId = useSelector((state) => state.room.id);
  useEffect(() => {
    const unsplash = createApi({
      accessKey: "hADNzo74JDzJ8wK5fZjtzVGQVSaCzjCKFokw9TTQLQ4",
    });

    unsplash.search
      .getPhotos({ page: 2, perPage: 30, query: query })
      .then((data) => {
        setPhotos(data.response.results);
      });
  }, [query]);

  const enterHandler = (e) => {
    if (e.key !== "Enter") {
      return;
    }
    if (e.target.value === "") {
      setQuery("wallpaper");
      return;
    }
    setQuery(e.target.value);
  };

  const blurHandler = (e) => {
    if (e.target.value === "") {
      setQuery("wallpaper");
      return;
    }
    setQuery(e.target.value);
  };

  const imageSelectHandler = (e) => {
    if (type === "image") {
      const src = e.target.currentSrc;
      const data = {
        id: nanoid(),
        src,
        type: "image",
        x: 0,
        y: 0,
        width: e.target.naturalWidth,
        height: e.target.naturalHeight,
        page,
        roomId,
      };
      dispatch(addElement(data));
      const elementRef = ref(database, "elements/" + roomId);
      set(push(elementRef), data);
      toast.success("Image Added!");
    } else if (type === "background") {
      const src = e.target.alt;

      const data = {
        id: nanoid(),
        background: src,
        page,
        roomId,
      };
      dispatch(addBackgroundUnsplash(data));

      const backgroundRef = ref(database, `background/${roomId}/${page}`);
      set(backgroundRef, data);
      toast.success("Background Image Updated!");
    }

    setUnsplashOpen(false);
  };

  return (
    <div className={styles.container} onClick={() => setUnsplashOpen(false)}>
      <div className={styles.actionContainer}>
        <div className={styles.icon} onClick={() => setUnsplashOpen(false)}>
          <MdClose style={{ fontSize: "18px" }} />
          Close
        </div>
        <div className={styles.icon}>
          <RiUnsplashFill style={{ fontSize: "18px" }} />
          Powered by Unsplash
        </div>
      </div>
      <div className={styles.inputContainer}>
        <input
          type="text"
          placeholder="Search 🔍"
          className={styles.input}
          onKeyUp={enterHandler}
          onBlur={blurHandler}
        />
        <p className={styles.hint}>
          <AiOutlineEnter style={{ fontSize: "18px" }} />
          Press Enter
        </p>
      </div>
      <div className={styles.innerContainer}>
        <div className={styles.column}>
          {photos.slice(0, 11).map((photo) => {
            return (
              <img
                src={photo.urls.small}
                key={photo.id}
                className={styles.photo}
                loading="lazy"
                onClick={imageSelectHandler}
                alt={photo.urls.regular}
              />
            );
          })}
        </div>
        <div className={styles.column}>
          {photos.slice(11, 21).map((photo) => {
            return (
              <img
                src={photo.urls.small}
                key={photo.id}
                className={styles.photo}
                loading="lazy"
                onClick={imageSelectHandler}
                alt={photo.urls.regular}
              />
            );
          })}
        </div>
        <div className={styles.column}>
          {photos.slice(21, 31).map((photo) => {
            return (
              <img
                src={photo.urls.small}
                key={photo.id}
                className={styles.photo}
                loading="lazy"
                onClick={imageSelectHandler}
                alt={photo.urls.regular}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Unsplash;
