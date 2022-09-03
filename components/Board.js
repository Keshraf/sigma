import ItemResizer from "./ItemResizer";
import TestImage from "../public/testImage.avif";

const Board = () => {
  return (
    <>
      <ItemResizer>
        <p>New try!</p>
      </ItemResizer>
      <ItemResizer>
        <p>
          There are many different interview styles and methods, and one very
          popular one is called the behavioral interview.
        </p>
      </ItemResizer>
      {/* <ItemResizer
        containerHeight={containerRef.current?.clientHeight}
        containerWidth={containerRef.current?.clientWidth}
      >
        <img
          src={TestImage}
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
      </ItemResizer> */}
    </>
  );
};

export default Board;
