import Head from "next/head";
import styles from "../styles/Home.module.css";
import { database } from "../firebaseConfig";
import { set, ref, onValue, get, child } from "firebase/database";
import { nanoid } from "nanoid";
import { useEffect } from "react";
import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { FaGithub } from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";

export default function Home() {
  const [roomId, setRoomId] = useState();
  const [activeForm, setActiveForm] = useState(true);
  const router = useRouter();

  useEffect(() => {
    onValue(ref(database, "rooms/"), (snapshot) => {
      const data = snapshot.val();
      console.log(data);
    });
  });

  const generateRoom = (e) => {
    e.preventDefault();
    console.log(e.target[0].value);
    const room = nanoid();
    set(ref(database, "rooms/" + room), {
      admin: e.target[0].value,
      pages: 1,
    });

    router.push(`/edit?q=${room}`);
  };

  const joinRoom = (e) => {
    e.preventDefault();
    console.log(e.target[0].value);
    console.log(roomId);
    get(child(ref(database), `rooms/${roomId}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          router.push(`/edit?q=${roomId}`);
        } else {
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
      <nav className={styles.nav}>
        <div className={styles.logo}>
          <Image
            src="/images/Sigma Logo.png"
            width="50px"
            height="50px"
            alt="logo"
          />
          <h3>sigma</h3>
        </div>
        <a href="https://github.com/Keshraf/sigma" target="blank">
          <button className={styles.github}>
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
      <div className={styles.preview}>
        <div className={styles.previewBlur}></div>
        <Image
          src="/images/Browser Preview Final.png"
          alt="preview"
          width="900px"
          height="590px"
        />
      </div>
      {/* <hr className={styles.line} /> */}
      <footer className={styles.footer}>
        <a
          href="https://github.com/Keshraf"
          target="blank"
          className={styles.signature}
        >
          Made by Ketan Saraf (Keshraf)
        </a>
        <a>
          <button type="button" className={styles.github}>
            View Feature List
            <FiExternalLink />
          </button>
        </a>
      </footer>
    </div>
  );
}
