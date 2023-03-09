import { WebServer } from "./WebServer";

(async () => {
  await new WebServer({ port: 3000 }).start();
})();
