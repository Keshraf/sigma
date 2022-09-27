import ItemResizer from "./ItemResizer";
import styles from "../styles/Board.module.css";

// Redux & Store
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import {
  addElement,
  removeElement,
  updateElement,
  updateIconElement,
  updateShapeElement,
  updateTextElement,
} from "../store/elementSlice";
import { resetSelected } from "../store/selectedElementSlice";
import { setCurrentPage } from "../store/pageSlice";
import { addBackground } from "../store/backgroundSlice";

// Firebase
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

// It used to easily listen to keyboard events
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
  const board = useRef();
  const dispatch = useDispatch();

  const selected = useSelector((state) => state.selectedElement.id); // Gets the selected element
  const background = useSelector((state) => state.background); // Gets all the backgrounds of the room
  const roomId = useSelector((state) => state.room.id); // Gets the current Room id
  const elements = useSelector((state) => state.elements); // Gets all the elements

  const pageElements = elements.filter((element) => element.page === page); // Gets all the elements of the current page
  const pageBackground = background.filter((bg) => bg.page === page); // Gets the background of the current page

  const [updated, setUpdated] = useState();

  // Fetches the latest elements and background of the room and initialises it in the Redux Store
  useEffect(() => {
    console.log("RANN");
    if (roomId === undefined || roomId === null || roomId === "") {
      return;
    }
    onValue(
      ref(database, `elements/${roomId}`),
      (snapshot) => {
        if (!snapshot.exists()) {
          return;
        }
        // Loops through the element list received from the databse and initialises it in Redux
        snapshot.forEach((childSnapshot) => {
          const childValue = childSnapshot.val();
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
        // Loops through the background list received from the database and initialises it in Redux
        snapshot.forEach((childSnapshot) => {
          const childValue = childSnapshot.val();
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
    // Listens to changes in the child elements
    onChildChanged(elementsRef, (snapshot) => {
      const updatedElement = snapshot.val();
      if (!updatedElement.id) {
        return;
      }

      // Updates the position and size of the element
      const data = {
        height: updatedElement.height,
        width: updatedElement.width,
        x: updatedElement.x,
        y: updatedElement.y,
        id: updatedElement.id,
      };
      dispatch(updateElement(data));

      // Checks the element type & updates its specific properties
      if (updatedElement.type === "text") {
        const newText = {
          id: updatedElement.id,
          content: updatedElement.content,
          color: updatedElement.color,
          size: updatedElement.size,
          font: updatedElement.font,
          weight: updatedElement.weight,
          align: updatedElement.align,
        };
        dispatch(updateTextElement(newText));
      } else if (updatedElement.type === "shape") {
        const newShape = {
          color: updatedElement.color,
          id: updatedElement.id,
        };
        dispatch(updateShapeElement(newShape));
      } else if (updatedElement.type === "icon") {
        const newIcon = {
          color: updatedElement.color,
          size: updatedElement.size,
          id: updatedElement.id,
        };
        dispatch(updateIconElement(newIcon));
      }
      setUpdated(data.id);
    });
  }, [roomId, dispatch]);

  // ADDS NEW ELEMENT & SYNCS ADDITIONS MADE BY MULTIPLE USERS
  useEffect(() => {
    const elementsRef = ref(database, "elements/" + roomId);
    // Listens to additions in the element list
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

  // REMOVES ELEMENT & SYNCS IT WITH MULTIPLE USERS
  useEffect(() => {
    const elementsRef = ref(database, "elements/" + roomId);
    // Listens to any removal in the elements list
    onChildRemoved(elementsRef, (snapshot) => {
      const removedElement = snapshot.val();
      const removedId = removedElement.id;
      console.log("removed el: " + removedId);
      dispatch(removeElement({ id: removedId }));
      dispatch(resetSelected());
    });
  }, [roomId, dispatch]);

  // UPDATE BACKGROUND & SYNCS IT WITH MULTIPLE USERS
  useEffect(() => {
    const elementsRef = ref(database, "background/" + roomId);
    // Listens to additions in the background list
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

  // If a user clicks on the board then it unselects the "selected" element
  const selectHandler = (e) => {
    if (e.target !== board.current) {
      return;
    }
    dispatch(resetSelected());
  };

  const detectKeyDown = (e) => {
    if (e.key !== "Delete") {
      return;
    }
    // Returns if there no selected element
    if (!selected) {
      console.log("No ID to Delete!");
      return;
    }
    const deletedId = selected;
    console.log("Id to be deleted: ", deletedId);

    const dbRef = ref(database);
    // Finds the element in the element list and removes it using it's ID
    get(child(dbRef, `elements/${roomId}`)).then((snapshot) => {
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          const childValue = childSnapshot.val();
          if (childValue.id === deletedId) {
            console.log("REMOVED!!", childValue.id);
            remove(ref(database, `elements/${roomId}/${childSnapshot.key}`));
          }
        });
      } else {
        console.log("No data available");
      }
    });

    // Removed from Redux
    dispatch(
      removeElement({
        id: deletedId,
      })
    );
    // No selected element
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
