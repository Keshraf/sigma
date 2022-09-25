import { useDispatch, useSelector } from "react-redux";
import { setCurrentPage } from "../store/pageSlice";
import styles from "../styles/SmallBoard.module.css";

const SmallBoard = ({ page }) => {
  const dispatch = useDispatch();
  const background = useSelector((state) => state.background);
  const current = useSelector((state) => state.page.current);
  const pageBackground = background.filter((element) => element.page === page);
  const latestBackground = pageBackground[pageBackground.length - 1];

  const selectHandler = (e) => {
    dispatch(
      setCurrentPage({
        current: page,
      })
    );
  };

  return (
    <div
      style={{
        backgroundImage: `url(${latestBackground?.background})`,
        backgroundColor: `${latestBackground?.background}`,
        borderColor: `${current === page ? "#303544" : "#20222D"}`,
        opacity: `${current === page ? "1" : "0.4"}`,
      }}
      className={styles.board}
      onClick={selectHandler}
    ></div>
  );
};

export default SmallBoard;
