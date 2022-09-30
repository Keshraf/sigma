// Styles
import styles from "../styles/Edit.module.css";

// Icons
import { TbSquaresFilled, TbTextResize, TbLayoutGridAdd } from "react-icons/tb";
import { IoMdImage } from "react-icons/io";
import { AiOutlineUserAdd, AiOutlinePlus } from "react-icons/ai";
import { FaShapes } from "react-icons/fa";
import { FiDownload, FiLogIn } from "react-icons/fi";
import { RiFolder3Fill } from "react-icons/ri";

// React, Next & Redux
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetSelected } from "../store/selectedElementSlice";
import { addPage, setPage } from "../store/pageSlice";
import {
  addPageRoom,
  setPageRoom,
  setRoom,
  setRoomName,
} from "../store/roomSlice";
import { addBackgroundColor } from "../store/backgroundSlice";

// Firebase
import {
  child,
  get,
  onChildChanged,
  ref,
  update,
  set,
} from "firebase/database";
import { database } from "../firebaseConfig";

// Other Libraries
import toast, { Toaster } from "react-hot-toast";
import html2canvas from "html2canvas";
import { nanoid } from "nanoid";

//Components
import Board from "../components/Board";
import TextForm from "../components/TextForm";
import BackgroundForm from "../components/BackgroundForm";
import ImageForm from "../components/ImageForm";
import ShapesForm from "../components/ShapesForm";
import CodeModal from "../components/CodeModal";
import Unsplash from "../components/Unsplash";
import SmallBoard from "../components/SmallBoard";
import IconForm from "../components/IconForm";

const Edit = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [activeNav, setActiveNav] = useState(<TextForm />); // Stores the Active Navigation Components
  const [activeButton, setActiveButton] = useState("textNav"); // Stores the id of the Active Nav Component
  const [unsplashOpen, setUnsplashOpen] = useState(false); // Unplash Modal State
  const [modalOpen, setModalOpen] = useState(false); // Share Code Modal State
  const [roomId, setRoomId] = useState(); // Current Room Id

  const selectedElement = useSelector((state) => state.selectedElement); // Current Selected Element By the User
  const page = useSelector((state) => state.page); // Active Page and List of Pages
  const room = useSelector((state) => state.room); // Current Room info
  const user = useSelector((state) => state.user.user); // Current Logged in user

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
    toast("Please Zoom Out on Screen Distortion", {
      icon: "🛠",
      duration: 4000,
    });
    console.log(router.query.q);
    // Sets the current room id
    dispatch(
      setRoom({
        id: router.query.q,
      })
    );

    // Sets the total number of pages of that particular room
    const dbRef = ref(database);
    get(child(dbRef, `rooms/${router.query.q}`)).then((snapshot) => {
      if (snapshot.exists()) {
        console.log("PAGES!", snapshot.val().pages);
        const numberOfPages = snapshot.val().pages;
        const roomName = snapshot.val().name;
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
        dispatch(
          setRoomName({
            name: roomName,
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
    } else if (selectedElement.type === "image") {
      navChangeHandler(
        <ImageForm setUnsplashOpen={setUnsplashOpen} />,
        "imageNav"
      );
    } else if (selectedElement.type === "icon") {
      navChangeHandler(<IconForm />, "iconNav");
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
  // Sets the Background of the New Page to white (#FFFFFF)
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
    const data = {
      id: nanoid(),
      page: latestPages,
      background: "#FFFFFF",
      roomId: roomId.id,
      source: "color",
    };

    dispatch(addBackgroundColor(data));
    const backgroundRef = ref(
      database,
      `background/${roomId.id}/${latestPages}`
    );
    set(backgroundRef, data);
  };

  // Downloads the Current Page
  const downloadHandler = useCallback(async () => {
    const board = document.querySelector("#board");

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
          <ImageForm setUnsplashOpen={setUnsplashOpen} />,
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
        navChangeHandler(<IconForm />, "iconNav");
      },
      id: "iconNav",
      icon: <TbLayoutGridAdd style={{ fontSize: "24px" }} />,
      text: "Icons",
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
      <Head>
        <title>{room.name}</title>
        <link rel="icon" href="/images/Sigma Logo.png" />
      </Head>
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
        {modalOpen && <CodeModal setModalOpen={setModalOpen} />}
        <nav className={styles.nav}>
          <div className={styles.fileName}>{room.name}</div>
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
              <div className={styles.actionButtons}>
                <p className={styles.page}>#{page.current}</p>
                <button
                  className={styles.actionButton}
                  onClick={addPageHandler}
                >
                  <AiOutlinePlus style={{ fontSize: "24px" }} />
                  Page
                </button>
                <button
                  className={styles.actionButton}
                  onClick={() => setModalOpen(true)}
                >
                  <AiOutlineUserAdd style={{ fontSize: "24px" }} />
                  Invite
                </button>
              </div>
              {user ? (
                <div className={styles.actionButtons}>
                  <Link href="/files">
                    <button className={styles.actionButton2}>
                      <RiFolder3Fill style={{ fontSize: "24px" }} />
                      Folder
                    </button>
                  </Link>
                </div>
              ) : (
                <div className={styles.actionButtons}>
                  <Link href="/auth">
                    <button className={styles.actionButton2}>
                      <FiLogIn style={{ fontSize: "24px" }} />
                      Sign Up
                    </button>
                  </Link>
                </div>
              )}
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
