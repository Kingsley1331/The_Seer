const moveOnPath = (length, axis, step) => {
  const movements = [];
  for (let i = 0; i < length; i++) {
    movements.push([axis, step]);
  }
  return movements;
};

export const coverGrid = (gridDimensions, step) => {
  const { x: gridX, y: gridY } = gridDimensions;
  let movements = [];
  for (let j = 0; j < gridY; j++) {
    movements = [
      ...movements,
      ...moveOnPath(gridX, "x", step),
      ...moveOnPath(gridX, "x", -step),
      ["y", step]
    ];
  }

  for (let j = 0; j < gridX; j++) {
    movements = [
      ...movements,
      ...moveOnPath(gridY, "y", step),
      ...moveOnPath(gridY, "y", -step),
      ["x", step]
    ];
  }
  return movements;
};
