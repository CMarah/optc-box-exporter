import { useState,
  useRef,
}                          from "react";
import UNITS_DATA          from "./data.js";
import processImages       from "./cv.js";
import bg                  from "./bg.png";
import titlebg             from "./titlebg.png";
import logo                from "./OPTC_logo.png";
import load_logo           from "./loading.png";
import ImageSelector       from "./components/ImageSelector";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSave,
  faCopy,
}                          from '@fortawesome/free-solid-svg-icons';
import "./style.css";

const OPTCDB_URL = "https://optc-db.github.io/characters/#/view/";
const END_K      = UNITS_DATA.length;
const purl       = process.env.PUBLIC_URL;

const App = () => {
  const [ inputImages, setInputImages ] = useState([]);
  const [ results, setResults ]         = useState([]);
  const [ progress, setProgress ]       = useState(0);
  const [ loading, setLoading ]         = useState(false);
  const downloadAnchorRef = useRef(null);

  const runProcess = () => {
    setLoading(true);
    setResults([]);
    processImages(
      setProgress,
      r => {
        setProgress(0);
        setLoading(false);
        setResults(r.reduce((acc, g) => acc.concat(g), []));
        console.log("Done", r);
      },
    );
  };

  const copyResults = () => {
    navigator.clipboard.writeText(
      results.map(c => c.id)
    );
  };

  const saveResults = () => {
    const content = results.map(c => c.id);
    const href = `data:text/plain;charset=utf-8,${encodeURIComponent(content)}`;
    downloadAnchorRef.current.href = href;
    downloadAnchorRef.current.click();
  };

  return (<>
    <div style={{backgroundImage: `url(${bg})`}} className="mainContent">
      <div style={{textAlign: "center", padding: "2em", color: "white"}}>
        <img src={logo} alt=""/>
        <h1 style={{
          color: "rgb(254 247 177)",
          textShadow: "3px 3px black",
          fontWeight: 900,
        }}>OPTC Box Exporter</h1>
      </div>
      <div className="row">
        <div className="mainPanel">
          <ImageSelector
            loading={loading}
            setLoading={setLoading}
            inputImages={inputImages}
            setInputImages={setInputImages}
            runProcess={runProcess}
          />
        </div>
        <div className="mainPanel">
          <div style={{display: "flex", position: "relative"}}>
            <div style={{backgroundImage: `url(${titlebg})`}} className="panelTitle">
              CHARACTERS
            </div>
            <div className="button" style={{right: "4em"}} onClick={copyResults} title="Copy">
              <FontAwesomeIcon icon={faCopy} size="lg"/>
            </div>
            <div className="button" onClick={saveResults} title="Save">
              <FontAwesomeIcon icon={faSave} size="lg"/>
            </div>
          </div>
          <div style={{display: 'flex', flexWrap: 'wrap', marginBottom: '1em'}}>
            {results.length ?
              results.map((r, i) => (
                <div style={{ width: '20%', textAlign: 'center', marginTop: '1em' }} key={i}>{
                  r.id && <img key={i} alt="" src={purl + `/portraits/${r.id}.png`}
                    style={{cursor: "pointer"}}
                    onClick={()=> window.open(OPTCDB_URL + r.id, "_blank")}
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
                <img className="rotating" alt="" src={load_logo}/>
                {progress >= 100 ? "100%" :
                  progress > 0 ? `${progress}%` : "Reading images..."
                }
              </div>) : (<div style={{minHeight: "50vh"}}></div>)
            }
          </div>
        </div>
      </div>
    </div>
    <div id="hidden" style={{display: 'none'}}>
      <a ref={downloadAnchorRef} download="box.txt" href="">Save</a>
      <img id="scorner" src={purl + "/images/scorner.png"} alt=""/>
      <img id="dcorner" src={purl + "/images/dcorner.png"} alt=""/>
      <img id="qcorner" src={purl + "/images/qcorner.png"} alt=""/>
      <img id="pcorner" src={purl + "/images/pcorner.png"} alt=""/>
      <img id="icorner" src={purl + "/images/icorner.png"} alt=""/>
      <img id="xcorner" src={purl + "/images/xcorner.png"} alt=""/>
      <ul id="compares">
        <img id="compare" alt=""/>
        {(new Array(END_K)).fill(0).map((x,k) => (
          <img id={`compare${k+1}`} key={k} style={{display: "none"}} alt=""
            src={purl + `/portraits/${k+1}.png`}
          />
        ))}
      </ul>
      {inputImages.map((img, i) => (
        <img id={`fullImageOriginal${i}`} alt="" src={img} key={i} className="fullImage"/>
      ))}
    </div>
  </>);
};

export default App;
