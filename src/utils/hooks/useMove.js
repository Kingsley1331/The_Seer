import { useState } from "react";

export default function useMove(initialPattern) {
  const [pattern, setPattern] = useState(initialPattern);

  const move = (axis, step, gridDims) => {
    console.log({ axis, step, gridDims });
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

  return [move, pattern, setPattern];
}
