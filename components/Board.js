import ItemResizer from "./ItemResizer";
import styles from "./Board.module.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { removeElement } from "../store/elementSlice";
import { resetSelected } from "../store/selectedElementSlice";
import { FiZap } from "react-icons/fi";
import Image from "next/image";
import { setCurrentPage } from "../store/pageSlice";

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
  const board = useRef();
  const dispatch = useDispatch();

  const elements = useSelector((state) => state.elements);
  const pageElements = elements.filter((element) => element.page === page);
  const pageBackground = background.filter((element) => element.page === page);

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
    >
      {pageElements.map((element) => {
        return <ItemResizer info={element} key={element.id} disable={false} />;
      })}
    </div>
  );
};

export default Board;
