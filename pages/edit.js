// Styles
import styles from "../styles/Edit.module.css";

// Icons
import { TbSquaresFilled, TbTextResize } from "react-icons/tb";
import { IoMdImage } from "react-icons/io";
import { AiOutlineUserAdd, AiOutlinePlus } from "react-icons/ai";
import { FaShapes } from "react-icons/fa";
import { FiDownload } from "react-icons/fi";

// React, Next & Redux
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetSelected } from "../store/selectedElementSlice";
import { addPage, setPage } from "../store/pageSlice";
import { addPageRoom, setPageRoom, setRoom } from "../store/roomSlice";

// Firebase
import { child, get, onChildChanged, ref, update } from "firebase/database";
import { database } from "../firebaseConfig";

// Other Libraries
import { Toaster } from "react-hot-toast";
import html2canvas from "html2canvas";

//Components
import Board from "../components/Board";
import TextForm from "../components/TextForm";
import BackgroundForm from "../components/BackgroundForm";
import ImageForm from "../components/ImageForm";
import ShapesForm from "../components/ShapesForm";
import CodeModal from "../components/CodeModal";
import Unsplash from "../components/Unsplash";
import SmallBoard from "../components/SmallBoard";
import Icons from "../components/Icons";

const Edit = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [activeNav, setActiveNav] = useState(<TextForm />); // Stores the Active Navigation Components
  const [activeButton, setActiveButton] = useState("textNav"); // Stores the id of the Active Nav Component
  const [unsplashOpen, setUnsplashOpen] = useState(false); // Unplash Modal State
  const [iconsOpen, setIconsOpen] = useState(false); // Icons Modal State
  const [modalOpen, setModalOpen] = useState(false); // Share Code Modal State
  const [roomId, setRoomId] = useState(); // Current Room Id

  const selectedElement = useSelector((state) => state.selectedElement); // Current Selected Element By the User
  const page = useSelector((state) => state.page); // Active Page and List of Pages
  const room = useSelector((state) => state.room); // Current Room info

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
    // Sets the current room id
    dispatch(
      setRoom({
        id: router.query.q,
      })
    );

    // Sets the total number of pages of that particular room
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

  // Sets the Active Nav according to the Selected Element
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
      dispatch(
        setPage({
          pages: updatedPage,
        })
      );
    });
  }, [router.query.q, dispatch, room.pages, page.pages.length]);

  // Adds and syncs new pages across all users of the same room
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

  // Downloads the Current Page
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

  // Contains info and functions for the all Navigation Buttons
  const navButtonsList = [
    {
      class: `${styles.navButton} ${styles.navButtonActive}`,
      click: () => {
        dispatch(resetSelected());
        navChangeHandler(<TextForm />, "textNav");
      },
      id: "textNav",
      icon: <TbTextResize style={{ fontSize: "24px" }} />,
      text: "Text",
    },
    {
      class: `${styles.navButton}`,
      click: () => {
        dispatch(resetSelected());
        navChangeHandler(
          <BackgroundForm setUnsplashOpen={setUnsplashOpen} />,
          "backgroundNav"
        );
      },
      id: "backgroundNav",
      icon: <TbSquaresFilled style={{ fontSize: "24px" }} />,
      text: "Background",
    },
    {
      class: `${styles.navButton}`,
      click: () => {
        dispatch(resetSelected());
        navChangeHandler(
          <ImageForm
            setUnsplashOpen={setUnsplashOpen}
            setIconsOpen={setIconsOpen}
          />,
          "imageNav"
        );
      },
      id: "imageNav",
      icon: <IoMdImage style={{ fontSize: "24px" }} />,
      text: "Image",
    },
    {
      class: `${styles.navButton}`,
      click: () => {
        dispatch(resetSelected());
        navChangeHandler(<ShapesForm />, "shapeNav");
      },
      id: "shapeNav",
      icon: <FaShapes style={{ fontSize: "24px" }} />,
      text: "Shapes",
    },
  ];

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
        {unsplashOpen && (
          <Unsplash
            setUnsplashOpen={setUnsplashOpen}
            type={activeButton === "imageNav" ? "image" : "background"}
          />
        )}
        {iconsOpen && <Icons setIconsOpen={setIconsOpen} />}
        {modalOpen && <CodeModal setModalOpen={setModalOpen} />}
        <nav className={styles.nav}>
          <input
            type="text"
            placeholder="File Name"
            className={styles.inputShaded}
          ></input>
          {/* Goes through the nav buttons array and creates a button for each */}
          {navButtonsList.map((nav) => {
            return (
              <button
                className={nav.class}
                onClick={nav.click}
                id={nav.id}
                key={nav.id}
              >
                {nav.icon}
                {nav.text}
              </button>
            );
          })}

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
                  Page
                </button>
              </div>
            </div>
            <Board page={page.current} id="board" />
            <div className={styles.pages}>
              {/* Displays all the pages of the room, by displaying its background image */}
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
