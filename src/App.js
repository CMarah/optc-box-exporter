import './App.css';

import UNITS_DATA from './data.js';
import processImages from './plain.js';

const purl = process.env.PUBLIC_URL;
const END_K = UNITS_DATA.length;

const loadInput = e => {
  const imgElement = document.getElementById('imageOriginal');
  imgElement.src = URL.createObjectURL(e.target.files[0]);
};

const App = () => {
  return (<>
    <div className="container">
      <div className="jumbotron">
        <h1>OPTC Box Importer</h1>
        <p>This website uses OpenCV.js to detect your OPTC box contents.</p>
        <img id="scorner" src={purl + "/images/scorner.png"} style={{display: 'none'}} alt=""/>
        <img id="dcorner" src={purl + "/images/dcorner.png"} style={{display: 'none'}} alt=""/>
        <img id="qcorner" src={purl + "/images/qcorner.png"} style={{display: 'none'}} alt=""/>
        <img id="pcorner" src={purl + "/images/pcorner.png"} style={{display: 'none'}} alt=""/>
        <img id="icorner" src={purl + "/images/icorner.png"} style={{display: 'none'}} alt=""/>
        <img id="xcorner" src={purl + "/images/xcorner.png"} style={{display: 'none'}} alt=""/>
        <ul id="compares">
          <img id="compare" alt=""/>
          {(new Array(END_K)).fill(0).map((x,k) => (
            <img id={`compare${k+1}`} key={k} style={{display: "none"}} alt=""
              src={purl + `/portraits/${k+1}.png`}
            />
          ))}
        </ul>
      </div>
      <div className="row">
        <div className="col-sm">
          <div className="card">
            <div className="card-header">
              Original Image
            </div>
            <div className="card-block text-center">
              <img id="imageOriginal" alt="Upload"/>
            </div>
            <div className="card-footer text-muted">
              <input type="file" id="imageInput" name="file" onChange={loadInput}/>
            </div>
          </div>
        </div>
        <div className="col-sm">
          <div className="card">
            <div className="card-header">
              Modified Image
            </div>
            <div className="card-block">
              <canvas id="imageCanvas1"></canvas>
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
              <canvas id="imageCanvas20b"></canvas>
            </div>
            <button type="button" id="processBtn" className="btn btn-primary"
              onClick={processImages}
            >Detect</button>
          </div>
        </div>
      </div>
    </div>
    <div className="modal"></div>
    <script src="data.js" type="text/javascript"></script>
    {/*<script src="index.js" type="text/javascript"></script>
    <script async src="opencv.js" onLoad={onOpenCvReady} type="text/javascript"></script>
    <script src="plain.js" type="text/javascript"></script>
    {/*<div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>*/}
  </>);
}

export default App;
