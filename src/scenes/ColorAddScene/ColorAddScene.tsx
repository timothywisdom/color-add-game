import Head from "next/head";
import styles from "../../../styles/Home.module.css";
import { useState, useMemo } from "react";
import ColorSwatch from "../../components/ColorSwatch";
// import Color from "color";
import {
  getRandomInt,
  getRandomColor,
  // getColorVariant,
  getChromaColorScale,
  getChromeColorWithinDeltaE,
} from "../../functions/utils";
import { useRouter } from "next/router";

const TIMEOUT_BETWEEN_TRIALS_MS = 1500;

// const useShuffleArray = (colorArray: chroma.Color[]) =>
//   useMemo(() => {
//     const startIndex = getRandomInt(0, colorArray.length);
//     const shuffledArray = [
//       ...colorArray.slice(startIndex),
//       ...colorArray.slice(0, startIndex),
//     ];
//     return shuffledArray;
//   }, [colorArray.toString()]);

const ColorAddScene = () => {
  const router = useRouter();
  const [showAnswer, setShowAnswer] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [correctNum, setCorrectNum] = useState(0);
  const [wrongNum, setWrongNum] = useState(0);
  const [difficultyPercent, setDifficultyPercent] = useState(10);
  const deltaE = 100 - difficultyPercent;

  const [color1, setColor1] = useState(getRandomColor());

  const {
    color2,
    mixedColor,
    colorVariant1,
    colorVariant2,
    colorVariantArray,
  } = useMemo(() => {
    const colorScale = getChromaColorScale(color1, undefined, 75);
    const color2 = colorScale(100);
    const mixedColor = colorScale(50);

    const colorVariant1 = getChromeColorWithinDeltaE(
      colorScale(35),
      deltaE
    ).color;
    const colorVariant2 = getChromeColorWithinDeltaE(
      colorScale(65),
      deltaE
    ).color;

    const colorArray = [mixedColor, colorVariant1, colorVariant2];
    const startIndex = getRandomInt(0, colorArray.length);
    const colorVariantArray = [
      ...colorArray.slice(startIndex),
      ...colorArray.slice(0, startIndex),
    ];

    return {
      color2,
      mixedColor,
      colorVariant1,
      colorVariant2,
      colorVariantArray,
    };
  }, [color1, difficultyPercent]);

  console.log(
    `${color1.rgb().toString()} + ${color2.rgb().toString()} = ${mixedColor
      .rgb()
      .toString()} (changed to ${colorVariant1
      .rgb()
      .toString()} and ${colorVariant2.rgb().toString()}).`,
    { q: router.query }
  );

  return (
    <div className={styles.container}>
      <Head>
        <title>Color Add Game</title>
        <meta name="description" content="Add colors to win" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <header className={styles.head}>
          <span>Attempts: {correctNum + wrongNum}</span>
          <span>Correct: {correctNum}</span>
          <span>
            <label htmlFor="difficulty">Difficulty:</label>
            <input
              type="range"
              value={difficultyPercent}
              min={1}
              max={99}
              step={1}
              id="difficulty"
              onChange={(e) => {
                setDifficultyPercent(parseInt(e.target.value, 10));
              }}
            />
            {difficultyPercent}
          </span>

          <span>
            Score:{" "}
            {correctNum + wrongNum === 0
              ? 0
              : Math.floor((correctNum / (correctNum + wrongNum)) * 100)}
            %
          </span>
        </header>

        <div className={styles.sourceColors}>
          <ColorSwatch color={color1}>
            <div>{router.query.debug && color1.hex()}</div>
          </ColorSwatch>{" "}
          <span style={{ fontSize: 20 }}>+</span>
          <ColorSwatch color={color2}>
            <div>{router.query.debug && color2.hex()}</div>
          </ColorSwatch>
        </div>

        <label className={styles.label}>
          Choose which color is the result of mixing the above two colors:
        </label>

        <div className={styles.targetColors} id="color-choices">
          {colorVariantArray.map((c, i) => {
            const isMixedColor =
              c.rgb().toString() === mixedColor.rgb().toString();
            return i > colorVariantArray.length ? null : (
              <ColorSwatch
                color={c}
                key={`${c.hex()}`}
                showAnswer={showAnswer}
                isMixedColor={isMixedColor}
                onClick={() => {
                  if (isMixedColor) {
                    setCorrectNum((prev) => prev + 1);
                  } else {
                    setWrongNum((prev) => prev + 1);
                  }
                  setCorrect(isMixedColor);
                  setShowAnswer(true);
                  setTimeout(() => {
                    setShowAnswer(false);
                    setCorrect(false);
                    setColor1(mixedColor);
                  }, TIMEOUT_BETWEEN_TRIALS_MS);
                }}
              >
                <div>{router.query.debug && c.hex()}</div>
              </ColorSwatch>
            );
          })}
        </div>

        <div
          className={styles.result}
          style={{ color: correct ? "green" : "red" }}
        >
          {showAnswer ? (correct ? "Congratulations" : "Oops, try again") : ""}
        </div>
      </main>
    </div>
  );
};

export default ColorAddScene;
