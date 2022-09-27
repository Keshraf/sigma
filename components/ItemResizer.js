import styles from "../styles/ItemResizer.module.css";

// Animation Library
import { useDrag } from "@use-gesture/react";
import { animated, useSpring } from "react-spring";

// React & Redux
import { useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateElement } from "../store/elementSlice";
import { setSelectedElement } from "../store/selectedElementSlice";

// Feather Icons
import * as FeatherIcons from "react-icons/fi";

// Custom Hook
import useElementUpdate from "../hooks/useElementUpdate";

const ItemResizer = ({ info, disable, updated }) => {
  const dispatch = useDispatch();
  const elementUpdater = useElementUpdate();

  const selectedId = useSelector((state) => state.selectedElement.id); // ID of the selected element

  let selected = false;
  if (selectedId === info.id) {
    selected = true;
  }

  // Reference to the corner-piece which increases the size of the element
  const dragElRef = useRef(null);

  // Sets the initial size & position of an element
  const [{ x, y, width, height }, api] = useSpring(() => ({
    x: info ? info.x : 0,
    y: info ? info.y : 0,
    width: info ? info.width : 100,
    height: info ? info.height : 100,
  }));

  // Updates the size of an element that has been changed
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

  // Changes the size of the image before loading to fit the board
  const imageLoadHandler = (e) => {
    // Checks if the image has been loaded before
    if (info.loaded) {
      return;
    }
    console.log("NOT LOADED!: " + info);
    const naturalHeight = e.target.naturalHeight;
    const naturalWidth = e.target.naturalWidth;

    if (info.height < 500 && info.width < 800) {
      return;
    }

    // Proportionately reduces the size of the image to fit inside the board
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

    // Updates the image data with new size
    dispatch(updateElement(newData));
    api.set({
      width: naturalWidth,
      height: naturalHeight,
    });

    elementUpdater(newData);
  };

  // Uses use-gesture to update the element size and position according to user interaction
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
        const data = {
          height: height.get(),
          width: width.get(),
          x: x.get(),
          y: y.get(),
        };
        elementUpdater(data);
        return;
      }

      // Checks whether the element is being resized instead of being dragged
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
  // Sets the property of each element according to element type
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
        onLoad={imageLoadHandler}
      />
    );
  } else if (info?.type === "icon") {
    if (!info.name) {
      return;
    }
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
    // Sets the element according to their shape type
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
      {element}
      <div
        className={styles.resizer}
        ref={dragElRef}
        style={{ display: `${itemSelected ? "block" : "none"}` }}
      />
    </animated.div>
  );
};

export default ItemResizer;
