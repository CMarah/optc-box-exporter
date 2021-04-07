import {
  useState,
  useRef,
  useEffect,
}                          from "react";
import {
  UNITS_DATA,
  relevant,
}                          from "./data.js";
import { evolutions }      from "./evolutions.js";
import { processImages }   from "./cv.js";
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
const purl       = process.env.PUBLIC_URL;
const types = ["STR", "DEX", "QCK", "PSY", "INT"];
const relevant_by_type = [-1, 0, 1, 2, 3, 4, 5].map(
  tn => relevant.filter(u => tn === types.findIndex(t => t === u[2]))
);

const App = () => {
  const [ box, setBox ]                         = useState(
    !localStorage.getItem("optc-box") ? [] :
      localStorage.getItem("optc-box").split(",").map(id => parseInt(id))
  );
  const [ display_box, setDisplayBox ]          = useState(true);
  const [ inputImages, setInputImages ]         = useState([]);
  const [ results, setResults ]                 = useState([]);
  const [ progress, setProgress ]               = useState("Initializing...");
  const [ loading, setLoading ]                 = useState(false);
  const downloadAnchorRef = useRef(null);
  const copiedRef         = useRef(null);

  useEffect(() => {
    console.log("SAVE BOX");
    localStorage.setItem("optc-box", box);
  }, [box]);

  const runProcess = () => {
    processImages(
      setProgress,
      r => {
        setProgress("Loading assets...");
        setLoading(false);
        setResults(r);
        setBox(r.map(c => c.id));
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

  const havePreevolution = id => {
    return box.some(id_b => evolutions[id_b] === id);
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
        }}>OPTC Box Manager</h1>
      </div>
      {display_box ? relevant_by_type.map(g => (
        <div className="grid">
          {g
            .filter(x => [5,"5+",6,"6+"].includes(x[4]))
            .map((x, k) => {
              return (
                <div style={{
                  cursor: "pointer",
                  opacity: box.includes(x[0]) ? 1 : 0.5,
                  position: "relative",
                }}
                  onClick={()=> {
                    setBox(box.includes(x[0]) ?
                      box.filter(id => id !== x[0]) :
                      box.concat(x[0])
                    )
                  }}
                >
                  <div className="frame"
                    style={{border: !box.includes(x[0]) && havePreevolution(x[0]) && "5px solid cyan"}}
                  ></div>
                  <img key={k} src={purl + `/portraits/${x[0]}.png`} alt=""/>
                </div>
              );
            })
          }
        </div>
      )) : (<div style={{display: "flex"}}>
        <div className="mainPanel" style={{marginRight: "1em", marginLeft: "15%"}}>
          <ImageSelector
            loading={loading}
            setLoading={setLoading}
            setResults={setResults}
            inputImages={inputImages}
            setInputImages={setInputImages}
            runProcess={runProcess}
          />
        </div>
        <div className="mainPanel" style={{marginLeft: "1em", marginRight: "15%"}}>
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
            <div style={{width: "100%", color: "white", textAlign: "center"}}>
              {results.length ? `Found
                ${new Set(results.map(c => c.id).filter(id => id)).size}
                unique characters,
                ${results.length - new Set(results.map(c => c.id)).size} duplicates.
              ` : ""}
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
      </div>)}
    </div>
    <div id="hidden" style={{display: 'none'}}>
      <a ref={downloadAnchorRef} download="box.txt" href="/">Save</a>
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
