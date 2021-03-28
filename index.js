const TRUE_RESULTS = [
  null, 2534, 1984, 2417, 2834,
  2859, null, 2651, 2974, 1793,
  3156, 2112, 2112, 2087, 2087,
  null, 1891, 2965, 2965,  508,
];
//TODO imagecanvas resolutions


let imgElement   = document.getElementById('imageOriginal');
let inputElement = document.getElementById('imageInput');
inputElement.addEventListener('change', e => {
  imgElement.src = URL.createObjectURL(e.target.files[0]);
}, false);

imgElement.onload = () => {
  const src = cv.imread('imageOriginal');
  let dst = new cv.Mat();
  const rect = new cv.Rect(0, src.rows/4, src.cols, src.rows/2);
  dst = src.roi(rect);
  cv.imshow('imageCanvas1', dst);
  src.delete(); dst.delete();
};

const START_K = 3100;
const END_K = 3200;

const calcSimilarity = (img, target) => {
  const dst = new cv.Mat();
  const mask = new cv.Mat();
  cv.matchTemplate(target, img, dst, cv.TM_CCOEFF_NORMED, mask);
  return cv.minMaxLoc(dst, mask).maxVal;
};

document.getElementById('processBtn').onclick = async () => {
  // Initialize variables
  this.disabled = true;
  let src = cv.imread('imageCanvas1');
  let clean = src.clone();
  let itr = src.clone();
  let dst = src.clone();
  let hlines = new cv.Mat();
  let vlines = new cv.Mat();

  // Draw white squares around chars
  cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);
  cv.Canny(src, src, 50, 200, 3);
  cv.HoughLines(src, hlines, 1, Math.PI/180, 500, 0, 0, 0, 0.01);
  cv.HoughLines(src, vlines, 1, Math.PI/180, 500, 0, 0, Math.PI/2, Math.PI/2+0.1);
  for (let i = 0; i < (hlines.rows + vlines.rows); ++i) {
    let rho = i < hlines.rows ?
      hlines.data32F[i * 2] :
      vlines.data32F[(i - hlines.rows) * 2];
    let theta = i < hlines.rows ?
      hlines.data32F[i * 2 + 1] :
      vlines.data32F[(i - hlines.rows) * 2 + 1];
    const a = Math.cos(theta);
    const b = Math.sin(theta);
    const x0 = a * rho;
    const y0 = b * rho;
    const startPoint = { x: x0 - 3000 * b, y: y0 + 3000 * a};
    const endPoint =   { x: x0 + 3000 * b, y: y0 - 3000 * a};
    cv.line(itr, startPoint, endPoint, [255, 255, 255, 255], 6);
  }
  //cv.imshow('imageCanvas1', itr);

  // Find contour for each square
  cv.cvtColor(itr, itr, cv.COLOR_RGBA2GRAY, 0);
  const ksize = new cv.Size(3, 3);
  const anchor = new cv.Point(-1, -1);
  cv.blur(itr, itr, ksize, anchor, cv.BORDER_DEFAULT);
  cv.threshold(itr, itr, 250, 200, cv.THRESH_BINARY);
  let contours = new cv.MatVector();
  let hierarchy = new cv.Mat();
  cv.findContours(itr, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);
  /*console.log('?', contours.size());
  for (let i = 0; i < contours.size(); ++i) {
    const rect = cv.boundingRect(contours.get(i));
    const area = rect.width*rect.height;
    console.log("AREA", area);
    if (area > 15000 && area < 40000) {
      let color = new cv.Scalar(255, 0, 0);
      cv.drawContours(dst, contours, i, color, 1, cv.LINE_8, hierarchy, 100);
    }
  }
  cv.imshow('imageCanvas1', dst);*/

  let rects = [];
  for (let i = 0; i < contours.size(); ++i) {
    const rect = cv.boundingRect(contours.get(i));
    const area = rect.width*rect.height;
    if (area > 15000 && area < 40000) {
      /*const color = new cv.Scalar(Math.round(Math.random() * 255), 0, 0);
      cv.drawContours(dst, contours, i, color, 3, cv.LINE_8, hierarchy, 100);*/
      rects.push(rect);
    }
  }
  rects = rects.reverse();
  //cv.imshow('imageCanvas1b', dst);
  //const avg_width  = rects.reduce((acc, r) => acc + r.width/rects.length, 0);
  //const avg_height = rects.reduce((acc, r) => acc + r.height/rects.length, 0);
  /*const avg_width  = (
    (rects[1].x - rects[0].x) +
    (rects[2].x - rects[1].x) +
    (rects[3].x - rects[2].x) +
    (rects[4].x - rects[3].x)
  )/4;
  const avg_height = (
    (rects[5].y - rects[0].y) +
    (rects[10].y - rects[5].y) +
    (rects[15].y - rects[10].y) +
    (rects[20].y - rects[15].y)
  )/4;*/
  const avg_width = 190*clean.cols/1080;
  const avg_height = 190*clean.rows/1200;
  console.log(avg_width, avg_height);
  console.log(clean.cols, clean.rows);
  const character_imgs = rects.map((r, i) => {
    const rec2 = {
      x: 40 + (i%5)*avg_width + 30,
      y: rects[0].y + parseInt(i/5)*avg_height - 8 + 30,
      width: avg_width - 60,
      height: avg_height - 60,
    };
    return clean.roi(rec2);
  }).slice(0, 20);
  console.log(character_imgs);
  character_imgs.forEach((img, i) => cv.imshow(`imageCanvas${i+1}b`, img));
  //lcv.imshow('imageCanvas1b', character_imgs[5]);

  // Idenfify each character_img
  let accumulators = character_imgs.map(x => ({
    best: null,
    best_score: 0,
  }));

  let compare_img = document.getElementById("compare");
  let last_img_loaded = START_K;
  compare_img.onload = () => {
    console.log("Starting", last_img_loaded);
    if (last_img_loaded === END_K) {
      console.log('DONE', accumulators);
      return;
    }
    let target = cv.imread('compare');
    //const dsize = new cv.Size(character_imgs[0].cols*4/3, character_imgs[0].rows*4/3);
    //const dsize = new cv.Size(character_imgs[0].cols+60, character_imgs[0].rows+60);
    const dsize = new cv.Size(character_imgs[0].cols + 60, character_imgs[0].rows + 60);
    cv.resize(target, target, dsize, 0, 0, cv.INTER_AREA);
    target = target.roi({
      x: 30,
      y: 30,
      width: character_imgs[0].cols,
      height: character_imgs[0].rows,
    });
    const idx = TRUE_RESULTS.findIndex(x => x === last_img_loaded);
    //if (last_img_loaded === 2859) {
    //  cv.imshow('imageCanvas', target);
    //}
    if (idx && idx >= 0) {
      console.log(idx);
      cv.imshow(`imageCanvas${idx+1}`, target);
    }
    character_imgs.forEach((img, i) => {
      const result = calcSimilarity(img, target);
      if (result > accumulators[i].best_score) {
        accumulators[i] = {
          best: last_img_loaded,
          best_score: result,
        };
      }
    });
    compare_img.src = `portraits/${last_img_loaded+1}.png`;
    last_img_loaded += 1;
  };
  compare_img.onerror = () => {
    console.log("Starting", last_img_loaded);
    if (last_img_loaded === END_K) {
      console.log('DONE', accumulators);
      return;
    }
    compare_img.src = `portraits/${last_img_loaded+1}.png`;
    last_img_loaded += 1;
  };
  compare_img.src = `portraits/${START_K}.png`;
  //cv.imshow('imageCanvas2', dst);

  // Clean
  src.delete(); itr.delete(); dst.delete(); contours.delete();
  hierarchy.delete(); hlines.delete(); vlines.delete();
  this.disabled = false;
};

const onOpenCvReady = () => {
  document.body.classList.remove("loading");
};
