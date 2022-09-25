import { useDrag, useGesture } from "@use-gesture/react";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { animated, useSpring } from "react-spring";
import { updateElement } from "../store/elementSlice";
import { setSelectedElement } from "../store/selectedElementSlice";
import styles from "../styles/ItemResizer.module.css";
import * as FeatherIcons from "react-icons/fi";
import { child, get, onValue, ref, update } from "firebase/database";
import { database } from "../firebaseConfig";
import { useEffect } from "react";
import { useCallback } from "react";
import { useMemo } from "react";

const ItemResizer = ({ info, disable, updated, children }) => {
  const dispatch = useDispatch();
  const selectedId = useSelector((state) => state.selectedElement.id);
  const roomId = useSelector((state) => state.room.id);
  let selected = false;
  if (selectedId === info.id) {
    selected = true;
  }

  const imgRef = useRef(null);
  const textRef = useRef(null);

  const dragElRef = useRef(null);
  const [{ x, y, width, height }, api] = useSpring(() => ({
    x: info ? info.x : 0,
    y: info ? info.y : 0,
    width: info ? info.width : 100,
    height: info ? info.height : 100,
  }));

  useEffect(() => {
    if (!updated) {
      return;
    }
    api.set({
      x: info.x,
      y: info.y,
      height: info.height,
      width: info.width,
    });
  }, [updated, api, info]);

  const elementUpdate = useCallback(() => {
    console.log("USE CALLBACK CALLED!");

    const dbRef = ref(database);
    get(child(dbRef, `elements/${roomId}`)).then((snapshot) => {
      if (snapshot.exists()) {
        console.log(snapshot.val());
        snapshot.forEach((childSnapshot) => {
          const childValue = childSnapshot.val();
          if (childValue.id === info.id) {
            console.log(childValue);
            update(ref(database, `elements/${roomId}/${childSnapshot.key}`), {
              height: height.get(),
              width: width.get(),
              x: x.get(),
              y: y.get(),
            });
          }
        });
      } else {
        console.log("No data available");
      }
    });
  }, [roomId, info.id, height, width, x, y]);

  const imageLoadHandler = (e) => {
    if (info.loaded) {
      return;
    }
    console.log("LOADED!: " + info.loaded);
    const naturalHeight = e.target.naturalHeight;
    const naturalWidth = e.target.naturalWidth;

    if (naturalHeight > 500) {
      naturalWidth = naturalWidth * (500 / naturalHeight);
      naturalHeight = 500;
    }
    if (naturalWidth > 800) {
      naturalHeight = naturalHeight * (800 / naturalWidth);
      naturalWidth = 800;
    }

    const newData = {
      id: info.id,
      width: naturalWidth,
      height: naturalHeight,
      x: x.get(),
      y: y.get(),
    };
    console.log(newData);
    dispatch(updateElement(newData));
    api.set({
      width: naturalWidth,
      height: naturalHeight,
    });

    const dbRef = ref(database);
    get(child(dbRef, `elements/${roomId}`)).then((snapshot) => {
      if (snapshot.exists()) {
        console.log(snapshot.val());
        snapshot.forEach((childSnapshot) => {
          const childValue = childSnapshot.val();
          if (childValue.id === info.id) {
            console.log(childValue);
            update(ref(database, `elements/${roomId}/${childSnapshot.key}`), {
              height: height.get(),
              width: width.get(),
              x: x.get(),
              y: y.get(),
              loaded: true,
            });
          }
        });
      } else {
        console.log("No data available");
      }
    });
  };
  const bind = useDrag(
    (state) => {
      if (disable) {
        return;
      }
      if (selectedId !== info.id) {
        dispatch(
          setSelectedElement({
            id: info.id,
            ...info,
          })
        );
      }
      if (!state.dragging) {
        console.log(state.dragging);
        elementUpdate();
        return;
      }

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
        ref={textRef}
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
        onLoad={imageLoadHandler}
        ref={imgRef}
      />
    );
  } else if (info?.type === "icon") {
    const icon = FeatherIcons[info.name];
    element = (
      <div
        style={{
          color: info.color,
          fontSize: `${info.size}px`,
        }}
      >
        {icon()}
      </div>
    );
  } else if (info?.type === "shape") {
    if (info.shape === "square") {
      element = (
        <div
          className={styles.square}
          style={{ backgroundColor: info.color }}
        ></div>
      );
    } else if (info.shape === "circle") {
      element = (
        <div
          className={styles.circle}
          style={{ backgroundColor: info.color }}
        ></div>
      );
    } else if (info.shape === "triangle") {
      element = (
        <div
          className={styles.triangle}
          style={{ backgroundColor: info.color }}
        ></div>
      );
    } else if (info.shape === "line") {
      element = (
        <div
          className={styles.line}
          style={{ backgroundColor: info.color }}
        ></div>
      );
    }
  }

  const itemSelected = selected && !disable;

  return (
    <animated.div
      className={itemSelected ? styles.item : styles.unselectedItem}
      style={{ x, y, width, height, cursor: `${disable ? "default" : "move"}` }}
      onClick={(e) => {
        dispatch(
          setSelectedElement({
            id: info.id,
            ...info,
          })
        );
      }}
      {...bind()}
    >
      {info ? element : children}
      <div
        className={styles.resizer}
        ref={dragElRef}
        style={{ display: `${itemSelected ? "block" : "none"}` }}
      />
    </animated.div>
  );
};

export default ItemResizer;
