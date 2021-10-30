import { useEffect, useState, useCallback } from "react";
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
  const [orderMap, setOrderMap] = useState([]);
  const [gridData, setGridData] = useState(() =>
    initialiseGrid(DEFAULT_GRID_DIMENSION)
  );

  const [coverageType, setCoverageType] = useState("Coverage");
  const [gridUnits, setGridUnits] = useState(DEFAULT_GRID_DIMENSION);
  const [coverSettings, setCoverSettings] = useState({ reps: 1, lines: 1 });
  const [randomPathSettings, setRandomPathSettings] = useState({
    pathLength: 5,
    numOfSteps: 10
  });
  const [move, pattern] = useMove(rainbowKite);
  const [playing, setPlaying] = useState(false);

  const mover = useCallback(
    (movements, gridDimensions, interval) => {
      movements.forEach((movement, index) => {
        const [axis, step] = movement;
        const moveFunction = () => {
          move(axis, step, gridDimensions);
        };
        setTimeout(moveFunction, interval * index);
      });
    },
    [move]
  );

  useEffect(() => {
    let movements = [];
    if (playing) {
      if (coverageType === "Coverage") {
        movements = coverGrid(gridUnits, 1, coverSettings.reps);
      }
      if (coverageType === "Random") {
        movements = moveRandomly(
          randomPathSettings.pathLength,
          randomPathSettings.numOfSteps,
          1
        );
      }
      mover(movements, gridUnits, 1000);
    }
  }, [
    gridUnits,
    coverSettings.reps,
    playing,
    coverageType,
    randomPathSettings.pathLength,
    randomPathSettings.numOfSteps
  ]);

  const gridDimensions = gridUnits;
  const width = DEFAULT_WIDTH;
  const unitLength = width / gridDimensions.x;

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

  const togglePlaying = () => {
    setPlaying((state) => !state);
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
      <button onClick={togglePlaying}>{playing ? "Pause" : "Play"}</button>
      <br />
      <br />
      <div className="type">
        <input
          checked={coverageType === "Coverage"}
          id="coverage"
          type="radio"
          value="Coverage"
          name="coverage_type"
          onChange={(e) => {
            console.log(e.target.value);
            setCoverageType(e.target.value);
          }}
        />
        <label htmlFor="coverage">Coverage</label>
        <input
          checked={coverageType === "Random"}
          id="random"
          type="radio"
          value="Random"
          name="coverage_type"
          onChange={(e) => {
            console.log(e.target.value);
            setCoverageType(e.target.value);
          }}
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
                console.log(e.target.value);
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
                console.log(e.target.value);
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
                  console.log(e.target.value);
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
                  console.log(e.target.value);
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
                    console.log(e.target.value);
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
                    console.log(e.target.value);
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
