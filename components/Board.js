import ItemResizer from "./ItemResizer";
import styles from "./Board.module.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { removeElement } from "../store/elementSlice";
import { resetSelected } from "../store/selectedElementSlice";
import Image from "next/image";

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

const Board = () => {
  const selected = useSelector((state) => state.selectedElement.id);
  const background = useSelector((state) => state.background);
  const board = useRef();
  const dispatch = useDispatch();

  const elements = useSelector((state) => state.elements);

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
        backgroundImage: `url(${background?.background})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundColor: `${background?.background}`,
      }}
      onClick={selectHandler}
      onKeyDown={detectKeyDown}
      ref={board}
    >
      {elements.map((element) => {
        return <ItemResizer info={element} key={element.id} />;
      })}
    </div>
  );
};

export default Board;
