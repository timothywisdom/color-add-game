import chroma from "chroma-js";

const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomColor = () => chroma.random();

const getChromaColorScale = (
  fromColor?: chroma.Color,
  toColor?: chroma.Color,
  deltaE = 75
) => {
  const color1 = fromColor ?? chroma.random();
  const color2 = toColor ?? getChromeColorWithinDeltaE(color1, deltaE).color;
  const s = chroma.scale([color1.hex(), color2.hex()]).domain([0, 100]);
  return s;
};

const getChromeColorWithinDeltaE = (
  color1: chroma.Color,
  deltaE: number,
  attempts = 1000
) => {
  let closestDeltaE = 100;
  let closestDeltaEDifference = 100; // totally opposite
  let closestDeltaEColor = chroma.random();
  let i = 0;
  for (i = 0; i < attempts; i++) {
    const currentColor = chroma.random();
    const currentDeltaE = chroma.deltaE(color1, currentColor);
    const differenceInDeltaE = Math.abs(currentDeltaE - deltaE);
    if (differenceInDeltaE < closestDeltaEDifference) {
      closestDeltaE = currentDeltaE;
      closestDeltaEDifference = differenceInDeltaE;
      closestDeltaEColor = currentColor;
      if (differenceInDeltaE < 1) {
        break;
      }
    }
  }
  console.log("getChromeColorWithinDeltaE", {
    color1,
    deltaE,
    closestDeltaEColor,
    closestDeltaE,
    attempts: i,
  });
  return { color: closestDeltaEColor, deltaE: closestDeltaE };
};

export {
  getRandomInt,
  getRandomColor,
  getChromaColorScale,
  getChromeColorWithinDeltaE,
};
