const moveOnPath = (length, axis, step) => {
  const movements = [];
  for (let i = 0; i < length; i++) {
    movements.push([axis, step]);
  }
  return movements;
};

/**NOTE: Step sizes other 1 may not work with this function */
export const coverGrid = (gridDimensions, step, repitions = 1) => {
  const { x: gridX, y: gridY } = gridDimensions;
  let movements = [];

  const gridCoverer = (mvs) => {
    const lineCoverage = 1;
    for (let j = 0; j < gridY; j++) {
      mvs = [
        ...mvs,
        ...moveOnPath(lineCoverage * gridX, "x", step),
        ...moveOnPath(lineCoverage * gridX, "x", -step),
        ["y", step]
      ];
    }

    for (let j = 0; j < gridX; j++) {
      mvs = [
        ...mvs,
        ...moveOnPath(lineCoverage * gridY, "y", step),
        ...moveOnPath(lineCoverage * gridY, "y", -step),
        ["x", step]
      ];
    }

    return mvs;
  };

  const movementCyle = gridCoverer(movements);

  for (let r = 0; r < repitions; r++) {
    movements.push(...movementCyle);
  }

  return movements;
};
