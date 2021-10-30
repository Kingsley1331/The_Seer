import { useEffect } from "react";
import useMove from "./useMove";
import { rainbowKite } from "../../consts/patterns";

export default function useKeyboard(gridDimensions) {
  console.log("sdgg");
  const [move, pattern] = useMove(rainbowKite);

  useEffect(() => {
    const keydownHandler = (e) => {
      console.log("keyCode", e.keyCode);
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

  return pattern;
}
