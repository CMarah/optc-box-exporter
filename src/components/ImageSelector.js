import { useRef, useEffect } from "react";
import titlebg               from "../titlebg.png";
import gobg                  from "../images/areas.png";

const ImageSelector = ({
  loading,
  setLoading,
  inputImages,
  setInputImages,
  runProcess,
}) => {
  const fileInputEl = useRef(null);

  const loadInput = e => {
    if (!e.target.files || !e.target.files.length) return;
    let files = [];
    for (let i = 0; i < e.target.files.length; ++i) {
      files.push(URL.createObjectURL(e.target.files[i]));
    }
    setInputImages(inputImages.concat(files));
  };

  useEffect(() => {
    if (loading) {
      runProcess();
    }
  }, [loading]);

  return (
    <div style={{position: "relative"}}>
      <div style={{
        display: "flex",
      }}>
        <div style={{backgroundImage: `url(${titlebg})`}} className="panelTitle">
          SCREENSHOTS
        </div>
        <div style={{
          backgroundImage: `url(${gobg})`,
          backgroundSize: "contain",
          position: "absolute",
          right: "1em",
          top: "0.5em",
          width: "7.8em",
          height: "2em",
          cursor: loading || !inputImages.length ? "" : "pointer",
          opacity: loading || !inputImages.length ? "0.5" : "",
        }}
          className="gobtn"
          onClick={() => !loading && inputImages.length && setLoading(true)}
        >
          <div style={{
            backgroundColor: "#ac4d2a",
            width: "91%",
            margin: "auto",
            marginTop: "0.4em",
            height: "1.26em",
            textAlign: "center",
            lineHeight: "1.26em",
            color: "white",
            textShadow: "1px 1px black",
          }}>GO!</div>
        </div>
      </div>
      <div style={{
        marginBottom: "4em",
        display: "flex",
        flexWrap: "wrap",
      }}>
        {inputImages.map((img, i) => (
          <div className="imageDiv" key={i} title="Click to remove" onClick={
            () => {setInputImages([...inputImages.slice(0,i), ...inputImages.slice(i+1)])}
          }>
            <img id="imageOriginal" alt="" src={img} className="inputImage" key={i}/>
          </div>
        ))}
        <div className="imageDiv" style={{
          borderRadius: "3em",
          border: "3px solid #8080806e",
          textAlign: "center",
          fontWeight: 800,
          color: "grey",
        }}
          onClick={() => { fileInputEl.current.click(); }}
        >
          <div style={{marginTop: "1.8em", fontSize: "6em"}}>+</div>
        </div>
      </div>
      <input type="file" id="imageInput" name="file" onChange={loadInput}
        style={{display: "none"}} multiple="multiple"
        ref={fileInputEl}
      />
    </div>
  );
};

export default ImageSelector;
