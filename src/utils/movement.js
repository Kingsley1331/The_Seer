const moveOnPath = (length, axis, stepSize) => {
  const movements = [];
  for (let i = 0; i < length; i++) {
    movements.push([axis, stepSize]);
  }
  return movements;
};

/**NOTE: Step sizes other 1 may not work with this function */
export const coverGrid = (
  gridDimensions,
  stepSize,
  repitions = 1,
  lineCount = 1
) => {
  const { x: gridX, y: gridY } = gridDimensions;
  let movements = [];

  const gridCoverer = (mvs) => {
    for (let j = 0; j < gridY; j++) {
      mvs = [
        ...mvs,
        ...moveOnPath(lineCount * gridX, "x", stepSize),
        ...moveOnPath(lineCount * gridX, "x", -stepSize),
        ["y", stepSize]
      ];
    }

    for (let j = 0; j < gridX; j++) {
      mvs = [
        ...mvs,
        ...moveOnPath(lineCount * gridY, "y", stepSize),
        ...moveOnPath(lineCount * gridY, "y", -stepSize),
        ["x", stepSize]
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

export const moveRandomly = (pathLength, numberOfSteps, stepSize) => {
  let movements = [];

  const directions = [
    ["x", "+"],
    ["x", "-"],
    ["y", "+"],
    ["y", "-"]
  ];

  const selectDirection = (dirs) => {
    const numOfDirections = dirs.length;
    const dirIndex = Math.floor(numOfDirections * Math.random());

    return dirs[dirIndex];
  };

  let currentDirection = selectDirection(directions);

  for (let i = 0; i < numberOfSteps; i++) {
    if (i % pathLength === 0) {
      currentDirection = selectDirection(directions);
      const isDirPositive = currentDirection[1] === "+";

      movements.push(
        ...moveOnPath(
          pathLength,
          currentDirection[0] || "x",
          isDirPositive ? stepSize : -1 * stepSize
        )
      );
    }
  }
  movements.length = numberOfSteps;
  console.log({ movements });
  return movements;
};
