/*global cv*/
import UNITS_DATA from './data.js';
import MyWorker from 'worker-loader!./process_worker.js'; // eslint-disable-line import/no-webpack-loader-syntax
let instance = new MyWorker();

const END_K = UNITS_DATA.length;
let targets = new Array(END_K);

const matToBuffer = mat => !mat ? null : ({
  rows: mat.rows,
  cols: mat.cols,
  data: mat.data,
});

const processImages = async (setProgress, callback) => {
  console.time("Startup");
  const corners = [
    cv.imread('scorner'), cv.imread('dcorner'), cv.imread('qcorner'),
    cv.imread('pcorner'), cv.imread('icorner'), cv.imread('xcorner'),
  ];
  console.time("b");
  const image_ids = Array.from(document.getElementsByClassName("fullImage")).map(n => n.id);
  let clean_imgs = image_ids.map(id => {
    let ci = cv.imread(id);
    const full_size = new cv.Size(1080, 1080*ci.rows/ci.cols);
    cv.resize(ci, ci, full_size, 0, 0, cv.INTER_AREA);
    const res = ci.roi({
      x: 0,
      y: (ci.rows - 1200)/2,
      width: ci.cols,
      height: 1200,
    });
    ci.delete();
    return res;
  });
  console.timeEnd("b");
  const basics = {
    corners: corners.map(matToBuffer),
    clean_imgs: clean_imgs.map(matToBuffer),
  };
  instance.postMessage({ type: "basics", cs: basics });
  console.time("c");
  for (let k = 1; k <= END_K; ++k) {
    if (k%100 === 0) console.log(k);
    if (!targets[k-1]) {
      try {
        targets[k-1] = matToBuffer(cv.imread(`compare${k}`));
      } catch(err) {
        targets[k-1] = null;
      }
    }
  }
  console.timeEnd("c");
  console.timeEnd("Startup");
  instance.postMessage({ type: "new_targets", new_targets: targets });
  instance.postMessage({ type: "start" });

  instance.onmessage = ({ data }) => {
    if (data.type === "result") {
      return callback(data.result);
    } else if (data.type === "progress") {
      setProgress(`Identifying characters: ${Math.min(data.progress, 100)}%`);
    } else if (data.type === "starting image") {
      setProgress(`Reading images: ${data.progress+1}/${clean_imgs.length}`);
    }
  };
};
export {
  processImages,
};
