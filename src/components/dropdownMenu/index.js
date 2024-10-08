"use client";
import { useEffect, useRef, useState } from "react";
import styles from "./style.module.scss";

function DropdownMenu({
  selected,
  list,
  handleClickSelectors,
  type,
  placeholder,
}) {
  const [listIsOpen, setListIsOpen] = useState(false);
  const menuRef = useRef(null);

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setListIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.menu} ref={menuRef}>
      <div
        className={styles.menu__name}
        onClick={() => {
          setListIsOpen(!listIsOpen);
        }}
      >
        {selected ? <span>{selected}</span> : placeholder}
      </div>
      {listIsOpen && (
        <div className={styles.menu__list}>
          {list.map((el, index) => {
            return (
              <div
                className={styles.menu__item}
                key={index}
                onClick={() => {
                  handleClickSelectors(index, type);
                  setListIsOpen(!listIsOpen);
                }}
              >
                {el.name}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default DropdownMenu;
