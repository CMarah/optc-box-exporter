import {
  useState,
  useRef,
  useEffect,
}                          from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar }          from '@fortawesome/free-solid-svg-icons';
import {
  relevant
}                          from "./data.js";
import { evolutions }      from "./evolutions.js";
import bg                  from "./images/bg.png";
import logo                from "./OPTC_logo.png";
import titlebg             from "./titlebg.png";
import ImageImporter       from "./components/ImageImporter";
import BrownButton         from "./components/BrownButton.js";
import "./style.css";

const purl       = process.env.PUBLIC_URL;
const OPTCDB_URL = "https://optc-db.github.io/characters/#/view/";
const types = ["STR", "DEX", "QCK", "PSY", "INT"];
const relevant_by_type = [-1, 0, 1, 2, 3, 4, 5].map(
  tn => relevant.filter(u => tn === types.findIndex(t => t === u[2]))
);

const App = () => {
  const [ box, setBox ]                          = useState(
    !localStorage.getItem("optc-box") ? [] :
      localStorage.getItem("optc-box").split(",").map(id => parseInt(id))
  );
  const [ display_importer, setDisplayImporter ] = useState(false);
  const [ display_help, setDisplayHelp ]         = useState(true);
  const [ hovered_star, setHoveredStar ]         = useState(null);
  const [ minimum_rarity, setMinimumRarity ]     = useState(6);
  const [ name_filter, setNameFilter ]           = useState("");
  const importerRef       = useRef(null);
  const helpRef           = useRef(null);
  const downloadAnchorRef = useRef(null);
  const inputFileRef      = useRef(null);
  const copiedRef         = useRef(null);

  useEffect(() => {
    localStorage.setItem("optc-box", box);
  }, [box]);

  const havePreevolution = id => {
    return box.some(id_b => evolutions[id_b] === id);
  };

  const handleClick = e => {
    if (
      importerRef.current && !importerRef.current.contains(e.target) &&
      e.clientX < document.body.offsetWidth &&
      display_importer === true
    ) {
      setDisplayImporter(false);
    }
    if (
      helpRef.current && !helpRef.current.contains(e.target) &&
      e.clientX < document.body.offsetWidth &&
      display_help === true
    ) {
      setDisplayHelp(false);
    }
  };
  document.addEventListener("mousedown", handleClick);

  const saveFile = () => {
    const href = `data:text/plain;charset=utf-8,${encodeURIComponent(box)}`;
    downloadAnchorRef.current.href = href;
    downloadAnchorRef.current.click();
  };
  const loadFile = e => {
    if (e.target.value) {
      let fr = new FileReader();
      fr.addEventListener('load', () => {
        const new_box = fr.result.split(',')
          .map(x => parseInt(x))
          .filter(x => x);
        setBox(new_box);
        e.target.value = "";
      });
      fr.readAsText(e.target.files[0]);
    }
  };
  const copyBox = () => {
    copiedRef.current.style.transition = '0.1s';
    copiedRef.current.style.opacity = 1;
    navigator.clipboard.writeText(box);
    setTimeout(() => {
      copiedRef.current.style.transition = '0.4s';
      copiedRef.current.style.opacity = 0;
    }, 600);
  };

  return (<>
    <div style={{
      filter: display_importer || display_help ? "blur(3px)" : "",
    }} className="mainContent">
      <div style={{textAlign: "center", padding: "2em", color: "white"}}>
        <img src={logo} alt=""/>
        <h1 style={{
          color: "rgb(254 247 177)",
          textShadow: "3px 3px black",
          fontWeight: 900,
        }}>OPTC Box Manager</h1>
      </div>
      <div style={{
        maxWidth: "40em",
        margin: "2em auto",
        display: "flex",
        justifyContent: "space-between",
      }}>
        <BrownButton
          text="Add units"
          fontSize="1.2em"
          disabled={false}
          onClick={() => {
            setDisplayImporter(true);
          }}
        />
        <BrownButton
          text="Save"
          fontSize="1.2em"
          disabled={false}
          onClick={saveFile}
        />
        <BrownButton
          text="Load"
          fontSize="1.2em"
          disabled={false}
          onClick={() => inputFileRef.current.click()}
        />
        <div style={{position: "relative"}}>
          <BrownButton
            text="Copy"
            fontSize="1.2em"
            disabled={false}
            onClick={() => copyBox()}
          />
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
        </div>
      </div>
      <div className="box" style={{backgroundImage: `url(${bg})`}}>
        <div style={{ color: "white", fontSize: "2em", marginLeft: "3em", marginBottom: "1em" }}>
          <div style={{display: "flex", position: "relative"}}>
            <div>Minimum rarity:</div>
            <div style={{left: "8em", position: "absolute"}}>{
              (new Array(6)).fill(0).map((x, i) => {
                return (<FontAwesomeIcon key={i} icon={faStar} size="sm"
                  style={{
                    color: hovered_star === null ?
                      (minimum_rarity - 1 >= i ? "#ab8000" : "white") :
                      (hovered_star >= i ? "#ab8000" : "white"),
                    cursor: "pointer",
                  }}
                  onMouseEnter={() => setHoveredStar(i)}
                  onMouseLeave={() => setHoveredStar(null)}
                  onClick={() => setMinimumRarity(i+1)}
                />);
              })
            }</div>
            <div style={{position: "absolute", right: 0}}>
              <BrownButton
                text="Help"
                fontSize="0.75em"
                disabled={false}
                onClick={() => {
                  setDisplayHelp(true);
                }}
              />
            </div>
          </div>
          <div style={{display: "flex", position: "relative"}}>
            <div>Name filter:</div>
            <div style={{left: "8em", position: "absolute"}}>
              <input type="text" style={{
                border: 0, color: "white", background: "transparent",
                borderBottom: "3px solid white",
              }}
                onChange={e => setNameFilter(e.target.value)}
              />
            </div>
          </div>
        </div>
        {relevant_by_type.map((g, i) => (
          <div className="grid" key={`g${i}`}>
          {g
            .filter(x => minimum_rarity <= parseInt(x[4]))
            .filter(x => (new RegExp(name_filter, "i")).test(x[1]))
            .map((x, k) => {
              return (
                <div key={`u-${i}-${k}`}
                  style={{
                    cursor: "pointer",
                    filter: box.includes(x[0]) ? "" : "brightness(0.5)",
                    position: "relative",
                  }}
                  onClick={e => {
                    if (e.ctrlKey) {
                      setBox(box.includes(x[0]) ?
                        box.filter(id => id !== x[0]) :
                        box.concat(x[0])
                      );
                    } else {
                      window.open(OPTCDB_URL + x[0], "_blank");
                    }
                  }}
                >
                <div className="frame"
                style={{border: !box.includes(x[0]) && havePreevolution(x[0]) && "5px solid cyan"}}
                ></div>
                <img key={k} src={purl + `/portraits/${x[0]}.png`} alt=""
                  style={{height: "112px", width: "112px"}}
                />
                </div>
              );
            })
          }
          </div>
        ))}
      </div>
    </div>
    <div ref={importerRef} style={{
      position: "absolute", top: "25em", margin: "0 15%", width: "70%",
      display: display_importer ? "" : "none",
    }}>
      <ImageImporter box={box} setBox={setBox} setDisplayImporter={setDisplayImporter}/>
    </div>
    <div ref={helpRef} style={{
      position: "absolute", top: "15em", margin: "0 15%", width: "70%",
      display: display_help ? "" : "none",
      minWidth: "15em",
      minHeight: "10em",
      background: "rgb(36, 28, 21)",
      color: "white",
      border: "3px solid #ab8002",
      borderRadius: "0.5em",
      padding: "2em",
      paddingTop: "0.5em",
      fontSize: "1.3em",
    }}>
      <div style={{backgroundImage: `url(${titlebg})`}} className="panelTitle">
        HELP
      </div>
      <ul>
        <li>Click on a character to open their optc-db info</li>
        <li>Ctrl+Click on a character to add/remove them from your box</li>
        <li>Characters with a <span style={{color: "cyan"}}>blue</span> frame indicate
          you have their preevolution in your box
        </li>
        <li>The Copy button copies all character's IDs to your clipboard, so you can paste them
          in your <a href="https://www.nakama.network/boxes">Nakama Network box</a>
        </li>
        <li>Use Add Units to import your OPTC box from screenshots</li>
      </ul>
    </div>
    <div style={{display: "none"}}>
      <a ref={downloadAnchorRef} download="box.txt" href="/">Save</a>
      <input ref={inputFileRef} type="file" id="fileInput" name="file" onChange={loadFile}/>
    </div>
  </>);
};

export default App;
