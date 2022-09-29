import { useState } from "react";
import styles from "../styles/Files.module.css";
import Image from "next/image";

const Files = () => {
  const [query, setQuery] = useState("");
  const [fileCode, setFileCode] = useState("");
  const files = [
    {
      name: "Pitch Deck X",
      id: "xyz",
    },
    {
      name: "Pitch Deck 2",
      id: "abc",
    },
    {
      name: "Pitch Deck X",
      id: "xyz",
    },
    {
      name: "Pitch Deck X",
      id: "xyz",
    },
    {
      name: "Pitch Deck X",
      id: "xyz",
    },
    {
      name: "Pitch Deck X",
      id: "xyz",
    },
    {
      name: "Pitch Deck X",
      id: "xyz",
    },
    {
      name: "Pitch Deck X",
      id: "xyz",
    },
    {
      name: "Pitch Deck Xuvewrhbuiheurheuhburehbugvrhbe",
      id: "xyz",
    },
    {
      name: "Pitch Deck X",
      id: "xyz",
    },
    {
      name: "Pitch Deck X",
      id: "xyz",
    },
    {
      name: "Pitch Deck X",
      id: "xyz",
    },
    {
      name: "Pitch Deck X",
      id: "xyz",
    },
  ];

  const openFolderHandler = (id) => {
    console.log(id);
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.blur}></div>
        <h1 className={styles.heading}>Your Projects</h1>
        <div className={styles.innerContainer}>
          <div className={styles.search}>
            <input
              className={styles.searchBar}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for files"
            />
            <button className={styles.submit}>+ Project</button>
          </div>
          <div className={styles.folderContainer}>
            {files.map((file, index) => {
              return (
                <div
                  className={styles.folderBox}
                  key={index}
                  onClick={() => openFolderHandler(file.id)}
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
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Files;
