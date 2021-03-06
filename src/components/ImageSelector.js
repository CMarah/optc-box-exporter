import { useRef }  from "react";
import titlebg     from "../titlebg.png";
import BrownButton from "./BrownButton.js";

const ImageSelector = ({
  loading,
  setLoading,
  setResults,
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

  return (
    <div style={{position: "relative"}}>
      <div style={{
        display: "flex",
      }}>
        <div style={{backgroundImage: `url(${titlebg})`}} className="panelTitle">
          SCREENSHOTS
        </div>
        <div style={{position: "absolute", right: "1em", top: "0.5em"}}>
          <BrownButton
            fontSize={"1em"}
            text={"GO!"}
            disabled={loading || !inputImages.length}
            onClick={() => {
              setLoading(true);
              setResults([]);
              runProcess();
            }}
          />
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
