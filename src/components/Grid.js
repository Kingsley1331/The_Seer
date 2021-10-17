import { useEffect } from "react";
import { setCanvasWidth, displayGrid, drawGrid } from "../utils";

const Grid = ({ name, gridDimensions, width, unitLength, gridData }) => {
  useEffect(() => {
    const canvas = document.getElementById(name);

    let canvasDimensions = setCanvasWidth(canvas, width, gridDimensions);

    const ctx = canvas.getContext("2d");

    drawGrid(ctx, gridDimensions, unitLength, canvasDimensions);

    displayGrid(ctx, gridData, unitLength);
  }, [gridData, name, gridDimensions, width, unitLength]);

  return null;
};

export default Grid;
