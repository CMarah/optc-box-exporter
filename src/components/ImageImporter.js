import { useState }      from "react";
import { processImages } from "../cv.js";
import ImageSelector     from "./ImageSelector";
import titlebg           from "../titlebg.png";
import load_logo         from "../loading.png";
import BrownButton       from "./BrownButton.js";

const purl       = process.env.PUBLIC_URL;
const OPTCDB_URL = "https://optc-db.github.io/characters/#/view/";

const ImageImporter = ({
  box,
  setBox,
  setDisplayImporter,
}) => {
  const [ results, setResults ]                  = useState([]);
  const [ progress, setProgress ]                = useState("Initializing...");
  const [ loading, setLoading ]                  = useState(false);
  const [ inputImages, setInputImages ]          = useState([]);

  const runProcess = () => {
    processImages(
      setProgress,
      r => {
        setProgress("Loading assets...");
        setLoading(false);
        setResults(r);
      },
    );
  };

  return (<div className="importer">
    <div className="mainPanel" style={{marginRight: "1em"}}>
      <ImageSelector
        loading={loading}
        setLoading={setLoading}
        setResults={setResults}
        inputImages={inputImages}
        setInputImages={setInputImages}
        runProcess={runProcess}
      />
    </div>
        <div className="mainPanel" style={{marginLeft: "1em"}}>
          <div style={{display: "flex", position: "relative"}}>
            <div style={{backgroundImage: `url(${titlebg})`}} className="panelTitle">
              CHARACTERS
            </div>
          </div>
          <div style={{display: 'flex', flexWrap: 'wrap', marginBottom: '1em'}}>
            <div style={{width: "100%", color: "white", textAlign: "center"}}>
              {results.length ? `Found
                ${new Set(results.map(c => c.id).filter(id => id)).size}
                unique characters,
                ${results.length - new Set(results.map(c => c.id)).size} duplicates.
              ` : ""}
            </div>
            <div style={{
              display: results.length ? "flex" : "none",
              justifyContent: "space-between",
              width: "100%",
              height: "3em",
              margin: "0 auto",
              padding: "0 5em",
            }}>
              <BrownButton
                text="Add to box"
                disabled={false}
                onClick={() => {
                  const new_ids = results.map(c => c.id);
                  setBox([...new Set(box.concat(new_ids))]);
                  setDisplayImporter(false);
                }}
              />
              <BrownButton
                text="Replace box"
                disabled={false}
                onClick={() => {
                  const new_ids = results.map(c => c.id);
                  setBox([...new Set(new_ids)]);
                  setDisplayImporter(false);
                }}
              />
            </div>
            {results.length ? [...new Set(results.map(c => c.id))]
              .filter(id => id)
              .map((id, i) => (
                <div style={{ width: '20%', textAlign: 'center', marginTop: '1em' }} key={i}>{
                  id && <img key={i} alt="" src={purl + `/portraits/${id}.png`}
                    style={{cursor: "pointer", maxWidth:"100%"}}
                    onClick={()=> window.open(OPTCDB_URL + id, "_blank")}
                  />
                }</div>
              )) : loading ? (<div style={{
                paddingTop: "5em",
                display: "flex",
                flexDirection: "column",
                textAlign: "center",
                margin: "auto",
                color: "white",
              }}>
                <div style={{height: "10em"}}>
                  <img className="rotating" alt="" src={load_logo}/>
                </div>
                {progress}
              </div>) : (<div style={{minHeight: "50vh"}}></div>)
            }
          </div>
        </div>
        <div style={{display: "none"}}>
          {inputImages.map((img, i) => (
            <img id={`fullImageOriginal${i}`} alt="" src={img} key={i} className="fullImage"/>
          ))}
        </div>
    </div>);
};

export default ImageImporter;
