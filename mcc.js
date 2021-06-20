import { HME } from "https://taisukef.github.io/h264-mp4-encoder.es/h264-mp4-encoder.es.js";
import { downloadFile } from "https://js.sabae.cc/downloadFile.js";

const setOptions = (opt) => {
  console.log("mcc.setOptions", opt);
  //  scale: Math.round(400 / captureCanvas.width),
  //  capturingFps: 60,
};

let fps = 60;
let len = 5 * fps;

const imgs = [];

const capture = async (canvas) => {
  if (len > 0) {
    const ctx = canvas.getContext("2d");
    const imgd = ctx.getImageData(0, 0, canvas.width, canvas.height);
    imgs.push(imgd);
  }
  len--;
  if (len == 0) {
    console.log("encoding...");
    const encoder = await HME.createH264MP4Encoder();
    const img0 = imgs[0];
    encoder.width = img0.width;
    encoder.height = img0.height;
    encoder.frameRate = fps;
    encoder.initialize();
    for (const img of imgs) {
      encoder.addFrameRgba(img.data);
    }
    encoder.finalize();
    const mp4 = encoder.FS.readFile(encoder.outputFilename);
    downloadFile("screenshot.mp4", mp4);
    console.log("capturing finished");
  }
};

const mcc = { setOptions, capture };
export { mcc };
