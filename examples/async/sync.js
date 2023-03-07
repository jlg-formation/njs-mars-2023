const fs = require("node:fs");

const files = fs.readdirSync(".");
console.log("files: ", files);

const content = fs.readFileSync(files[0], { encoding: "utf-8" });
console.log("content: ", content);
