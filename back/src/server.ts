import { WebServer } from "./WebServer";

(async () => {
  const s = new WebServer({
    port: 3000,
    privateKeyFilename: "./out/server.key",
    certificateFilename: "./out/server.crt",
  });
  await s.start();
  await s.startHttps();
})();
