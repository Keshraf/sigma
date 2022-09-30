import toast from "react-hot-toast";
import { FiCopy } from "react-icons/fi";
import { useSelector } from "react-redux";
import styles from "../styles/CodeModal.module.css";

const CodeModal = ({ setModalOpen }) => {
  const roomId = useSelector((state) => state.room.id);

  // Attaches the text to the clipboard
  const copyHandler = () => {
    navigator.clipboard.writeText(roomId);
    toast.success("Copied to Clipboard!");
    console.log("Copied!");
    setModalOpen(false);
  };

  return (
    <div className={styles.container} onClick={() => setModalOpen(false)}>
      <div className={styles.innerContainer}>
        <div className={styles.iconContainer} onClick={copyHandler}>
          <FiCopy style={{ fontSize: "18px" }} />
        </div>
        <div className={styles.codeContainer}>{roomId}</div>
      </div>
    </div>
  );
};

export default CodeModal;
