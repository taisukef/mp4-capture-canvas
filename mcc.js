import { HME } from "https://taisukef.github.io/h264-mp4-encoder.es/h264-mp4-encoder.es.js";
import { downloadFile } from "https://js.sabae.cc/downloadFile.js";

// based on https://github.com/abagames/gif-capture-canvas

const options = {
  scale: 1, // gif 0.5
  durationSec: 5, // gif 3
  code: "KeyC", // 'C'
  capturingFps: 60, // gif 20
  appFps: 60,
  //isAppendingImgElement: true,
  quality: 10,
  downloadFileName: null
};

const setOptions = (opt) => {
  console.log("mcc.setOptions", opt);
  //  scale: Math.round(400 / captureCanvas.width),
  //  capturingFps: 60,
  Object.assign(opt, options);
};

let len;
let capturing = false;
let gotframe = false;
let bktitle;

document.addEventListener("keydown", (e) => {
  if (capturing || !gotframe) {
    return;
  }
  if (e.code == options.code) {
    len = options.durationSec * options.capturingFps;
    capturing = true;
    console.log("start capturing!");
    bktitle = document.title;
    imgs.length = 0;
  }
});

const imgs = [];

const capture = async (canvas) => {
  gotframe = true;
  if (!capturing) {
    return;
  }
  if (len > 0) {
    const ctx = canvas.getContext("2d");
    const imgd = ctx.getImageData(0, 0, canvas.width, canvas.height);
    imgs.push(imgd);
    document.title = Math.floor(len / 60) + "sec";
  }
  len--;
  if (len == 0) {
    console.log("encoding...");
    const encoder = await HME.createH264MP4Encoder();
    const img0 = imgs[0];
    encoder.width = img0.width;
    encoder.height = img0.height;
    encoder.frameRate = options.capturingFps;
    encoder.initialize();
    for (const img of imgs) {
      encoder.addFrameRgba(img.data);
    }
    encoder.finalize();
    const mp4 = encoder.FS.readFile(encoder.outputFilename);
    downloadFile(options.downloadFileName || "screenshot.mp4", mp4);
    console.log("capturing finished");
    capturing = false;
    document.title = bktitle;
  }
};

const mcc = { setOptions, capture };
export { mcc };
