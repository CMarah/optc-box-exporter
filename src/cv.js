/*global cv*/
import MyWorker from 'worker-loader!./process_worker.js'; // eslint-disable-line import/no-webpack-loader-syntax
let instance = new MyWorker();

const matToBuffer = mat => !mat ? null : ({
  rows: mat.rows,
  cols: mat.cols,
  data: mat.data,
});

const processImages = async (setProgress, callback) => {
  const image_ids = Array.from(document.getElementsByClassName("fullImage")).map(n => n.id);
  let cimgs = image_ids.map(id => {
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
  const clean_imgs = cimgs.map(matToBuffer);
  instance.postMessage({ type: "start", clean_imgs });
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
