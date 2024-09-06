import { prerender } from "react-dom/static.edge";
import * as fs from "fs";
import * as path from "path";
import App from "../app";

globalThis.IS_PRERENDER = true;

// @ts-expect-error we're purposely not passing any fetchers
const prerendered = await prerender(<App />);

// prerendered.prelude is a ReadableStream, so we need to convert it to a string
const preludeHTML = await new Response(prerendered.prelude).text();

fs.writeFileSync(
  path.join(import.meta.dirname, "../server/postponed.json"),
  JSON.stringify(prerendered.postponed, null, 2)
);

fs.writeFileSync(
  path.join(import.meta.dirname, "../server/prelude.html"),
  preludeHTML
);
