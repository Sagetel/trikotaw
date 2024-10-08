"use client";
import React, { useState } from "react";
import styles from "./style.module.scss";
import clsx from "clsx";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
const CalculationResult = ({ el }) => {
  const [methodIsOpen, setMethodIsOpen] = useState(false);
  const handleClickMark = () => {
    setMethodIsOpen(!methodIsOpen);
  };
  return (
    <div className={styles.calc}>
      <div className={styles.calc__up}>
        <div className={styles.calc__name}>{el.name}:</div>
        {el.value && (
          <div className={styles.calc__value}>
            {el.value} {el.unit}
          </div>
        )}
        <div
          className={clsx(
            styles.calc__mark,
            methodIsOpen && styles.calc__rotate
          )}
          onClick={() => {
            handleClickMark();
          }}
        ></div>

        <div className={styles.tooltip}>
          <div className={styles.tooltip__mark}>?</div>
          <div className={styles.tooltiptext}>{el.desc}</div>
        </div>
      </div>
      <div
        className={clsx(
          styles.calc__method,
          methodIsOpen && styles.calc__active
        )}
      >
        <BlockMath math={`${el.method}=${el.value}`} />
      </div>
    </div>
  );
};

export default CalculationResult;
