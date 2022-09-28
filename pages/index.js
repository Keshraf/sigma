import styles from "../styles/Home.module.css";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { database } from "../firebaseConfig";
import { set, ref, get, child } from "firebase/database";
import { nanoid } from "nanoid";
import { useState } from "react";
import { FaGithub } from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";

export default function Home() {
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const [activeForm, setActiveForm] = useState(true);
  const router = useRouter();

  // Generates a new Room for the User
  const generateRoom = (e) => {
    e.preventDefault();
    if (!username) {
      toast.error("Please enter an username");
      return;
    }
    //Creates a room Id
    const room = nanoid();
    // Adds the user as the admin of the room
    set(ref(database, "rooms/" + room), {
      admin: username,
      pages: 1,
    });

    router.push(`/edit?q=${room}`);
  };

  // Checks whether the room exists and navigates the user to that room
  const joinRoom = (e) => {
    e.preventDefault();
    const toastId = toast.loading("Waiting...");
    get(child(ref(database), `rooms/${roomId}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          router.push(`/edit?q=${roomId}`);
        } else {
          toast.error("Invalid Room Id", {
            id: toastId,
          });
          console.log("ERROR!");
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Sigma</title>
        <meta
          name="description"
          content="Real-time Collaboration Design Tool"
        />
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
      <nav className={styles.nav}>
        <div className={styles.logo}>
          <Image
            src="/images/Sigma Logo.png"
            width="50px"
            height="50px"
            alt="logo"
            className={styles.logoIcon}
          />
          <h3 className={styles.name}>sigma</h3>
        </div>
        <a href="https://github.com/Keshraf/sigma" target="blank">
          <button className={`${styles.github} ${styles.star}`}>
            <FaGithub style={{ fontSize: "20px", color: "#C1C2C7" }} />
            <p>Star on GitHub</p>
          </button>
        </a>
      </nav>
      <div className={styles.update}>🚧 UNDER CONSTRUCTION</div>
      <h1 className={styles.heading}>
        Real-time Collaboration <span>Design</span> Tool
      </h1>
      <h2 className={styles.caption}>
        Sigma is a web app where you can make stunning designs with your team
        supafast! ⚡
      </h2>
      {activeForm ? (
        <form onSubmit={generateRoom} className={styles.form}>
          <input
            type="text"
            id="username"
            className={styles.input}
            placeholder="Create a username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          ></input>
          <button type="submit" className={styles.submit}>
            Generate Room
          </button>
        </form>
      ) : (
        <form onSubmit={joinRoom} className={styles.form}>
          <input
            type="text"
            id="room"
            onChange={(e) => setRoomId(e.target.value)}
            value={roomId}
            className={styles.input}
            placeholder="Enter Room Code"
          ></input>
          <button type="submit" className={styles.submit}>
            Join
          </button>
        </form>
      )}
      <p
        className={styles.switchForm}
        onClick={() => setActiveForm((prev) => !prev)}
      >
        {activeForm ? "or, join a room" : "or, create a room"}
      </p>
      <a href="https://github.com/Keshraf/sigma" target="blank">
        <button className={`${styles.submit} ${styles.star2}`}>
          <FaGithub style={{ fontSize: "20px", color: "#FFFFFF" }} />
          <p>Star on GitHub</p>
        </button>
      </a>
      <div className={styles.preview}>
        <div className={styles.previewBlur}></div>
        <Image
          src="/images/Browser Preview Final.png"
          alt="preview"
          width="900px"
          height="590px"
        />
      </div>
      <footer className={styles.footer}>
        <a
          href="https://github.com/Keshraf"
          target="blank"
          className={styles.signature}
        >
          Made by Ketan Saraf (Keshraf)
        </a>
        <a href="https://github.com/Keshraf/sigma#features" target="blank">
          <button
            type="button"
            className={`${styles.github} ${styles.feature}`}
          >
            View Feature List
            <FiExternalLink />
          </button>
        </a>
      </footer>
    </div>
  );
}
