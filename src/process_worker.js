import { UNITS_DATA } from './data.js';
/*global importScripts*/
importScripts("/optc-box-exporter/opencv.js");
/*global cv*/
const purl = process.env.PUBLIC_URL;

const END_K = UNITS_DATA.length;
const progress_step = parseInt(END_K/100);
const p_width = 189;
const p_height = 189;

const calcSimilarity = (img, target) => {
  const dst = new cv.Mat();
  const mask = new cv.Mat();
  cv.matchTemplate(target, img, dst, cv.TM_CCOEFF_NORMED, mask);
  const result = dst.data32F[0];
  dst.delete(); mask.delete();
  return result;
};

const findMatchingCorners = (clean_img, squares, p_width, p_height, corners) => {
  let corner_dst = new cv.Mat();
  let mask = new cv.Mat();
  const result = squares.map((sq, i) => {
    const image = clean_img.roi({
      x: 40 + (i%5)*p_width,
      y: Math.max(squares[5].y - 70 - p_height + parseInt(i/5)*p_height, 0),
      width: p_width,
      height: p_height,
    });
    for (let cn = 0; cn < corners.length; ++cn) {
      cv.matchTemplate(image, corners[cn], corner_dst, cv.TM_CCOEFF_NORMED, mask);
      const result_d = cv.minMaxLoc(corner_dst, mask);
      if (result_d.maxVal > 0.9) return {
        type: ['STR', 'DEX', 'QCK', 'PSY', 'INT', 'DUO'][cn],
        starting_y: (squares[5].y - p_height)
          -70 + result_d.maxLoc.y - [30, 28, 30, 31, 30, 23][cn],
      }
    }
    return null;
  });
  corner_dst.delete(); mask.delete();
  return result;
};

const urlToMat = (width, height, url) => {
  return fetch(url, { mode: "cors" })
    .then(res => res.blob())
    .then(blob => createImageBitmap(blob, {
      premultiplyAlpha: 'none',
      colorSpaceConversion: 'none',
    }))
    .then(bitmap => {
      const test = new OffscreenCanvas(width, height);
      const ctx = test.getContext('2d');
      ctx.drawImage(bitmap, 0, 0, width, height);
      const image_data = ctx.getImageData(0, 0, width, height);
      return cv.matFromImageData(image_data);
    })
    .catch(err => null);
};

const corners_promise = [
  [15, 24, purl + "/images/scorner.png"],
  [20, 25, purl + "/images/dcorner.png"],
  [24, 20, purl + "/images/qcorner.png"],
  [27, 23, purl + "/images/pcorner.png"],
  [23, 24, purl + "/images/icorner.png"],
  [24, 29, purl + "/images/xcorner.png"],
].map(x => urlToMat(...x));

const chunkedPromise = async (chunks, block_size) => {
  const block_results = await Promise.all(chunks.slice(0, block_size).map(x => x()));
  if (chunks.length < block_size) return block_results;
  const remaining = await chunkedPromise(chunks.slice(block_size), block_size);
  return [
    ...block_results,
    ...remaining,
  ];
};
const targets_promise = chunkedPromise(
  (new Array(END_K)).fill(0)
    .map((_, i) => ([36, 32, purl + `/sp/${i+1}.png`]))
    .map(x => (() => urlToMat(...x))),
  200,
);

const bufferToMat = b => !b ? null : cv.matFromArray(b.rows, b.cols, 24, b.data);

onmessage = async ({ data }) => {
  if (data.type === "start") {
    const corners = await Promise.all(corners_promise);
    const clean_imgs = data.clean_imgs.map(bufferToMat);

    // Initial images
    let characters = clean_imgs.map((ci, i) => {
      postMessage({ type: "starting image", progress: i });
      // Draw white squares around chars
      let hlines = new cv.Mat();
      let vlines = new cv.Mat();
      let copy_1 = ci.clone();
      let copy_lined = ci.clone();
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
      //cv.imshow('imageCanvas1', copy_lined);
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
        if (area > 17000 && area < 40000 && rect.height > 130) squares.push(rect);
      }
      squares = squares.reverse().slice(0, 25);
      contours.delete();

      // Find type & position of each character
      const corner_info = findMatchingCorners(ci, squares, p_width, p_height, corners);
      const starting_y = corner_info.reduce((acc, ci) => !acc && ci ? ci.starting_y : acc, null);

      // Find precise character_imgs
      const character_imgs = squares.map((r, i) => {
        let full_image = ci.roi({
          x: 40 + (i%5)*p_width,
          y: starting_y + parseInt(i/5)*p_height,
          width: p_width,
          height: p_height,
        });
        const dsize = new cv.Size(50, 50);
        cv.resize(full_image, full_image, dsize, 0, 0, cv.INTER_AREA);
        const res = full_image.roi({ x: 7, y: 10, width: 36, height: 32 });
        full_image.delete();
        return res;
      });
      const res = character_imgs.map((img, i) => ({
        type: corner_info[i]?.type,
        img,
        best: null,
        best_score: 0,
      }));
      ci.delete();
      return res;
    });

    // Idenfify each character_img
    console.time("Process time");
    const targets = await targets_promise;
    console.log("T", targets);
    targets.forEach((target, k) => {
      if (!target) return;
      const target_type = Array.isArray(UNITS_DATA[k][1]) ?
        'DUO' : UNITS_DATA[k][1];
      characters.forEach((g, i) => {
        g.forEach(({ img, type, best_score }, j) => {
          if ((type && type !== target_type) || (best_score > 0.7)) return;
          const result = calcSimilarity(img, target);
          if (result > best_score) {
            characters[i][j].best = k + 1;
            characters[i][j].best_score = result;
          }
        });
      });
      if (k%progress_step === 0) {
        postMessage({ type: "progress", progress: k/progress_step });
      }
    });
    console.timeEnd("Process time");
    console.log(characters);
    const result = characters.map(g => g.map(c => ({
      id: c.best_score > 0.5 ? c.best : null,
      type: c.type,
      score: c.best_score,
    })))
      .reduce((acc, g) => acc.concat(g), []);
    postMessage({ type: "result", result });
  }
};
