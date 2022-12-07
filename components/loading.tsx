import React, { useEffect } from "react";
import styles from "../styles/loading.module.css";

const Loading = ({ className }: { className?: string }) => {
  return (
    <div className={className}>
      <div className={styles.spinner}>
        <div className={styles.bounce1} />
        <div className={styles.bounce2} />
        <div className={styles.bounce3} />
      </div>
    </div>
  );
};

export default Loading;
