import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useState, useMemo } from "react";
import ColorSwatch from "../src/components/ColorSwatch";
import Color from "color";

const TIMEOUT_BETWEEN_TRIALS_MS = 1500;

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomColor() {
  const red = getRandomInt(0, 255);
  const green = getRandomInt(0, 255);
  const blue = getRandomInt(0, 255);
  return Color.rgb([red, green, blue]);
}

function createColorVariation(sourceColor: Color, difficultyPercent = 10) {
  const colorVariantArray = sourceColor.rgb().array();
  const rgbChannelToChange = getRandomInt(0, 2);
  const colorOffset = getRandomInt(
    10,
    Math.floor(255 - 255 * (difficultyPercent / 100))
  );
  colorVariantArray[rgbChannelToChange] =
    (colorVariantArray[rgbChannelToChange] + colorOffset) % 255;
  const colorVariant = Color.rgb(colorVariantArray);
  console.log(
    `created variant ${colorVariant.rgb()} from ${sourceColor.rgb()}. rgbChannelToChange: ${
      rgbChannelToChange === 0
        ? "red"
        : rgbChannelToChange === 1
        ? "green"
        : "blue"
    }. colorOffset: ${colorOffset}. difficultyPercent: ${difficultyPercent}`
  );
  return colorVariant;
}

const useShuffleArray = (colorArray: Color[]) =>
  useMemo(() => {
    const startIndex = getRandomInt(0, colorArray.length);
    const shuffledArray = [
      ...colorArray.slice(startIndex),
      ...colorArray.slice(0, startIndex),
    ];
    return shuffledArray;

    // let currentIndex = colorArray.length,
    //   randomIndex;

    // // While there remain elements to shuffle.
    // while (currentIndex != 0) {
    //   // Pick a remaining element.
    //   randomIndex = Math.floor(Math.random() * currentIndex);
    //   currentIndex--;

    //   // And swap it with the current element.
    //   [colorArray[currentIndex], colorArray[randomIndex]] = [
    //     colorArray[randomIndex],
    //     colorArray[currentIndex],
    //   ];
    // }

    // return colorArray;
  }, [colorArray.toString()]);

const Home: NextPage = () => {
  const [showAnswer, setShowAnswer] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [correctNum, setCorrectNum] = useState(0);
  const [wrongNum, setWrongNum] = useState(0);

  const attempts = correctNum + wrongNum;
  const difficultyPercent = Math.min(attempts * 10, 90);

  const [color1, setColor1] = useState(getRandomColor());
  const [color2, setColor2] = useState(getRandomColor());
  const mixedColor = color1.mix(color2);
  const colorVariant1 = useMemo(
    () => createColorVariation(mixedColor, difficultyPercent),
    [mixedColor.hex()]
  );
  const colorVariant2 = useMemo(
    () => createColorVariation(mixedColor, difficultyPercent),
    [mixedColor.hex()]
  );
  const colorVariantArray = useShuffleArray([
    mixedColor,
    colorVariant1,
    colorVariant2,
  ]);

  console.log(
    `${color1.rgb().toString()} + ${color2.rgb().toString()} = ${mixedColor
      .rgb()
      .toString()} (changed to ${colorVariant1
      .rgb()
      .toString()} and ${colorVariant2.rgb().toString()})`
  );

  console.log(
    `mixed color: ${mixedColor.hex()}. v1: ${colorVariant1.hex()}. v2: ${colorVariant2.hex()}. arr: ${colorVariantArray.map(
      (c) => c.hex()
    )}`
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
            Score:{" "}
            {correctNum + wrongNum === 0
              ? 0
              : Math.floor((correctNum / (correctNum + wrongNum)) * 100)}
            %
          </span>
          <span>Difficulty: {difficultyPercent}</span>
        </header>
        <div className={styles.sourceColors}>
          <ColorSwatch color={color1.hex()} hex={color1.hex()} />{" "}
          <span style={{ fontSize: 20 }}>+</span>
          <ColorSwatch color={color2.hex()} hex={color2.hex()} />
        </div>
        <label className={styles.label}>
          Choose which color is the result of mixing the above two colors:
        </label>
        <div className={styles.targetColors}>
          {colorVariantArray.map((c, i) => {
            const isMixedColor =
              c.rgb().toString() === mixedColor.rgb().toString();
            return (
              <ColorSwatch
                color={c.hex()}
                key={`${c.hex()}`}
                hex={c.hex()}
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
                    setColor1(c);
                    setColor2(getRandomColor());
                  }, TIMEOUT_BETWEEN_TRIALS_MS);
                }}
              />
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

export default Home;
