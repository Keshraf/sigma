import ItemResizer from "./ItemResizer";
import styles from "../styles/Board.module.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import {
  addElement,
  removeElement,
  updateElement,
} from "../store/elementSlice";
import { resetSelected } from "../store/selectedElementSlice";
import { FiZap } from "react-icons/fi";
import Image from "next/image";
import { setCurrentPage } from "../store/pageSlice";
import {
  onChildAdded,
  onChildChanged,
  onValue,
  ref,
  get,
  child,
  remove,
  onChildRemoved,
} from "firebase/database";
import { database } from "../firebaseConfig";
import { addBackground } from "../store/backgroundSlice";

function useKey(key, cb) {
  const callbackRef = useRef(cb);

  useEffect(() => {
    callbackRef.current = cb;
  });

  useEffect(() => {
    function handle(event) {
      if (event.code === key) {
        callbackRef.current(event);
      }
    }

    document.addEventListener("keyup", handle);
    return () => document.removeEventListener("keypress", handle);
  }, [key]);
}

const Board = ({ page }) => {
  const selected = useSelector((state) => state.selectedElement.id);
  const background = useSelector((state) => state.background);
  const roomId = useSelector((state) => state.room.id);
  const board = useRef();
  const dispatch = useDispatch();
  const [updated, setUpdated] = useState();
  const elements = useSelector((state) => state.elements);
  const pageElements = elements.filter((element) => element.page === page);
  const pageBackground = background.filter((element) => element.page === page);

  useEffect(() => {
    console.log("RANN");
    onValue(
      ref(database, "elements/" + roomId),
      (snapshot) => {
        snapshot.forEach((childSnapshot) => {
          const childValue = childSnapshot.val();
          console.log(childValue);
          dispatch(addElement(childValue));
        });
      },
      {
        onlyOnce: true,
      }
    );

    onValue(
      ref(database, "background/" + roomId),
      (snapshot) => {
        snapshot.forEach((childSnapshot) => {
          const childValue = childSnapshot.val();
          console.log(childValue);
          dispatch(addBackground(childValue));
        });
      },
      {
        onlyOnce: true,
      }
    );
  }, [roomId, dispatch]);

  // UPDATE ELEMENT
  useEffect(() => {
    const elementsRef = ref(database, "elements/" + roomId);
    onChildChanged(elementsRef, (snapshot) => {
      const updatedElement = snapshot.val();
      console.log("UPDATED EL:", updatedElement);
      console.log("UPDATED EL ID:", updatedElement.id);
      if (!updatedElement.id) {
        console.log("RETURNED: " + updatedElement.id);
        return;
      }
      const data = {
        height: updatedElement.height,
        width: updatedElement.width,
        x: updatedElement.x,
        y: updatedElement.y,
        id: updatedElement.id,
      };
      console.log("UPDATED DATA", data, "DATA ID: ", data.id);
      dispatch(updateElement(data));
      setUpdated(data.id);
    });
  }, [roomId, dispatch]);

  // ADD ELEMENT
  useEffect(() => {
    const elementsRef = ref(database, "elements/" + roomId);
    onChildAdded(elementsRef, (snapshot) => {
      const dbRef = ref(database);
      get(child(dbRef, `elements/${roomId}/${snapshot.key}`)).then(
        (childSnapshot) => {
          if (childSnapshot.exists()) {
            const data = childSnapshot.val();
            dispatch(addElement(data));
          } else {
            console.log("No data available");
          }
        }
      );
    });
  }, [roomId, dispatch]);

  // REMOVE ELEMENT
  useEffect(() => {
    const elementsRef = ref(database, "elements/" + roomId);
    onChildRemoved(elementsRef, (snapshot) => {
      const removedElement = snapshot.val();
      const removedId = removedElement.id;
      console.log("removed el: " + removedId);
      dispatch(removeElement({ id: removedId }));
      dispatch(resetSelected());
    });
  }, [roomId, dispatch]);

  // UPDATE BACKGROUND
  useEffect(() => {
    const elementsRef = ref(database, "background/" + roomId);
    onChildAdded(elementsRef, (snapshot) => {
      const updatedBackground = snapshot.val();
      if (!updatedBackground.id) {
        return;
      }
      console.log("UP BG:" + updatedBackground);
      const data = {
        id: updatedBackground.id,
        page: updatedBackground.page,
        background: updatedBackground.background,
        type: updatedBackground.type,
        source: updatedBackground.source,
      };
      console.log(data);
      dispatch(addBackground(data));
    });
  }, [roomId, dispatch]);

  const selectHandler = (e) => {
    if (e.target !== board.current) {
      return;
    }
    dispatch(
      setCurrentPage({
        current: page,
      })
    );
    dispatch(resetSelected());
  };

  const detectKeyDown = (e) => {
    if (e.key !== "Delete") {
      return;
    }

    const dbRef = ref(database);
    get(child(dbRef, `elements/${roomId}`)).then((snapshot) => {
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          const childValue = childSnapshot.val();
          if (childValue.id === selected) {
            console.log("REMOVED!!", childValue.id);
            remove(ref(database, `elements/${roomId}/${childSnapshot.key}`));
          }
        });
      } else {
        console.log("No data available");
      }
    });

    dispatch(
      removeElement({
        id: selected,
      })
    );
    dispatch(resetSelected());
  };

  useKey("Delete", detectKeyDown);

  return (
    <div
      className={styles.board}
      style={{
        backgroundImage: `url(${pageBackground[0]?.background})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundColor: `${pageBackground[0]?.background}`,
      }}
      onClick={selectHandler}
      onKeyDown={detectKeyDown}
      ref={board}
      id="board"
    >
      {pageElements.map((element) => {
        return (
          <ItemResizer
            info={element}
            key={element.id}
            disable={selected === element.id ? false : true}
            updated={updated === element.id ? true : false}
          />
        );
      })}
    </div>
  );
};

export default Board;
