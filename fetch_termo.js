const https = require("https");
const fs = require("fs");

https.get("https://term.ooo/multi.811eb29.js", (res) => {
  let data = "";
  res.on("data", (chunk) => (data += chunk));
  res.on("end", () => {
    fs.writeFileSync("termo_multi.js", data);
    console.log("Saved termo_multi.js. Length: " + data.length);
  });
});
