//TODO add .delete()s
//TODO vs units

const START_K = 1;
const END_K = UNITS_DATA.length;

const imgElement   = document.getElementById('imageOriginal');
const inputElement = document.getElementById('imageInput');
inputElement.addEventListener('change', e => {
  imgElement.src = URL.createObjectURL(e.target.files[0]);
}, false);

const compares_list = document.getElementById('compares');
for (let k = START_K; k <= END_K; ++k) {
  let img = document.createElement('img');
  compares_list.appendChild(img);
  img.outerHTML = `<img id='compare${k}' src='portraits/${k}.png' style="display: none"/>`;
}

const calcSimilarity = (img, target) => {
  const dst = new cv.Mat();
  const mask = new cv.Mat();
  cv.matchTemplate(target, img, dst, cv.TM_CCOEFF_NORMED, mask);
  const result = dst.data32F[0];
  dst.delete(); mask.delete();
  return result;
};

const findMatchingCorners = (clean_img, squares, p_width, p_height) => {
  let corner_dst = new cv.Mat();
  let mask = new cv.Mat();
  const corners = [
    cv.imread('scorner'), cv.imread('dcorner'), cv.imread('qcorner'),
    cv.imread('pcorner'), cv.imread('icorner'), cv.imread('xcorner'),
  ];
  const result = squares.map((sq, i) => {
    const image = clean_img.roi({
      x: 40 + (i%5)*p_width,
      y: squares[0].y - 70 + parseInt(i/5)*p_height,
      width: p_width,
      height: p_height,
    });
    for (let cn = 0; cn < corners.length; ++cn) {
      cv.matchTemplate(image, corners[cn], corner_dst, cv.TM_CCOEFF_NORMED, mask);
      const result_d = cv.minMaxLoc(corner_dst, mask);
      if (result_d.maxVal > 0.9) return {
        type: ['STR', 'DEX', 'QCK', 'PSY', 'INT', 'DUO'][cn],
        starting_y: squares[0].y - 70 + result_d.maxLoc.y -
          [30, 28, 30, 31, 30, 23][cn],
      }
    }
  });
  corner_dst.delete(); mask.delete();
  return result;
};

document.getElementById('processBtn').onclick = async () => {
  // Initialize variables
  this.disabled = true;
  let clean_img = cv.imread('imageOriginal');
  clean_img = clean_img.roi({
    x: 0,
    y: clean_img.rows/4,
    width: clean_img.cols,
    height: clean_img.rows/2,
  });
  const p_width = 189*clean_img.cols/1080;
  const p_height = 189*clean_img.rows/1200;

  // Draw white squares around chars
  let hlines = new cv.Mat();
  let vlines = new cv.Mat();
  let copy_1 = clean_img.clone();
  let copy_lined = clean_img.clone();
  cv.cvtColor(copy_1, copy_1, cv.COLOR_RGBA2GRAY, 0);
  cv.Canny(copy_1, copy_1, 50, 200, 3);
  cv.HoughLines(copy_1, hlines, 1, Math.PI/180, 500, 0, 0, Math.PI/2, Math.PI/2+0.1);
  cv.HoughLines(copy_1, vlines, 1, Math.PI/180, 500, 0, 0, 0, 0.01);
  for (let i = 0; i < (hlines.rows + vlines.rows); ++i) {
    const rho = i < hlines.rows ?
      hlines.data32F[i * 2] :
      vlines.data32F[(i - hlines.rows) * 2];
    const theta = i < hlines.rows ?
      hlines.data32F[i * 2 + 1] :
      vlines.data32F[(i - hlines.rows) * 2 + 1];
    const a = Math.cos(theta);
    const b = Math.sin(theta);
    const x0 = a * rho;
    const y0 = b * rho;
    const startPoint = { x: x0 - 3000 * b, y: y0 + 3000 * a};
    const endPoint =   { x: x0 + 3000 * b, y: y0 - 3000 * a};
    cv.line(copy_lined, startPoint, endPoint, [255, 255, 255, 255], 6);
  }
  cv.imshow('imageCanvas1', copy_lined);
  hlines.delete(); vlines.delete(); copy_1.delete();

  // Find contour for each square
  cv.cvtColor(copy_lined, copy_lined, cv.COLOR_RGBA2GRAY, 0);
  const ksize = new cv.Size(3, 3);
  const anchor = new cv.Point(-1, -1);
  cv.blur(copy_lined, copy_lined, ksize, anchor, cv.BORDER_DEFAULT);
  cv.threshold(copy_lined, copy_lined, 250, 200, cv.THRESH_BINARY);
  let contours = new cv.MatVector();
  let hierarchy = new cv.Mat();
  cv.findContours(copy_lined, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);
  copy_lined.delete(); hierarchy.delete();

  // Find each square
  let squares = [];
  for (let i = 0; i < contours.size(); ++i) {
    const rect = cv.boundingRect(contours.get(i));
    const area = rect.width*rect.height;
    if (area > 15000 && area < 40000) squares.push(rect);
  }
  squares = squares.reverse().slice(0, 20);
  contours.delete();

  // Find type & position of each character
  const corner_info = findMatchingCorners(clean_img, squares, p_width, p_height);
  const starting_y = corner_info.reduce((acc, ci) => !acc && ci ? ci.starting_y : acc, null);

  // Find precise character_imgs
  const character_imgs = squares.map((r, i) => {
    let full_image = clean_img.roi({
      x: 40 + (i%5)*p_width,
      y: starting_y + parseInt(i/5)*p_height,
      width: p_width,
      height: p_height,
    });
    const dsize = new cv.Size(50, 50);
    cv.resize(full_image, full_image, dsize, 0, 0, cv.INTER_AREA);
    return full_image.roi({
      x: 7,
      y: 7,
      width: 36,
      height: 36,
    });
  });
  let characters = character_imgs.map((img, i) => ({
    type: corner_info[i]?.type,
    img,
    best: null,
    best_score: 0,
  }));
  characters.forEach(({ img }, i) => img && cv.imshow(`imageCanvas${i+1}b`, img));

  // Idenfify each character_img
  let compare_img = document.getElementById("compare");
  let last_img_loaded = START_K;
  console.time("TOTAL");
  compare_img.onload = () => {
    if (last_img_loaded === END_K) {
      const result = characters.map(c => ({ id: c.best, type: c.type }));
      console.log('DONE', result);
      console.timeEnd("TOTAL");
      this.disabled = false;
      return;
    }
    const target_type = Array.isArray(UNITS_DATA[last_img_loaded-1][1]) ?
      'DUO' : UNITS_DATA[last_img_loaded-1][1];
    if (characters.some(c => c.type && c.type === target_type)) {
      let target = cv.imread('compare');
      const dsize = new cv.Size(50, 50);
      cv.resize(target, target, dsize, 0, 0, cv.INTER_AREA);
      target = target.roi({ x: 7, y: 7, width: 36, height: 36 });
      characters.forEach(({ img, type, best_score }, i) => {
        if (type !== target_type) return;
        const result = calcSimilarity(img, target);
        if (result > best_score) {
          characters[i].best = last_img_loaded;
          characters[i].best_score = result;
        }
      });
      target.delete();
    }
    compare_img.src = `portraits/${last_img_loaded+1}.png`;
    last_img_loaded += 1;
  };
  compare_img.onerror = () => {
    compare_img.src = `portraits/${last_img_loaded+1}.png`;
    last_img_loaded += 1;
  };
  compare_img.src = `portraits/${START_K}.png`;

  // Clean
  clean_img.delete();
};

const onOpenCvReady = () => {
  document.body.classList.remove("loading");
};
