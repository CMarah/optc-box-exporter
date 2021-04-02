const fs    = require('fs')
const fetch = require('isomorphic-fetch');

const download = async (id, url) => {
  const path = `./portraits/${id}.png`;
  const res = await fetch(url);
  const fileStream = fs.createWriteStream(path);
  //TODO check for 404
  return new Promise((resolve, reject) => {
    res.body.pipe(fileStream);
    res.body.on("error", reject);
    fileStream.on("finish", resolve);
  });
};

const basicUrl = k => `https://onepiece-treasurecruise.com/wp-content/uploads/${k}`;
const getThumbnailUrl = n => {
  switch (n) {
    case 9001: return basicUrl('gskull_luffy.png'); break;
    case 9002: return basicUrl('gskull_zoro.png'); break;
    case 9003: return basicUrl('gskull_nami.png'); break;
    case 9004: return basicUrl('gskull_usopp_f.png'); break;
    case 9005: return basicUrl('gskull_sanji_f.png'); break;
    case 9006: return basicUrl('gskull_chopper_f.png'); break;
    case 9007: return basicUrl('gskull_robin_f.png'); break;
    case 9008: return basicUrl('gskull_franky_f.png'); break;
    case 9009: return basicUrl('gskull_brook_f.png'); break;
    case 9010: return basicUrl('gred_skull_f.png'); break;
    case 9011: return basicUrl('gblue_skull_f.png'); break;
    case 9012: return basicUrl('gyellow_skull2_f.png'); break;
    case 9013: return basicUrl('ggreen_skull2_f.png'); break;
    case 9014: return basicUrl('gblack_skull_f.png'); break;
    case 9015: return basicUrl('gJerma_skull_f1.png'); break;
    case 9016: return basicUrl('gJerma_skull_f2.png'); break;
    case 9017: return basicUrl('gJerma_skull_f3.png'); break;
    case 9018: return basicUrl('gJerma_skull_f4.png'); break;
    case 9019: return basicUrl('gJerma_skull_f5.png'); break;
    case 9020: return basicUrl('gDoflamingo_skull_f.png'); break;
    case 9021: return basicUrl('genel_skull_f.png'); break;
    case 9022: return basicUrl('ghiguma_skull_f.png'); break;
    case 9023: return basicUrl('gsanji_skull_f.png'); break;
    case 9024: return basicUrl('gfrankie_skull_f.png'); break;
    case 9025: return basicUrl('gCavendish_skull_f.png'); break;
    case 9026: return basicUrl('gDoflamingo_skull_f2.png'); break;
    case 9027: return basicUrl('gJerma_skull_f6.png'); break;
    case 9028: return basicUrl('gJerma_skull_f7.png'); break;
    case 9029: return basicUrl('gJerma_skull_f8.png'); break;
    case 9030: return basicUrl('gJerma_skull_f9.png'); break;
    case 9031: return basicUrl('gHancock_skull_f.png'); break;
    case 9032: return basicUrl('gnami_skull_f.png'); break;
  }
  if (n === null || n === undefined) return '';
  const id = ('0000' + n).slice(-4).replace(/(057[54])/, '0$1'); // missing aokiji image
  switch (id) {
    case '0742': return basicUrl('f0742-2.png'); break;
    case '3000': return basicUrl('f3000_1.png'); break;
    case '3111': return 'https://optc-db.github.io/res/sadBandai/character_11762_t1.png'; break;
    case '3333': return 'http://onepiece-treasurecruise.com/en/wp-content/uploads/sites/2/f5013.png'; break;
    case '3334': return 'http://onepiece-treasurecruise.com/en/wp-content/uploads/sites/2/f5014.png'; break;
    case '3339': return 'res/character_10852_t1.png'; break;
    case '3340': return 'res/character_10853_t1.png'; break;
    case '3347': return 'res/character_1508_t1.png'; break;
    case '3348': return 'res/character_1509_t1.png'; break;
    case '3349': return 'res/character_1510_t1.png'; break;
    case '3350': return 'res/character_1511_t1.png'; break;
    case '3351': return 'res/character_10861_t1.png'; break;
    case '3352': return 'res/character_10862_t1.png'; break;
    case '3353': return 'res/character_10994_t1.png'; break;
    case '3354': return 'res/character_10995_t1.png'; break;
    case '3356': return 'res/character_10869_t1.png'; break;
    case '3357': return 'res/character_10870_t1.png'; break;
    case '3358': return 'res/character_10867_t1.png'; break;
    case '3359': return 'res/character_10868_t1.png'; break;
    case '3360': return 'res/character_11037_t1.png'; break;
    case '3361': return 'res/character_11038_t1.png'; break;
    case '2768': return 'res/character_10258_t1.png'; break;
    case '2769': return 'res/character_10259_t1.png'; break;
    case '2770': return 'res/character_10262_t1.png'; break;
    case '2771': return 'res/character_10263_t1.png'; break;
    case '3366': return 'res/character_10858_t1.png'; break;
    case '3367': return 'res/character_10859_t1.png'; break;
    case '3368': return 'res/character_10860_t1.png'; break;
    case '3370': return 'http://onepiece-treasurecruise.com/en/wp-content/uploads/sites/2/f5052.png'; break;
    case '3371': return 'res/character_11243_t.png'; break;
    case '3372': return 'res/character_11244_t.png'; break;
    case '3373': return 'res/character_11245_t.png'; break;
    case '3374': return 'http://onepiece-treasurecruise.com/en/wp-content/uploads/sites/2/f5053.png'; break;
    case '3375': return 'res/character_10863_t.png'; break;
    case '3376': return 'res/character_10864_t.png'; break;
    case '3380': return 'res/character_11333_t1.png'; break;
    case '3381': return 'res/KDugejE.png'; break;
    case '3382': return 'res/character_11615_t1.png'; break;
    case '3383': return 'res/character_11760_t.png'; break;
    case '3384': return 'res/character_11400_t1.png'; break;
    case '3385': return 'res/character_11338_t1.png'; break;
    default: break;
  }
  return 'https://onepiece-treasurecruise.com/wp-content/uploads/f' + id + '.png';
};

const downloadImg = n => {
  const url = getThumbnailUrl(n);
  if (!url.includes("res/")) {
    return download(n, url);
  } else {
    return fs.copyFileSync(url, `portraits/${n}.png`);
  }
};

const downloadAllPortraits = async () => {
  const NUMBER_OF_PORTRAITS = 3400;
  for (let i = 1; i <= NUMBER_OF_PORTRAITS; ++i) {
    if (!fs.existsSync(`./portraits/${i}.png`)) {
      console.log(`Downloading ${i}`);
      await downloadImg(i);
      console.log(`✅ Done ${i}!`);
    } else {
      console.log(`✅ Already had ${i}!`);
    }
  }
};
downloadAllPortraits();
