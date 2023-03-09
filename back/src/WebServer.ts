import express from "express";
import { Server } from "http";
import serveIndex from "serve-index";
import { api } from "./api";

export interface WebServerOptions {
  port?: number;
}

export class WebServer {
  options: WebServerOptions = {
    port: 6666,
  };
  app = express();
  server: Server | undefined;

  constructor(opts?: WebServerOptions) {
    this.options = { ...this.options, ...opts };

    console.log("About to start the server...");

    const publicDir = ".";

    const app = this.app;

    app.use((req, res, next) => {
      console.log("req: ", req.url);
      next();
    });

    app.use("/api", api);

    app.use(express.static(publicDir));
    app.use(serveIndex(publicDir, { icons: true }));
  }

  start() {
    return new Promise<void>((resolve, reject) => {
      const callback = (err: unknown) => {
        reject(err instanceof Error ? err : new Error(err as string));
      };
      const server = this.app.listen(this.options.port, () => {
        console.log(`Example app listening on port ${this.options.port}`);
        server.off("error", callback);
        resolve();
      });

      server.once("error", callback);
      this.server = server;
    });
  }

  stop() {
    return new Promise<void>((resolve, reject) => {
      if (this.server === undefined) {
        resolve();
        return;
      }
      this.server.close((err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  }
}
