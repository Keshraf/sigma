import { useDrag } from "@use-gesture/react";
import { useRef } from "react";
import { animated, useSpring } from "react-spring";
import styles from "./ItemResizer.module.css";

const ItemResizer = ({ containerHeight, containerWidth, children }) => {
  console.log(containerHeight, containerWidth, children);
  const dragElRef = useRef(null);
  const dragElRef2 = useRef(null);
  const dragElRef3 = useRef(null);
  const dragElRef4 = useRef(null);
  const childrenElRef = useRef(children);
  const [{ x, y, width, height }, api] = useSpring(() => ({
    x: 0,
    y: 0,
    width: 100,
    height: 100,
  }));

  const bind = useDrag(
    (state) => {
      const Resizing =
        state.event.target === dragElRef.current ||
        state.event.target === dragElRef2.current ||
        state.event.target === dragElRef3.current ||
        state.event.target === dragElRef4.current;
      //console.log(childrenElRef.current.getBoundingClientRect());
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
      }
    },
    {
      from: (event) => {
        const isResizing =
          event.target === dragElRef.current ||
          event.target === dragElRef2.current ||
          event.target === dragElRef3.current ||
          event.target === dragElRef4.current;
        if (isResizing) {
          return [width.get(), height.get()];
        } else {
          return [x.get(), y.get()];
        }
      },
      bounds: (state) => {
        const isResizing =
          state?.event.target === dragElRef.current ||
          state?.event.target === dragElRef2.current ||
          state?.event.target === dragElRef3.current ||
          state?.event.target === dragElRef4.current;
        if (isResizing) {
          return {
            top: 50,
            left: 50,
            right: 700,
            bottom: 500,
          };
        } else {
          return {
            top: 0,
            left: 0,
            right: 700,
            bottom: 500,
          };
        }
      },
    }
  );

  return (
    <animated.div
      className={styles.item}
      style={{ x, y, width, height }}
      {...bind()}
    >
      {children}
      <div className={styles.resizer} ref={dragElRef} />
      <div className={styles.resizer2} ref={dragElRef2} />
      <div className={styles.resizer3} ref={dragElRef3} />
      <div className={styles.resizer4} ref={dragElRef4} />
    </animated.div>
  );
};

export default ItemResizer;
