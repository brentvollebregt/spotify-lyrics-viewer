import fs from "fs";
import { SitemapStream, streamToPromise } from "sitemap";
import { Readable } from "stream";

const rootDestinations = ["/", "/about"];
const siteUrl = "https://spotify-lyrics-viewer.nitratine.net";

const links = rootDestinations.map(dest => ({ url: `${dest}`, priority: 0.8 }));

const stream = new SitemapStream({ hostname: siteUrl });
streamToPromise(Readable.from(links).pipe(stream)).then(data => {
  fs.writeFileSync("./public/sitemap.xml", data);
  console.log("Sitemap created.");
});
