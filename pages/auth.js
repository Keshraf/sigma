import styles from "../styles/Auth.module.css";

// React Redux Next
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../store/userSlice";
import { useRouter } from "next/router";
import Head from "next/head";

// Other libs
import toast, { Toaster } from "react-hot-toast";

// Amplify
import { Auth, Hub } from "aws-amplify";

const Authenticate = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [login, setLogin] = useState(false); // Used as a switch between login and sign up form
  const [username, setUsername] = useState(""); // Stores username
  const [password, setPassword] = useState(""); // Stores Password
  const [email, setEmail] = useState(""); // Stores Email
  const [code, setCode] = useState(""); // Stores the verification code
  const [enableVerify, setEnableVerify] = useState(false); // Used to switch from sign up form to verify form

  const submitHandler = async () => {
    if (login) {
      // User is loging in
      // Checks for missing creds
      if (!username || !password) {
        toast.error("Missing Credentials");
        return;
      }
      try {
        // Signs in the user
        const user = await Auth.signIn(username, password);
        // Sets the user (this will only be done on login)
        dispatch(setUser(user.attributes.email));
        // User is taken to files page
        router.push("/files");
      } catch (error) {
        console.log("error signing in", error);
      }
    } else {
      // User is signing up
      // Checks for missing creds
      if (!username || !password || !email) {
        toast.error("Missing Credentials");
        return;
      }
      try {
        // Users sign up and receive a verification code
        const { user } = await Auth.signUp({
          username,
          password,
          attributes: {
            email,
          },
          autoSignIn: {
            enabled: true,
          },
        });

        // Switches to verification form
        setEnableVerify(true);
      } catch (error) {
        console.log("Error Signing Up: ", error);
      }
    }
  };

  function listentoAuthSignInEvent() {
    // User actions are caught here
    Hub.listen("auth", ({ payload }) => {
      const { event } = payload;
      if (event === "autoSignIn") {
        const user = payload.data;
        console.log("Auto Sign In User: " + user);
      } else if (event === "autoSignIn_failure") {
        console.log("FAILED: " + payload);
      } else if (event === "signIn") {
        const user = payload.data;
        // Sets the user
        dispatch(setUser(user.attributes.email));
        router.push("/files");
      }
    });
  }

  const verifyHandler = async () => {
    try {
      // Confirming Verification Code
      const a = await Auth.confirmSignUp(username, code);
      console.log("Confirmed: " + a);
    } catch (error) {
      console.log("Error Confirming: ", error);
    }
  };

  listentoAuthSignInEvent();

  return (
    <>
      <Head>
        <title>Auth</title>
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
        {/* // UI Element */}
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
            disabled={enableVerify}
            style={{
              backgroundColor: `${enableVerify ? "#81818A" : "transparent"}`,
            }}
          />
          {/* Form Switching */}
          {login ? (
            <></>
          ) : (
            <input
              className={styles.input}
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={enableVerify}
              style={{
                backgroundColor: `${enableVerify ? "#81818A" : "transparent"}`,
              }}
            />
          )}
          <input
            className={styles.input}
            type="password"
            placeholder={login ? "Enter Password" : "Set Password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={enableVerify}
            style={{
              backgroundColor: `${enableVerify ? "#81818A" : "transparent"}`,
            }}
          />
          {!login && (
            <p className={styles.rule}>
              Password length must be atleast 8 characters
            </p>
          )}
          {/* Verification form switch */}
          {enableVerify ? (
            <input
              className={styles.input}
              type="text"
              placeholder="Enter verification code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          ) : (
            <></>
          )}

          {enableVerify ? (
            <button className={styles.submit} onClick={verifyHandler}>
              Verify your account
            </button>
          ) : (
            <button className={styles.submit} onClick={submitHandler}>
              {login ? "Log In" : "Create an account"}
            </button>
          )}
          <button
            className={styles.switch}
            onClick={() => {
              // Switching between main forms hides verification form
              setLogin((prev) => !prev);
              setEnableVerify(false);
            }}
          >
            {login ? "or signup" : "or login"}
          </button>
        </form>
      </div>
    </>
  );
};

export default Authenticate;
