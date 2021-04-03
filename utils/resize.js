const sharp = require('sharp');

for (let k = 1; k <= 4000; ++k) {
  sharp(`../public/portraits/${k}.png`)
    .resize({ width: 50 })
    .extract({ top: 10, left: 7, width: 36, height: 32 })
    .toFile(`portraits/${k}.png`)
    .catch(() => {});
}
