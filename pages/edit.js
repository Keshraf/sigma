import { TbSquaresFilled, TbTextResize } from "react-icons/tb";
import { IoMdImage } from "react-icons/io";
import { AiOutlineUserAdd, AiOutlinePlus } from "react-icons/ai";
import { FaShapes } from "react-icons/fa";
import { FiDownload } from "react-icons/fi";
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
import { addPage, setPage } from "../store/pageSlice";
import SmallBoard from "../components/SmallBoard";
import { useRouter } from "next/router";
import { addPageRoom, setPageRoom, setRoom } from "../store/roomSlice";
import { child, get, onChildChanged, ref, update } from "firebase/database";
import { database } from "../firebaseConfig";
import CodeModal from "../components/CodeModal";
import html2canvas from "html2canvas";

const Edit = () => {
  const selectedElement = useSelector((state) => state.selectedElement);
  const page = useSelector((state) => state.page);
  const dispatch = useDispatch();
  const room = useSelector((state) => state.room);
  const router = useRouter();
  const [activeNav, setActiveNav] = useState(<TextForm />);
  const [activeButton, setActiveButton] = useState("textNav");
  const [unsplashOpen, setUnsplashOpen] = useState(false);
  const [iconsOpen, setIconsOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [roomId, setRoomId] = useState();

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
    console.log(router.query.q);
    dispatch(
      setRoom({
        id: router.query.q,
      })
    );

    const dbRef = ref(database);
    get(child(dbRef, `rooms/${router.query.q}/pages`)).then((snapshot) => {
      if (snapshot.exists()) {
        console.log("PAGES!", snapshot.val());
        const numberOfPages = snapshot.val();
        dispatch(
          setPageRoom({
            pages: numberOfPages,
          })
        );
        dispatch(
          setPage({
            pages: numberOfPages,
          })
        );
      }
    });

    setRoomId({ id: router.query.q });
  }, [dispatch, router.query.q]);

  useEffect(() => {
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

  // UPDATE PAGES
  useEffect(() => {
    const elementsRef = ref(database, `rooms/${router.query.q}`);
    onChildChanged(elementsRef, (snapshot) => {
      const updatedPage = snapshot.val();
      console.log("Updated Page!: ", updatedPage);
      /* console.log("ROom Page!: ", room.pages);
      console.log("ROom Page!: ", page.pages.length); */
      dispatch(
        setPage({
          pages: updatedPage,
        })
      );
    });
  }, [router.query.q, dispatch, room.pages, page.pages.length]);

  const addPageHandler = () => {
    console.log("ADD PAGE RAN!");
    console.log(room);
    const latestPages = room.pages + 1;
    console.log("LatestPages: ", latestPages);
    dispatch(addPageRoom());
    dispatch(addPage());
    update(ref(database, `rooms/${roomId.id}`), {
      pages: latestPages,
    });
  };

  const downloadHandler = useCallback(async () => {
    const board = document.querySelector("#board");
    console.log(board.setAttribute());
    const canvas = await html2canvas(board, {
      useCORS: true,
      allowTaint: true,
    });
    const dataURL = canvas.toDataURL("image/png");
    const tmpLink = document.createElement("a");
    tmpLink.download = "image.png";
    tmpLink.href = dataURL;
    document.body.appendChild(tmpLink);
    tmpLink.click();
    document.body.removeChild(tmpLink);
  }, []);

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
        {modalOpen ? <CodeModal setModalOpen={setModalOpen} /> : <></>}
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
          <div className={styles.divider}></div>
          <button className={styles.navButton} onClick={downloadHandler}>
            <FiDownload style={{ fontSize: "24px" }} />
            Download Page
          </button>
        </nav>
        <section className={styles.workspace}>
          <div className={styles.alignSpace}>
            <div className={styles.action}>
              <p className={styles.page}>#{page.current}</p>
              <div className={styles.actionButtons}>
                <button
                  className={styles.actionButton}
                  onClick={() => setModalOpen(true)}
                >
                  <AiOutlineUserAdd style={{ fontSize: "24px" }} />
                  Invite
                </button>
                <button
                  className={styles.actionButton}
                  onClick={addPageHandler}
                >
                  <AiOutlinePlus style={{ fontSize: "24px" }} />
                  Add Page
                </button>
              </div>
            </div>
            <Board page={page.current} id="board" />
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

export default Edit;
