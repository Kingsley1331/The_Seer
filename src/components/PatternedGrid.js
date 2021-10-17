import Grid from "./Grid";
import Canvas from "./Canvas";

export default function PatternedGrid(props) {
  return (
    <>
      <Canvas name={props.name} />
      <Grid {...props} />
    </>
  );
}
