import React from "react";
import styles from "./style.module.scss";
function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.header__container}>Сalculators</div>
    </header>
  );
}

export default Header;
