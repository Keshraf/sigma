import styles from "./ShapesForm.module.css";

const ShapesForm = () => {
  return (
    <div className={styles.formLayout}>
      <div className={styles.shapesLayout}>
        <div className={styles.shapesContainer}>
          <div className={styles.square}></div>
        </div>
        <div className={styles.shapesContainer}>
          <div className={styles.circle}></div>
        </div>
        <div className={styles.shapesContainer}>
          <div className={styles.line}></div>
        </div>
        <div className={styles.shapesContainer}>
          <div className={styles.triangle}></div>
        </div>
      </div>
      <div className={styles.clickButtonUnshaded}>
        <label
          htmlFor="color"
          style={{ cursor: "pointer" }}
          className={styles.buttonLabel}
        >
          <div
            style={{
              width: "24px",
              height: "24px",
              backgroundColor: "#000000",
              border: "1px solid #121219",
            }}
          />
          #000000
        </label>
        <input
          type="color"
          placeholder="Color"
          id="color"
          style={{ display: "none" }}
        ></input>
      </div>
      <button className={`${styles.submitButton}`}>Insert</button>
    </div>
  );
};

export default ShapesForm;
