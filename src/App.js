import { useEffect, useState, useCallback, useRef } from "react";
import PatternedGrid from "./components/PatternedGrid";
import { rainbowKite } from "./consts/patterns";
import {
  calculatePatternUnitDimensions,
  addPattern,
  initialiseGrid,
  shuffleGridData
} from "./utils";

import { coverGrid, moveRandomly } from "./utils/movement";
import useMove from "./utils/hooks/useMove";

import { DEFAULT_GRID_DIMENSION, DEFAULT_WIDTH } from "./consts/config";
import "./styles.css";

export default function App() {
  const [shuffledGridData, setShuffledGridData] = useState([]);
  const [movements, setMovements] = useState([]);
  const [orderMap, setOrderMap] = useState([]);
  const [gridData, setGridData] = useState(() =>
    initialiseGrid(DEFAULT_GRID_DIMENSION)
  );

  const [coverageType, setCoverageType] = useState("Coverage");
  const [gridUnits, setGridUnits] = useState(DEFAULT_GRID_DIMENSION);
  const [coverSettings, setCoverSettings] = useState({ reps: 1, lines: 1 });
  const [randomPathSettings, setRandomPathSettings] = useState({
    pathLength: 5,
    numOfSteps: 200
  });
  const [period, setPeriod] = useState(100);

  const [pattern, setPattern] = useState(rainbowKite);

  const [move, patternDisplay, setParternDisplay] = useMove(pattern);

  const [playing, setPlaying] = useState(false);

  const t1 = useRef(null);

  const addMovements = useCallback(() => {
    if (!movements.length) {
      if (coverageType === "Coverage") {
        setMovements(
          coverGrid(gridUnits, 1, coverSettings.reps, coverSettings.lines)
        );
      }
      if (coverageType === "Random") {
        setMovements(
          moveRandomly(
            randomPathSettings.pathLength,
            randomPathSettings.numOfSteps,
            1
          )
        );
      }
    }
  }, [
    gridUnits,
    coverSettings.reps,
    coverSettings.lines,
    coverageType,
    randomPathSettings.pathLength,
    randomPathSettings.numOfSteps,
    movements
  ]);

  const moveFunction = useCallback(function () {
    setMovements((moves) => {
      if (moves && moves.length) {
        const [, ...rest] = moves;
        return rest;
      }
    });
  }, []);

  const removeOrderMap = useCallback(() => {
    setOrderMap([]);
  }, []);

  const createOrderMap = useCallback(() => {
    const orderMap = shuffleGridData(gridData);

    setOrderMap(orderMap);
  }, [setOrderMap, gridData]);

  useEffect(() => {
    if (movements && movements.length) {
      const [axis, step] = movements[0];
      move(axis, step, gridUnits);
    }
    if (!movements.length) {
      clearInterval(t1.current);
      setPlaying(false);
    }
  }, [movements, gridUnits]);

  const mover = useCallback(() => {
    addMovements();
    if (!playing) {
      setPlaying(true);
      t1.current = setInterval(moveFunction, period);
    } else {
      setPlaying(false);
      clearInterval(t1.current);
    }
  }, [playing, addMovements, moveFunction, period]);

  const resetGrid = useCallback(() => {
    let gridData2 = initialiseGrid(gridUnits);
    gridData2 = addPattern(gridData2, patternDisplay);
    setGridData(gridData2);
  }, [patternDisplay, gridUnits]);

  const reset = useCallback(() => {
    setParternDisplay(pattern);
    resetGrid();
    setMovements([]);
    removeOrderMap();
    createOrderMap();
  }, [
    resetGrid,
    setMovements,
    createOrderMap,
    removeOrderMap,
    pattern,
    setParternDisplay
  ]);
  // console.log('Num of moves', movements.length);

  const gridDimensions = gridUnits;
  const width = DEFAULT_WIDTH;
  const unitLength = width / gridDimensions.x;

  const {
    patternUnitwidth,
    patternUnitHeight
  } = calculatePatternUnitDimensions(rainbowKite);

  useEffect(() => {
    resetGrid();
  }, [resetGrid]);

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
    createOrderMap();
  }, []); // dependency array should be empty

  useEffect(() => {
    const shuffledGridData = randomiseGridData(gridData, orderMap);

    setShuffledGridData(shuffledGridData);
  }, [gridData, orderMap]);

  const onChangeCoverageType = useCallback((e) => {
    setCoverageType(e.target.value);
    setMovements([]);
  }, []);

  return (
    <>
      <div className={"gridWrapper"}>
        <div className={"gridContainer"}>
          <h3>Display</h3>
          <PatternedGrid
            name={"myCanvas"}
            gridDimensions={gridDimensions}
            width={width}
            unitLength={width / gridDimensions.x}
            gridData={gridData}
          />
        </div>
        <div className={"gridContainer"}>
          <h3>Scrambled</h3>
          <PatternedGrid
            name={"myCanvas2"}
            gridDimensions={gridDimensions}
            width={width}
            unitLength={width / gridDimensions.x}
            gridData={shuffledGridData}
          />
        </div>
        <div className={"gridContainer"}>
          <h3>Model</h3>
          <PatternedGrid
            name={"myCanvas3"}
            gridDimensions={gridDimensions}
            width={width}
            unitLength={width / gridDimensions.x}
            gridData={shuffledGridData}
          />
        </div>
        <div className={"gridContainer"}>
          <h3>Pattern</h3>
          <PatternedGrid
            name={"myCanvas1"}
            gridDimensions={{ x: patternUnitwidth, y: patternUnitHeight }}
            width={patternUnitwidth * unitLength}
            unitLength={unitLength}
            gridData={patternGridData}
          />
        </div>
      </div>
      <button onClick={mover}>{playing ? "Pause" : "Play"}</button>
      <button onClick={reset}>Reset</button>
      <br />
      <br />
      <div className="type">
        <input
          checked={coverageType === "Coverage"}
          id="coverage"
          type="radio"
          value="Coverage"
          name="coverage_type"
          onChange={onChangeCoverageType}
        />
        <label htmlFor="coverage">Coverage</label>
        <input
          checked={coverageType === "Random"}
          id="random"
          type="radio"
          value="Random"
          name="coverage_type"
          onChange={onChangeCoverageType}
        />
        <label htmlFor="random">Random</label>
      </div>

      <div className={"settingsWrapper"}>
        <div className={"grid"}>
          <h2>Grid settings</h2>
          <div>
            x
            <input
              type="number"
              onChange={(e) => {
                // console.log(e.target.value);
                setGridUnits((units) => ({ ...units, x: e.target.value }));
              }}
              value={gridUnits.x}
            />
          </div>
          <div>
            y
            <input
              type="number"
              onChange={(e) => {
                // console.log(e.target.value);
                setGridUnits((units) => ({ ...units, y: e.target.value }));
              }}
              value={gridUnits.y}
            />
          </div>
        </div>
        {coverageType === "Coverage" && (
          <div className={"cover"}>
            <h2>Grid cover</h2>
            <div>
              reps
              <input
                type="number"
                onChange={(e) => {
                  // console.log(e.target.value);
                  setCoverSettings((settings) => ({
                    ...settings,
                    reps: e.target.value
                  }));
                }}
                value={coverSettings.reps}
              />
            </div>
            <div>
              lines
              <input
                type="number"
                onChange={(e) => {
                  // console.log(e.target.value);
                  setCoverSettings((settings) => ({
                    ...settings,
                    lines: e.target.value
                  }));
                }}
                value={coverSettings.lines}
              />
            </div>
          </div>
        )}

        {coverageType === "Random" && (
          <div className={"random"}>
            <h2>Random motion</h2>
            <div className={"settingsContainer"}>
              <div>
                path length
                <input
                  type="number"
                  onChange={(e) => {
                    // console.log(e.target.value);
                    setRandomPathSettings((settings) => ({
                      ...settings,
                      pathLength: e.target.value
                    }));
                  }}
                  value={randomPathSettings.pathLength}
                />
              </div>
              <div>
                No. of steps
                <input
                  type="number"
                  onChange={(e) => {
                    // console.log(e.target.value);
                    setRandomPathSettings((settings) => ({
                      ...settings,
                      numOfSteps: e.target.value
                    }));
                  }}
                  value={randomPathSettings.numOfSteps}
                />
              </div>
            </div>
          </div>
        )}
      </div>
      <br />
      <button>Apply Changes</button>
    </>
  );
}
