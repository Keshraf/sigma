import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { FiCopy } from "react-icons/fi";
import styles from "../styles/CodeModal.module.css";

const CodeModal = ({ setModalOpen }) => {
  const router = useRouter();

  const copyHandler = () => {
    navigator.clipboard.writeText(router.query.q);
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
        <div className={styles.codeContainer}>{router.query.q}</div>
      </div>
    </div>
  );
};

export default CodeModal;
