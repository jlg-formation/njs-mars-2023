(() => {
  const express = require("express");
  const serveIndex = require("serve-index");

  const api = require("./api");

  console.log("About to start the server...");

  const app = express();

  const port: number = 3000;
  const publicDir = ".";

  app.use((req, res, next) => {
    console.log("req: ", req.url);
    next();
  });

  app.use("/api", api);

  app.use(express.static(publicDir));
  app.use(serveIndex(publicDir, { icons: true }));

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
})();
