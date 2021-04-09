import gobg from "../images/btnbg.png";

const BrownButton = ({
  fontSize,
  text,
  disabled,
  onClick,
}) => (
  <div style={{
    backgroundImage: `url(${gobg})`,
    backgroundSize: "contain",
    width: "7.8em",
    height: "2em",
    cursor: !disabled ? "pointer" : "",
    opacity: !disabled ? "" : "0.5",
    fontSize: fontSize,
  }}
  className="gobtn"
  onClick={() => {
    if (!disabled) onClick();
  }}>
    <div className="brown-button">{text}</div>
  </div>
);

export default BrownButton;
