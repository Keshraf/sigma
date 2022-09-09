import { useDrag } from "@use-gesture/react";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { animated, useSpring } from "react-spring";
import { updateElement } from "../store/elementSlice";
import { setSelectedElement } from "../store/selectedElementSlice";
import styles from "./ItemResizer.module.css";

const ItemResizer = ({ info, children }) => {
  const dispatch = useDispatch();
  const selectedId = useSelector((state) => state.selectedElement.id);
  let selected = false;
  if (selectedId === info.id) {
    selected = true;
  }

  const dragElRef = useRef(null);
  const [{ x, y, width, height }, api] = useSpring(() => ({
    x: info ? info.x : 0,
    y: info ? info.y : 0,
    width: info ? info.width : 100,
    height: info ? info.height : 100,
  }));

  const bind = useDrag(
    (state) => {
      dispatch(
        setSelectedElement({
          id: info.id,
          ...info,
        })
      );

      const Resizing = state.event.target === dragElRef.current;

      if (Resizing) {
        api.set({
          width: state.offset[0],
          height: state.offset[1],
        });
      } else {
        api.set({
          x: state.offset[0],
          y: state.offset[1],
        });
        dispatch(
          updateElement({
            id: info.id,
            width: width.get(),
            height: height.get(),
            x: x.get(),
            y: y.get(),
          })
        );
      }
    },
    {
      from: (event) => {
        const isResizing = event.target === dragElRef.current;
        if (isResizing) {
          return [width.get(), height.get()];
        } else {
          return [x.get(), y.get()];
        }
      },
      bounds: (state) => {
        const isResizing = state?.event.target === dragElRef.current;
        if (isResizing) {
          return {
            top: 50,
            left: 50,
            right: 960 - x.get(),
            bottom: 540 - y.get(),
          };
        } else {
          return {
            top: 0,
            left: 0,
            right: 960 - width.get(),
            bottom: 540 - height.get(),
          };
        }
      },
    }
  );

  let element;
  if (info?.type === "text") {
    let flex = "center";
    if (info.align === "left") {
      flex = "flex-start";
    } else if (info.align === "right") {
      flex = "flex-end";
    }

    element = (
      <p
        style={{
          fontSize: `${info.size}px`,
          fontFamily: info.font,
          fontWeight: `${info.weight}`,
          width: "100%",
          height: "100%",
          textAlign: info.align,
          color: info.color,
          display: "flex",
          flexDirection: "row",
          justifyContent: flex,
          alignItems: "center",
        }}
      >
        {info.content}
      </p>
    );
  } else if (info?.type === "image") {
    element = (
      <img
        src={info.src}
        alt="img"
        style={{
          width: "100%",
          height: "auto",
          touchAction: "none",
          userSelect: "none",
          overflow: "hidden",
        }}
        draggable={false}
      />
    );
  }

  return (
    <animated.div
      className={selected ? styles.item : styles.unselectedItem}
      style={{ x, y, width, height }}
      onClick={(e) =>
        dispatch(
          setSelectedElement({
            id: info.id,
            ...info,
          })
        )
      }
      {...bind()}
    >
      {info ? element : children}
      <div
        className={styles.resizer}
        ref={dragElRef}
        style={{ display: `${selected ? "block" : "none"}` }}
      />
    </animated.div>
  );
};

export default ItemResizer;
