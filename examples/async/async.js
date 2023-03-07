const fs = require("node:fs");

fs.readdir(".", (err, files) => {
  console.log("files: ", files);

  fs.readFile(files[0], { encoding: "utf-8" }, (err, content) => {
    console.log("content: ", content);
  });
});
