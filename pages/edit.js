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
import { useState } from "react";
import { Toaster } from "react-hot-toast";
import axios from "axios";
import Unsplash from "../components/Unsplash";

const Edit = ({ fonts }) => {
  const [activeNav, setActiveNav] = useState(<TextForm fonts={fonts} />);
  const [activeButton, setActiveButton] = useState("textNav");
  const [unsplashOpen, setUnsplashOpen] = useState(false);

  const navChangeHandler = (element, id) => {
    setActiveNav(element);
    const button = document.getElementById(id);
    const prevButton = document.getElementById(activeButton);
    prevButton.classList.remove(`${styles.navButtonActive}`);
    button.classList.add(`${styles.navButtonActive}`);
    setActiveButton(id);
  };

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 1500,
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
        <nav className={styles.nav}>
          <input
            type="text"
            placeholder="File Name"
            className={styles.inputShaded}
          ></input>
          <button
            className={`${styles.navButton} ${styles.navButtonActive}`}
            onClick={() =>
              navChangeHandler(<TextForm fonts={fonts} />, "textNav")
            }
            id="textNav"
          >
            <TbTextResize style={{ fontSize: "24px" }} />
            Text
          </button>
          <button
            className={`${styles.navButton}`}
            onClick={() =>
              navChangeHandler(
                <BackgroundForm setUnsplashOpen={setUnsplashOpen} />,
                "backgroundNav"
              )
            }
            id="backgroundNav"
          >
            <TbSquaresFilled style={{ fontSize: "24px" }} />
            Background
          </button>
          <button
            className={`${styles.navButton}`}
            onClick={() =>
              navChangeHandler(
                <ImageForm setUnsplashOpen={setUnsplashOpen} />,
                "imageNav"
              )
            }
            id="imageNav"
          >
            <IoMdImage style={{ fontSize: "24px" }} />
            Image
          </button>
          <button
            className={`${styles.navButton}`}
            onClick={() => navChangeHandler(<ShapesForm />, "shapeNav")}
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
              <button className={styles.actionButton}>
                <AiOutlineUserAdd style={{ fontSize: "24px" }} />
                Invite
              </button>
              <button className={styles.actionButton}>
                <AiOutlinePlus style={{ fontSize: "24px" }} />
                Add Page
              </button>
            </div>
            <Board />
            {/* <img id="output" width="200" alt="testImg" /> */}{" "}
            {/* Insert IMG Later */}
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
