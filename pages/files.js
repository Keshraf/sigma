import styles from "../styles/Files.module.css";

// React Next
import { useEffect, useState } from "react";
import Image from "next/image";
import Head from "next/head";
import { useRouter } from "next/router";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { setInitialRoom } from "../store/roomSlice";
import { resetBackground } from "../store/backgroundSlice";
import { resetElement } from "../store/elementSlice";
import { resetSelected } from "../store/selectedElementSlice";
import { resetPage } from "../store/pageSlice";

// Firebase
import { database } from "../firebaseConfig";
import { set, ref, get, child } from "firebase/database";

// Other libs
import { nanoid } from "nanoid";
import { FiLogOut } from "react-icons/fi";

const Files = () => {
  const user = useSelector((state) => state.user.user); // Gets the current logged in user's email
  const router = useRouter();
  const dispatch = useDispatch();
  const [query, setQuery] = useState(""); // Sets the search query
  const [name, setName] = useState(""); // Sets the name of the new folder
  const [projects, setProjects] = useState([]); // Stores all the projects of the logged in user
  const [newProject, setNewProject] = useState(false); // State for checking whether user is adding a new project

  // Resets the Redux Store so that the state of multiple rooms don't clash
  const resetHandler = () => {
    dispatch(resetBackground());
    dispatch(resetElement());
    dispatch(resetPage());
    dispatch(resetSelected());
  };

  // Runs when a new folder is clicked
  const openFolderHandler = (id, name, pages) => {
    if (!id) {
      return;
    }
    dispatch(
      setInitialRoom({
        admin: user,
        name,
        pages,
        id,
      })
    );
    resetHandler();
    router.push(`/edit?q=${id}`);
  };

  useEffect(() => {
    // Checks if someone is logged or not
    console.log(user);
    if (!user) {
      router.push("/auth");
    }

    // Gets all the rooms and stores the ones created by the user
    get(child(ref(database), `rooms`)).then((snapshot) => {
      if (snapshot.exists()) {
        // Loops over each available room
        snapshot.forEach((childSnapshot) => {
          const childValue = childSnapshot.val();
          console.log(childValue);
          // Checks all the available rooms for the one owned by the user
          if (childValue.admin === user) {
            setProjects((prev) => [
              ...prev,
              {
                id: childSnapshot.key,
                name: childValue.name,
              },
            ]);
          }
        });
      } else {
        // Prints this if there are no elements
        console.log("No data available");
      }
    });
  }, [user, router]);

  // Runs when creates a new project
  const addProjectHandler = () => {
    if (!user) {
      console.log("No User Found!");
      return;
    }
    if (!name) {
      console.log("No User Found!");
      setName("Untitled");
    }
    //Creates a room Id
    const room = nanoid();
    // Adds the user as the admin of the room
    set(ref(database, "rooms/" + room), {
      admin: user,
      name,
      pages: 1,
    });

    // Sets the initial room status
    dispatch(
      setInitialRoom({
        admin: user,
        name,
        pages: 1,
        id: room,
      })
    );
    // Resets all the previous Redux state
    resetHandler();
    router.push(`/edit?q=${room}`);
  };

  const logoutHandler = () => {
    resetHandler();
    router.push("/");
  };

  return (
    <>
      <Head>
        <title>Files</title>
        <link rel="icon" href="/images/Sigma Logo.png" />
      </Head>
      <div className={styles.container}>
        <div className={styles.blur}></div>
        <div className={styles.header}>
          <h1 className={styles.heading}>Projects</h1>
          <button className={styles.logout} onClick={logoutHandler}>
            <FiLogOut style={{ fontSize: "18px" }} />
          </button>
        </div>
        <div className={styles.innerContainer}>
          {/* Conditionally switches between the search bar and the projects */}
          <div className={styles.search}>
            {newProject ? (
              <input
                className={styles.searchBar}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name the folder"
              />
            ) : (
              <input
                className={styles.searchBar}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for files"
              />
            )}
            {!newProject && (
              <button
                className={styles.submit}
                onClick={() => setNewProject(true)}
              >
                + Project
              </button>
            )}
            {newProject && (
              <button className={styles.submit} onClick={addProjectHandler}>
                Add
              </button>
            )}
            {newProject && (
              <button
                className={styles.cancel}
                onClick={() => setNewProject(false)}
              >
                Cancel
              </button>
            )}
          </div>
          <div className={styles.folderContainer}>
            {projects.length !== 0 ? (
              // Filters the files by matching the file names with the entered query
              // Turns both the file name and query to lowercase to remove case-sensitivity
              // Maps over the filtered array
              // Creates a file for each which onClick takes the user to the respective project
              projects
                .filter((file) =>
                  file.name.toLowerCase().startsWith(query.toLowerCase())
                )
                .map((file, index) => {
                  return (
                    <div
                      className={styles.folderBox}
                      key={index}
                      onClick={() =>
                        openFolderHandler(file.id, file.name, file.pages)
                      }
                    >
                      <Image
                        src="/images/folder.png"
                        alt="folder"
                        width="60px"
                        height="50px"
                      />
                      <p className={styles.folderName}>{file.name}</p>
                    </div>
                  );
                })
            ) : (
              /* Renders Image to convey that the folder is empty */
              <div className={styles.empty}>
                <Image
                  src="/images/Create Folder.png"
                  alt="folder"
                  width="200px"
                  height="200px"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Files;
