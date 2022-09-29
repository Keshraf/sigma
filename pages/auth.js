import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import styles from "../styles/Auth.module.css";

const Auth = () => {
  const [login, setLogin] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const submitHandler = () => {
    if (login) {
      // User is loging in
      // Checks for missing creds
      if (!username || !password) {
        toast.error("Missing Credentials");
        return;
      }
      console.log("LOGGED IN!");
    } else {
      // User is signing up
      // Checks for missing creds
      if (!username || !password || !email) {
        toast.error("Missing Credentials");
        return;
      }
      console.log("SIGNED UP!");
    }
  };

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
        <div className={styles.blur}></div>
        <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
          <h1 className={styles.heading}>{login ? "Log In" : "Sign Up"}</h1>
          <hr className={styles.divider} />
          <input
            className={styles.input}
            type="text"
            placeholder={login ? "Enter Username" : "New Username"}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          {login ? (
            <></>
          ) : (
            <input
              className={styles.input}
              type="text"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          )}
          <input
            className={styles.input}
            type="text"
            placeholder={login ? "Enter Password" : "Set Password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className={styles.submit} onClick={submitHandler}>
            {login ? "Log In" : "Create a account"}
          </button>
          <button
            className={styles.switch}
            onClick={() => setLogin((prev) => !prev)}
          >
            {login ? "or signup" : "or login"}
          </button>
        </form>
      </div>
    </>
  );
};

export default Auth;
