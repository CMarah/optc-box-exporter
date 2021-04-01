import { useRef } from "react";

const ImageSelector = ({
  loading,
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
    <div className="card" style={{minHeight: "50vh", position: "relative"}}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        backgroundColor: "rgba(0,0,0,.03)",
        borderBottom: "1px solid rgba(0,0,0,.125)",
        padding: "0.5em",
      }}>
        <div style={{alignSelf: "center", fontWeight: 600}}>Original Images</div>
        <button type="button" id="processBtn" className="btn btn-primary"
          disabled={loading}
          onClick={runProcess}
        >Detect</button>
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
      <div style={{
        position: "absolute",
        bottom: 0,
        width: "100%",
        color: "#868e96",
        backgroundColor: "rgba(0,0,0,.03)",
        borderTop: "1px solid rgba(0,0,0,.125)",
        padding: "0.5em",
      }}>
        <input type="file" id="imageInput" name="file" onChange={loadInput}
          style={{display: "none"}} multiple="multiple"
          ref={fileInputEl}
        />
      </div>
    </div>
  );
};

export default ImageSelector;
