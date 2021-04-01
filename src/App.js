import { useState }  from "react";
import UNITS_DATA    from "./data.js";
import processImages from "./cv.js";
import bg            from "./bg.png";
import logo          from "./OPTC_logo.png";
import load_logo     from "./loading.png";
import ImageSelector from "./components/ImageSelector";
import "./style.css";

const OPTCDB_URL = "https://optc-db.github.io/characters/#/view/";
const END_K      = UNITS_DATA.length;
const purl       = process.env.PUBLIC_URL;

const App = () => {
  const [ inputImages, setInputImages ] = useState([]);
  const [ results, setResults ]         = useState([]);
  const [ progress, setProgress ]       = useState(0);
  const [ loading, setLoading ]         = useState(false);

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

  return (<>
    <div style={{backgroundImage: `url(${bg})`}} className="mainContent">
      <div style={{textAlign: "center", padding: "2em", color: "white"}}>
        <img src={logo} alt=""/>
        <h1>OPTC Box Exporter</h1>
      </div>
      <div className="row">
        <div style={{width: "calc(50% - 1em)", marginRight: "1em"}}>
          <ImageSelector
            loading={loading}
            inputImages={inputImages}
            setInputImages={setInputImages}
            runProcess={runProcess}
          />
        </div>
        <div style={{ width: "calc(50% - 1em)", marginLeft: "1em", minHeight: "50vh"}}>
          <div className="card">
            <div className="card-header" style={{fontWeight: 600}}>
              Detected Characters
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
                }}>
                  <img className="rotating" alt="" src={load_logo}/>
                  {progress <= 100 ? progress : 100}%
                </div>) : (<div style={{minHeight: "50vh"}}></div>)
              }
            </div>
          </div>
        </div>
      </div>
    </div>
    <div id="hidden_images" style={{display: 'none'}}>
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
      {/*<canvas id="imageCanvas1"></canvas>
        <canvas id="imageCanvas1b"></canvas><br/>
        <canvas id="imageCanvas2"></canvas>
        <canvas id="imageCanvas2b"></canvas><br/>
        <canvas id="imageCanvas3"></canvas>
        <canvas id="imageCanvas3b"></canvas><br/>
        <canvas id="imageCanvas4"></canvas>
        <canvas id="imageCanvas4b"></canvas><br/>
        <canvas id="imageCanvas5"></canvas>
        <canvas id="imageCanvas5b"></canvas><br/>
        <canvas id="imageCanvas6"></canvas>
        <canvas id="imageCanvas6b"></canvas><br/>
        <canvas id="imageCanvas7"></canvas>
        <canvas id="imageCanvas7b"></canvas><br/>
        <canvas id="imageCanvas8"></canvas>
        <canvas id="imageCanvas8b"></canvas><br/>
        <canvas id="imageCanvas9"></canvas>
        <canvas id="imageCanvas9b"></canvas><br/>
        <canvas id="imageCanvas10"></canvas>
        <canvas id="imageCanvas10b"></canvas><br/>
        <canvas id="imageCanvas11"></canvas>
        <canvas id="imageCanvas11b"></canvas><br/>
        <canvas id="imageCanvas12"></canvas>
        <canvas id="imageCanvas12b"></canvas><br/>
        <canvas id="imageCanvas13"></canvas>
        <canvas id="imageCanvas13b"></canvas><br/>
        <canvas id="imageCanvas14"></canvas>
        <canvas id="imageCanvas14b"></canvas><br/>
        <canvas id="imageCanvas15"></canvas>
        <canvas id="imageCanvas15b"></canvas><br/>
        <canvas id="imageCanvas16"></canvas>
        <canvas id="imageCanvas16b"></canvas><br/>
        <canvas id="imageCanvas17"></canvas>
        <canvas id="imageCanvas17b"></canvas><br/>
        <canvas id="imageCanvas18"></canvas>
        <canvas id="imageCanvas18b"></canvas><br/>
        <canvas id="imageCanvas19"></canvas>
        <canvas id="imageCanvas19b"></canvas><br/>
        <canvas id="imageCanvas20"></canvas>
        <canvas id="imageCanvas20b"></canvas>*/}
    </div>
  </>);
};

export default App;
