const Canvas = ({ name }) => {
  return (
    <canvas
      id={name}
      width="300"
      height="300"
      style={{ border: "1px solid" }}
    />
  );
};

export default Canvas;
