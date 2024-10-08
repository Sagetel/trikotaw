"use client";
import { useState, useEffect } from "react";
import styles from "./style.module.scss";
import CalculationResult from "../сalculationResult";
import { typesOfLacing } from "@/scripts/tables";
import DropdownMenu from "../dropdownMenu";
function Calculator() {
  const [coefsTex, setCoefsTex] = useState([1, 1]);

  const [tex, setTex] = useState(""); // текст
  const [depth, setDepth] = useState(""); // толщина пряжи и нитей в свободном состоянии
  const [petStep, setPetStep] = useState(""); // петельный шаг, мм
  const [condStep, setCondStep] = useState(""); // условный петельный шаг, мм;
  const [pCondStep, setPCondStep] = useState(""); // приведенный петельный шаг

  const [petHeight, setPetHeight] = useState(""); // высота петельного ряда, мм;
  const [densityHor, setDensityHor] = useState(""); // Плотность по Горизонтали, пет. на 100 мм
  const [densityHorСon, setDensityHorСon] = useState(""); // Плотность по Вертикали, пет. на 100 мм
  const [densityHorСond, setDensityHorCond] = useState(""); // плотность по горизонтали условная, пет. на 100 мм;
  const [densityHorСonP, setDensityHorСonP] = useState(""); // плотность по горизонтали приведенная, пет. на 100 мм;

  const [densityHorBack, setDensityHorBack] = useState(""); // плотность по горизонтали изнанка
  const [densityHorFace, setDensityHorFace] = useState(""); // плотность по горизонтали лицевая

  const [densityHorСonFace, setDensityHorСonFace] = useState(""); // Плотность по Вертикали ЛИЦЕВАЯ, пет. на 100 мм
  const [densityHorСonBack, setDensityHorСonBack] = useState(""); // Плотность по Вертикали ИЗНАНКА, пет. на 100 мм

  const [petLength, setPetLength] = useState(""); // Длина нити в петле, мм
  const [surfaceDensity, setSurfaceDensity] = useState(""); // Поверхностная плотность, г/м^2

  const [densityRatio, setDensityRatio] = useState("");
  const [nCoef, setNCoef] = useState("");
  const [typeOperation, setTypeOperation] = useState(0);

  const [typeWeave, setTypeWeave] = useState({ name: "", id: "" });
  const [typeRraw, setTypeRraw] = useState({ name: "", id: "" });

  const handleChange = (e) => {
    setTex(e.target.value.replace(/[^0-9.]/g, ""));
  };
  const handleChangeCoefs = (e, index) => {
    if (index == 0) {
      setCoefsTex([e.target.value.replace(/[^0-9.]/g, ""), coefsTex[1]]);
    } else {
      setCoefsTex([coefsTex[0], e.target.value.replace(/[^0-9.]/g, "")]);
    }
  };

  const setCoefs = () => {
    const obj = typesOfLacing[typeWeave.id].options[typeRraw.id];
    setDensityRatio(obj.densityRatio);
    setNCoef(obj.nCoef);
    setTypeOperation(obj.typeOperation);
  };

  const handleClickSelectors = (id, type) => {
    if (type === "typeWeave") {
      if (typeWeave.name == typesOfLacing[id].name) {
        setTypeWeave({ name: "", id: "" });
        setTypeRraw({ name: "", id: "" });
      } else {
        setTypeWeave({ name: typesOfLacing[id].name, id: id });
        setTypeRraw({ name: "", id: "" });
      }
    } else {
      if (typeRraw.name == typesOfLacing[typeWeave.id].options[id].name) {
        setTypeRraw({ name: "", id: "" });
      } else {
        setTypeRraw({
          name: typesOfLacing[typeWeave.id].options[id].name,
          id: id,
        });
      }
    }
  };

  useEffect(() => {
    if (tex) {
      setDepth(
        ((1.25 * Math.sqrt(tex * coefsTex[0] * coefsTex[1])) / 31.62).toFixed(3)
      );
    }
  }, [tex, coefsTex]);

  useEffect(() => {
    if (depth && nCoef) {
      switch (typeOperation) {
        case 0:
          setPetStep((nCoef * depth).toFixed(3));
          break;
        case 1:
          setCondStep((nCoef * depth).toFixed(3));
          setPCondStep((5 * depth).toFixed(3));
          break;
        default:
          break;
      }
    }
  }, [depth, nCoef]);

  useEffect(() => {
    if (depth && nCoef) {
      switch (typeOperation) {
        case 0:
          break;
        case 1:
          setDensityHorCond((100 / condStep).toFixed(3));
          setDensityHorСonP((100 / pCondStep).toFixed(3));
          break;
        default:
          break;
      }
    }
  }, [pCondStep, condStep]);

  useEffect(() => {
    if (petStep && densityRatio) {
      switch (typeOperation) {
        case 0:
          setPetHeight((densityRatio * petStep).toFixed(3));
          break;
        case 1:
          break;
        default:
          break;
      }
    }
  }, [petStep, densityRatio]);

  useEffect(() => {
    if (petStep) {
      setDensityHor((100 / petStep).toFixed(3));
    }
  }, [petStep]);

  useEffect(() => {
    if (densityHorСonP) {
      switch (typeOperation) {
        case 0:
          break;
        case 1:
          const result = (densityHorСonP / (1 - 1 / 2) / 2).toFixed(3);
          setDensityHorBack(result);
          setDensityHorFace(result);
          setDensityHor(result);
          break;
        default:
          break;
      }
    }
  }, [densityHorСonP]);

  useEffect(() => {
    if (petHeight || densityHorСond) {
      switch (typeOperation) {
        case 0:
          setDensityHorСon((100 / petHeight).toFixed(3));
          break;
        case 1:
          setDensityHorСon((densityHorСond / densityRatio).toFixed(3));
          break;
        default:
          break;
      }
    }
  }, [petHeight, densityHorСond]);

  useEffect(() => {
    if (petHeight || densityHorСon) {
      switch (typeOperation) {
        case 0:
          setPetLength(
            (1.57 * petStep + 2 * petHeight + 3.14159 * depth).toFixed(3)
          );
          break;
        case 1:
          setPetLength(
            (
              157 / densityHorСond +
              200 / densityHorСon +
              3.14159 * depth
            ).toFixed(3)
          );
          break;
        default:
          break;
      }
    }
  }, [petHeight, densityHorСon]);

  useEffect(() => {
    if (petLength) {
      switch (typeOperation) {
        case 0:
          setSurfaceDensity(
            (
              0.0001 *
              densityHorСon *
              densityHor *
              petLength *
              (tex * 2)
            ).toFixed(3)
          );
          break;
        case 1:
          console.log(densityHor);
          setSurfaceDensity(
            (
              0.0002 *
              densityHor *
              densityHorСon *
              (tex * coefsTex[0] * coefsTex[1]) *
              petLength
            ).toFixed(3)
          );
          break;
        default:
          break;
      }
    }
  }, [petLength]);

  const fields = [
    {
      name: "d",
      value: depth,
      desc: "Толщина пряжи и нитей в свободном состоянии, мм",
      unit: "мм",
      method: `\\frac{1.25 \\cdot \\sqrt{${tex} \\cdot ${coefsTex[0]} \\cdot ${coefsTex[1]}}}{31.62}`,
      operations: [0, 1],
    },
    {
      name: "A",
      value: petStep,
      desc: "Петельный шаг, мм",
      unit: "мм",
      method: `4\\cdot${depth}`,
      operations: [0],
    },
    {
      name: "Ay",
      value: condStep,
      desc: "условный петельный шаг, мм",
      unit: "мм",
      method: `4\\cdot${depth}`,
      operations: [1],
    },
    {
      name: "Aп",
      value: pCondStep,
      desc: "Приведенный (?) петельный шаг, мм",
      unit: "мм",
      method: `5\\cdot${depth}`,
      operations: [1],
    },
    {
      name: "B",
      value: petHeight,
      desc: "Высота петельного ряда, мм",
      unit: "мм",
      method: `0.865\\cdot${petStep}`,
      operations: [0],
    },
    {
      name: "Пг",
      value: densityHor,
      desc: "Плотность по горизонтали, пет. на 100 мм",
      unit: "пет",
      method: `\\frac{100}{${petStep}}`,
      operations: [0],
    },
    {
      name: "Пгу",
      value: densityHorСond,
      desc: "Плотность по горизонтали условная, пет. на 100 мм",
      unit: "пет",
      method: `\\frac{100}{${condStep}}`,
      operations: [1],
    },
    {
      name: "Пгп",
      value: densityHorСonP,
      desc: "Плотность по горизонтали приведенная, пет. на 100 мм",
      unit: "пет",
      method: `\\frac{100}{${pCondStep}}`,
      operations: [1],
    },

    {
      name: "Пг`",
      value: densityHorFace,
      desc: "Плотность по горизонтали лицевая",
      unit: "пет",
      method: `\\frac{\\frac{${densityHorСonP}}{(1-1/R)}}{2}`,
      operations: [1],
    },
    {
      name: "Пг``",
      value: densityHorBack,
      desc: "Плотность по горизонтали изнанка",
      unit: "пет",
      method: `\\frac{\\frac{${densityHorСonP}}{(1-1/R)}}{2}`,
      operations: [1],
    },

    {
      name: "Пв",
      value: densityHorСon,
      desc: "Плотность по вертикали, пет. на 100 мм",
      unit: "пет",
      method: `\\frac{${densityHorСond}}{${densityRatio}}`,
      operations: [0, 1],
    },
    // {
    //   name: "Пв`",
    //   value: densityHorСonFace,
    //   desc: "Плотность по вертикали лицевая, пет. на 100 мм",
    //   unit: "пет",
    //   method: `\\frac{100}{${petHeight}}`,
    //   operations: [1],
    // },
    // {
    //   name: "Пв``",
    //   value: densityHorСonBack,
    //   desc: "Плотность по вертикали изнанка, пет. на 100 мм",
    //   unit: "пет",
    //   method: `\\frac{100}{${petHeight}}`,
    //   operations: [1],
    // },

    {
      name: "l",
      value: petLength,
      desc: "Длина нити в петле, мм",
      unit: "мм",
      method: `1.57\\cdot ${petStep} + 2\\cdot ${petHeight} + \\pi\\cdot ${depth}`,
      operations: [0],
    },
    {
      name: "l",
      value: petLength,
      desc: "Длина нити в петле, мм",
      unit: "мм",
      method: `\\frac{157}{${densityHorСond}}+\\frac{200}{${densityHorСon}} + \\pi \\cdot ${depth}`,
      operations: [1],
    },
    {
      name: "p_s",
      value: surfaceDensity,
      desc: "Поверхностная плотность, г/м^2",
      unit: "г/м2",
      method: `10^{-4} \\cdot ${densityHorСon} \\cdot ${densityHor} \\cdot ${petLength} \\cdot (${tex} \\cdot 2)`,
      operations: [0],
    },
    {
      name: "p_s",
      value: surfaceDensity,
      desc: "Поверхностная плотность, г/м^2",
      unit: "г/м2",
      method: `2\\cdot10^{-4} \\cdot ${densityHorFace} \\cdot ${densityHorСon} \\cdot ${
        tex * coefsTex[0] * coefsTex[1]
      } \\cdot ${petLength}`,
      operations: [1],
    },
  ];
  useEffect(() => {
    if (typeRraw.name) {
      setCoefs();
    }
  }, [typeRraw.id]);
  return (
    <div className={styles.calc}>
      <div className={styles.calc__container}>
        <div className={styles.calc__inputs}>
          <label htmlFor="text-input">Введите параметры:</label>
          <input
            id="text-input"
            type="text"
            value={tex}
            onChange={handleChange}
            placeholder="Текс"
          />
          <input
            id="input-сoef1"
            type="text"
            value={coefsTex[0]}
            onChange={(e) => {
              handleChangeCoefs(e, 0);
            }}
            placeholder="Parm 1"
          />
          <input
            id="input-сoef2"
            type="text"
            value={coefsTex[1]}
            onChange={(e) => {
              handleChangeCoefs(e, 1);
            }}
            placeholder="Parm 1"
          />{" "}
          // 14, 30
          <DropdownMenu
            selected={typeWeave.name}
            list={typesOfLacing}
            handleClickSelectors={handleClickSelectors}
            type="typeWeave"
            placeholder="Выбрать вид переплетения"
          />
          {typeWeave.name && (
            <DropdownMenu
              selected={typeRraw.name}
              list={typesOfLacing[typeWeave.id].options}
              handleClickSelectors={handleClickSelectors}
              type="typeRraw"
              placeholder="Выбрать вид сырья"
            />
          )}
        </div>
        <div className={styles.calc__results}>
          {fields.map(
            (el, index) =>
              el.operations.includes(typeOperation) && (
                <CalculationResult el={el} key={index} />
              )
          )}
        </div>
      </div>
    </div>
  );
}

export default Calculator;
