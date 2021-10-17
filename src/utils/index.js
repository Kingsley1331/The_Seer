export const setCanvasWidth = (canvas, width, gridDimensions) => {
  const { x, y } = gridDimensions;
  const height = width * (y / x);

  canvas.setAttribute("width", width);
  canvas.setAttribute("height", height);

  const canvasWidth = canvas.clientWidth;
  const canvasHeight = canvas.clientHeight;

  return { canvasWidth, canvasHeight };
};

export const displayGrid = (context, gridData, size) => {
  gridData.forEach((unit) => {
    context.fillStyle = unit.colour;
    context.fillRect(unit.x * size, unit.y * size, size, size);
  });
};

export const addPattern = (gridData, patternArray) => {
  gridData.forEach((unit) => {
    patternArray.forEach((pixel) => {
      if (unit.x === pixel.x && unit.y === pixel.y) {
        unit.colour = pixel.colour;
      }
    });
  });
  return gridData;
};

export const initialiseGrid = (gridDimensions) => {
  const { x: gridUnitsX, y: gridUnitsY } = gridDimensions;
  const gridData = [];
  for (let j = 0; j < gridUnitsX; j++) {
    for (let k = 0; k < gridUnitsY; k++) {
      gridData.push({
        x: j,
        y: k,
        colour: "transparent"
      });
    }
  }
  return gridData;
};

export const drawGrid = (
  context,
  gridDimensions,
  unitLength,
  canvasDimensions
) => {
  const { canvasWidth, canvasHeight } = canvasDimensions;

  const gridPointsArrays = { x: [], y: [] };

  for (let i = 0; i < gridDimensions?.x; i++) {
    gridPointsArrays.x.push(i * unitLength);
  }

  for (let j = 0; j < gridDimensions?.y; j++) {
    gridPointsArrays.y.push(j * unitLength);
  }

  context.save();
  context.lineWidth = 0.2;

  gridPointsArrays.x.forEach((numb) => {
    context.moveTo(numb, 0);
    context.lineTo(numb, canvasHeight);
  });

  gridPointsArrays.y.forEach((numb) => {
    context.moveTo(0, numb);
    context.lineTo(canvasWidth, numb);
  });

  context.stroke();
  context.restore();
};

export const calculatePatternUnitDimensions = (pattern) => {
  const patternUnitwidth = Math.max(...pattern.map((cell) => cell.x + 1));
  const patternUnitHeight = Math.max(...pattern.map((cell) => cell.y + 1));
  return { patternUnitwidth, patternUnitHeight };
};

export const shuffleArray = (array) => {
  const randomNumbers = array.map(() => Math.random());
  const arrayWithRandomNumberID = array.map((ele, index) => ({
    id: randomNumbers[index],
    value: ele
  }));

  const sortedRandomNumbers = randomNumbers.sort((a, b) => a - b);

  const shuffledArray = sortedRandomNumbers.map(
    (num) => arrayWithRandomNumberID.filter((ele) => ele.id === num)[0].value
  );
  return shuffledArray;
};

/** shuffleGridData: takes gridData and creates an array based on the indices of it elements
 * it shuffles the indices. The shuffled indices represent a map of the shuffling
 */

export const shuffleGridData = (gridData) => {
  const indicesArray = gridData.map((item, index) => index);

  const shuffledIndices = shuffleArray(indicesArray);

  const orderMap = shuffledIndices.map((num) => num);

  return orderMap;
};

// console.log("shuffledArray", shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]));
