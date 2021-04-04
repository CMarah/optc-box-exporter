import { useState,
  useRef,
}                          from "react";
import UNITS_DATA          from "./data.js";
import {
  processImages,
}                          from "./cv.js";
import bg                  from "./bg.png";
import titlebg             from "./titlebg.png";
import logo                from "./OPTC_logo.png";
import load_logo           from "./loading.png";
import filler              from "./images/lang_bg.png";
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
  const [ inputImages, setInputImages ]         = useState([]);
  const [ loadedLastImage, setLoadedLastImage ] = useState(false);
  const [ results, setResults ]                 = useState([]);
  const [ progress, setProgress ]               = useState("Initializing...");
  const [ loading, setLoading ]                 = useState(false);
  const downloadAnchorRef = useRef(null);
  const copiedRef         = useRef(null);

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

  const copyResults = () => {
    copiedRef.current.style.transition = '0.1s';
    copiedRef.current.style.opacity = 1;
    navigator.clipboard.writeText(
      results.map(c => c.id)
    );
    setTimeout(() => {
      copiedRef.current.style.transition = '0.4s';
      copiedRef.current.style.opacity = 0;
    }, 600);
  };

  const saveResults = () => {
    const content = results.map(c => c.id);
    const href = `data:text/plain;charset=utf-8,${encodeURIComponent(content)}`;
    downloadAnchorRef.current.href = href;
    downloadAnchorRef.current.click();
  };

  return (<>
    <div style={{
      width: "100%",
      left: 0,
      zIndex: 1,
      background: `url(${filler}) repeat-x`,
      height: "24px",
      backgroundPositionY: "-15px",
    }}></div>
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
            setResults={setResults}
            inputImages={inputImages}
            setInputImages={setInputImages}
            runProcess={runProcess}
            loadedLastImage={loadedLastImage}
          />
        </div>
        <div className="mainPanel">
          <div style={{display: "flex", position: "relative"}}>
            <div style={{backgroundImage: `url(${titlebg})`}} className="panelTitle">
              CHARACTERS
            </div>
            <div ref={copiedRef} style={{
              opacity: 0,
              background: "grey",
              borderRadius: "0.2em",
              position: "absolute",
              right: "3em",
              top: "3em",
              padding: "0.5em",
              color: "white",
              zIndex: "20",
            }}>Copied!</div>
            <div className="button" style={{right: "4em"}} onClick={copyResults} title="Copy">
              <FontAwesomeIcon icon={faCopy} size="lg"/>
            </div>
            <div className="button" onClick={saveResults} title="Save">
              <FontAwesomeIcon icon={faSave} size="lg"/>
            </div>
          </div>
          <div style={{display: 'flex', flexWrap: 'wrap', marginBottom: '1em'}}>
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
      </div>
    </div>
    <div id="hidden" style={{display: 'none'}}>
      <a ref={downloadAnchorRef} download="box.txt" href="/">Save</a>
      <img id="scorner" src={purl + "/images/scorner.png"} alt=""/>
      <img id="dcorner" src={purl + "/images/dcorner.png"} alt=""/>
      <img id="qcorner" src={purl + "/images/qcorner.png"} alt=""/>
      <img id="pcorner" src={purl + "/images/pcorner.png"} alt=""/>
      <img id="icorner" src={purl + "/images/icorner.png"} alt=""/>
      <img id="xcorner" src={purl + "/images/xcorner.png"} alt=""/>
      <div>
        {(new Array(END_K)).fill(0).map((x,k) => (
          <img id={`compare${k+1}`} key={k} style={{display: "none"}} alt=""
            src={purl + `/sp/${k+1}.png`} className="compare"
            onLoad={() => {
              if (k === (END_K-1)) setLoadedLastImage(true)
            }}
          />
        ))}
      </div>
      {inputImages.map((img, i) => (
        <img id={`fullImageOriginal${i}`} alt="" src={img} key={i} className="fullImage"/>
      ))}
    </div>
    <div style={{
      width: "100%",
      left: 0,
      zIndex: 1,
      background: `url(${filler}) repeat-x`,
      backgroundPositionY: "-15px",
      transform: "rotate(180deg)",
      height: "24px",
    }}></div>
  </>);
};

export default App;
