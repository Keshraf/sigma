import { TbSquaresFilled, TbTextResize } from "react-icons/tb";
import { IoMdImage } from "react-icons/io";
import { AiOutlineUserAdd, AiOutlinePlus } from "react-icons/ai";
import { FaShapes } from "react-icons/fa";
import styles from "../styles/Edit.module.css";
import Board from "../components/Board";
import TextForm from "../components/TextForm";
import BackgroundForm from "../components/BackgroundForm";
import ImageForm from "../components/ImageForm";
import ShapesForm from "../components/ShapesForm";
import { useCallback, useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import axios from "axios";
import Unsplash from "../components/Unsplash";
import { useDispatch, useSelector } from "react-redux";
import { resetSelected } from "../store/selectedElementSlice";
import Icons from "../components/Icons";
import { addPage } from "../store/pageSlice";
import SmallBoard from "../components/SmallBoard";

const Edit = () => {
  const selectedElement = useSelector((state) => state.selectedElement);
  const page = useSelector((state) => state.page);
  console.log(page);
  const dispatch = useDispatch();
  const [activeNav, setActiveNav] = useState(<TextForm />);
  const [activeButton, setActiveButton] = useState("textNav");
  const [unsplashOpen, setUnsplashOpen] = useState(false);
  const [iconsOpen, setIconsOpen] = useState(false);

  const navChangeHandler = useCallback(
    (element, id) => {
      setActiveNav(element);
      const button = document.getElementById(id);
      const prevButton = document.getElementById(activeButton);
      prevButton.classList.remove(`${styles.navButtonActive}`);
      button.classList.add(`${styles.navButtonActive}`);
      setActiveButton(id);
    },
    [activeButton]
  );

  useEffect(() => {
    console.log("run useffect!");
    if (selectedElement.id === "") {
      return;
    } else if (selectedElement.type === "text") {
      navChangeHandler(<TextForm />, "textNav");
    } else if (selectedElement.type === "shape") {
      navChangeHandler(<ShapesForm />, "shapeNav");
    } else if (
      selectedElement.type === "image" ||
      selectedElement.type === "icon"
    ) {
      navChangeHandler(
        <ImageForm
          setUnsplashOpen={setUnsplashOpen}
          setIconsOpen={setIconsOpen}
        />,
        "imageNav"
      );
    }
  }, [selectedElement, navChangeHandler]);

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 2000,
          style: {
            background: "#303544",
            color: "#ffffff",
          },
        }}
      />

      <div className={styles.container}>
        {unsplashOpen ? (
          <Unsplash
            setUnsplashOpen={setUnsplashOpen}
            type={activeButton === "imageNav" ? "image" : "background"}
          />
        ) : (
          <></>
        )}
        {iconsOpen ? <Icons setIconsOpen={setIconsOpen} /> : <></>}
        <nav className={styles.nav}>
          <input
            type="text"
            placeholder="File Name"
            className={styles.inputShaded}
          ></input>
          <button
            className={`${styles.navButton} ${styles.navButtonActive}`}
            onClick={() => {
              dispatch(resetSelected());
              navChangeHandler(<TextForm />, "textNav");
            }}
            id="textNav"
          >
            <TbTextResize style={{ fontSize: "24px" }} />
            Text
          </button>
          <button
            className={`${styles.navButton}`}
            onClick={() => {
              dispatch(resetSelected());
              navChangeHandler(
                <BackgroundForm setUnsplashOpen={setUnsplashOpen} />,
                "backgroundNav"
              );
            }}
            id="backgroundNav"
          >
            <TbSquaresFilled style={{ fontSize: "24px" }} />
            Background
          </button>
          <button
            className={`${styles.navButton}`}
            onClick={() => {
              dispatch(resetSelected());
              navChangeHandler(
                <ImageForm
                  setUnsplashOpen={setUnsplashOpen}
                  setIconsOpen={setIconsOpen}
                />,
                "imageNav"
              );
            }}
            id="imageNav"
          >
            <IoMdImage style={{ fontSize: "24px" }} />
            Image
          </button>
          <button
            className={`${styles.navButton}`}
            onClick={() => {
              dispatch(resetSelected());
              navChangeHandler(<ShapesForm />, "shapeNav");
            }}
            id="shapeNav"
          >
            <FaShapes style={{ fontSize: "24px" }} />
            Shapes
          </button>
          <div className={styles.divider}></div>
          {activeNav}
        </nav>
        <section className={styles.workspace}>
          <div className={styles.alignSpace}>
            <div className={styles.action}>
              <p className={styles.page}>#{page.current}</p>
              <div className={styles.actionButtons}>
                <button className={styles.actionButton}>
                  <AiOutlineUserAdd style={{ fontSize: "24px" }} />
                  Invite
                </button>
                <button
                  className={styles.actionButton}
                  onClick={() => dispatch(addPage())}
                >
                  <AiOutlinePlus style={{ fontSize: "24px" }} />
                  Add Page
                </button>
              </div>
            </div>
            <Board page={page.current} />
            <div className={styles.pages}>
              {page.pages.map((page) => {
                return <SmallBoard key={page} page={page} />;
              })}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export async function getStaticProps() {
  const response = await axios({
    url: `https://www.googleapis.com/webfonts/v1/webfonts?sort=POPULARITY&key=${process.env.FONTS_API_KEY}`,
    method: "get",
  });

  const items = response.data.items;

  return {
    props: {
      fonts: items.slice(0, 100),
    },
  };
}

export default Edit;
