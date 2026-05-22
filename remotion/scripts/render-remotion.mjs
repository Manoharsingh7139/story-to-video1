import { bundle } from "@remotion/bundler";
import { renderMedia, renderStill, selectComposition, openBrowser } from "@remotion/renderer";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const mode = process.argv[2] ?? "render"; // render | still
const compId = process.argv[3] ?? "main-16x9";
const out = process.argv[4] ?? "/mnt/documents/frameflow-launch-16x9.mp4";
const frame = parseInt(process.argv[5] ?? "60", 10);

console.log(`[${mode}] composition=${compId} out=${out}`);

const bundled = await bundle({
  entryPoint: path.resolve(__dirname, "../src/index.ts"),
  webpackOverride: (c) => c,
});
console.log("bundled");

const browser = await openBrowser("chrome", {
  browserExecutable: process.env.PUPPETEER_EXECUTABLE_PATH ?? "/bin/chromium",
  chromiumOptions: { args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"] },
  chromeMode: "chrome-for-testing",
});

const composition = await selectComposition({ serveUrl: bundled, id: compId, puppeteerInstance: browser });
console.log(`composition ${composition.id} ${composition.width}x${composition.height} ${composition.durationInFrames}f`);

if (mode === "still") {
  await renderStill({ composition, serveUrl: bundled, output: out, frame, puppeteerInstance: browser });
} else {
  await renderMedia({
    composition,
    serveUrl: bundled,
    codec: "h264",
    outputLocation: out,
    puppeteerInstance: browser,
    muted: true,
    concurrency: 2,
    onProgress: ({ progress }) => {
      if (Math.round(progress * 100) % 10 === 0) console.log(`progress ${Math.round(progress * 100)}%`);
    },
  });
}

await browser.close({ silent: false });
console.log("done");
