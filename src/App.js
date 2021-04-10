import {
  useState,
  useRef,
  useEffect,
}                          from "react";
import {
  relevant
}                          from "./data.js";
import { evolutions }      from "./evolutions.js";
import bg                  from "./images/bg.png";
import logo                from "./OPTC_logo.png";
import ImageImporter       from "./components/ImageImporter";
import BrownButton         from "./components/BrownButton.js";
import "./style.css";

const purl       = process.env.PUBLIC_URL;
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
  const importerRef       = useRef(null);
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
      filter: !display_importer ? "" : "blur(3px)",
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
        {relevant_by_type.map((g, i) => (
          <div className="grid" key={`g${i}`}>
          {g
            .filter(x => [6,"6+"].includes(x[4]))
            .map((x, k) => {
              return (
                <div key={`u-${i}-${k}`}
                  style={{
                    cursor: "pointer",
                    filter: box.includes(x[0]) ? "" : "brightness(0.5)",
                    position: "relative",
                  }}
                  onClick={()=> setBox(box.includes(x[0]) ?
                    box.filter(id => id !== x[0]) :
                    box.concat(x[0])
                  )}
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
    </div>}
    <div style={{display: "none"}}>
      <a ref={downloadAnchorRef} download="box.txt" href="/">Save</a>
      <input ref={inputFileRef} type="file" id="fileInput" name="file" onChange={loadFile}/>
    </div>
  </>);
};

export default App;
