import { useEffect, useState } from "react";
import PatternedGrid from "./components/PatternedGrid";
import { rainbowKite } from "./consts/patterns";
import {
  calculatePatternUnitDimensions,
  addPattern,
  initialiseGrid,
  shuffleGridData
} from "./utils";
import {
  DEFAULT_GRID_DIMENSION,
  DEFAULT_WIDTH,
  DEFAULT_UNIT_LENGTH
} from "./consts/config";
import "./styles.css";

export default function App() {
  const [pattern, setPattern] = useState(rainbowKite);
  const [shuffledGridData, setShuffledGridData] = useState([]);
  const [orderMap, setOrderMap] = useState([]);
  const [gridData, setGridData] = useState(() =>
    initialiseGrid(DEFAULT_GRID_DIMENSION)
  );

  const move = (axis, step, gridDims) => {
    setPattern((pattern) =>
      pattern.map((cell) => {
        const newCell = { ...cell };
        if (newCell[axis] + step + 1 > gridDims[axis] && step > 0) {
          newCell[axis] = (newCell[axis] + step) % gridDims[axis];
        } else if (newCell[axis] + step < 0 && step < 0) {
          newCell[axis] =
            gridDims[axis] + ((newCell[axis] + step) % gridDims[axis]);
        } else {
          newCell[axis] += step;
        }

        return newCell;
      })
    );
  };

  useEffect(() => {
    const keydownHandler = (e) => {
      switch (e.keyCode) {
        case 37: // left
          move("x", -1, gridDimensions);
          break;
        case 39: // right
          move("x", 1, gridDimensions);
          break;
        case 38: //up
          move("y", -1, gridDimensions);
          break;
        case 40: // down
          move("y", 1, gridDimensions);
          break;
        default:
          null;
      }
    };

    document.addEventListener("keydown", keydownHandler);

    return () => document.removeEventListener("keydown", keydownHandler);
  });

  const gridDimensions = DEFAULT_GRID_DIMENSION;
  const width = DEFAULT_WIDTH;
  const unitLength = DEFAULT_UNIT_LENGTH;

  const {
    patternUnitwidth,
    patternUnitHeight
  } = calculatePatternUnitDimensions(rainbowKite);

  useEffect(() => {
    let gridData2 = initialiseGrid(gridDimensions);

    gridData2 = addPattern(gridData2, pattern);

    setGridData(gridData2);
  }, [pattern, gridDimensions]);

  /**Remove duplication */
  let patternGridData = initialiseGrid(gridDimensions);

  patternGridData = addPattern(patternGridData, rainbowKite);

  const randomiseGridData = (data, map) => {
    const randomisedGridData = [];

    map.forEach((num, index) => {
      const updatedCell = { ...data[index], colour: data[num].colour };
      randomisedGridData.push(updatedCell);
    });

    return randomisedGridData;
  };

  useEffect(() => {
    const orderMap = shuffleGridData(gridData);

    setOrderMap(orderMap);
  }, []);

  useEffect(() => {
    const shuffledGridData = randomiseGridData(gridData, orderMap);

    setShuffledGridData(shuffledGridData);
  }, [gridData, orderMap]);

  return (
    <>
      <PatternedGrid
        name={"myCanvas"}
        gridDimensions={gridDimensions}
        width={width}
        unitLength={width / gridDimensions.x}
        gridData={gridData}
      />

      <PatternedGrid
        name={"myCanvas1"}
        gridDimensions={{ x: patternUnitwidth, y: patternUnitHeight }}
        width={patternUnitwidth * unitLength}
        unitLength={unitLength}
        gridData={patternGridData}
      />

      <PatternedGrid
        name={"myCanvas2"}
        gridDimensions={gridDimensions}
        width={width}
        unitLength={width / gridDimensions.x}
        gridData={shuffledGridData}
      />

      <br />
      <button onClick={() => move("x", -1, gridDimensions)}>Move left</button>
      <button onClick={() => move("x", 1, gridDimensions)}>Move right</button>
      <button onClick={() => move("y", -1, gridDimensions)}>Move up</button>
      <button onClick={() => move("y", 1, gridDimensions)}>Move down</button>
    </>
  );
}