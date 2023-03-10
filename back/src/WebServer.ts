import express from "express";
import { createServer, Server } from "http";
import https from "https";
import serveIndex from "serve-index";
import { api } from "./api";
import { sso } from "node-expose-sspi";
import fs from "node:fs";

export interface WebServerOptions {
  port: number;
  httpsPort: number;
  privateKeyFilename: string;
  certificateFilename: string;
}

export class WebServer {
  options: WebServerOptions = {
    port: 6666,
    httpsPort: 443,
    privateKeyFilename: "string",
    certificateFilename: "string",
  };
  app = express();
  server: Server;
  httpsServer: https.Server;

  constructor(opts?: Partial<WebServerOptions>) {
    this.options = { ...this.options, ...opts };

    console.log("About to start the server...");

    const publicDir = ".";

    const app = this.app;

    this.server = createServer(app);

    const privateKey = fs.readFileSync(this.options.privateKeyFilename, "utf8");
    const certificate = fs.readFileSync(
      this.options.certificateFilename,
      "utf8"
    );
    const credentials = { key: privateKey, cert: certificate };
    this.httpsServer = https.createServer(credentials, app);

    app.use((req, res, next) => {
      console.log("req: ", req.url);
      next();
    });

    app.use(sso.auth());

    app.use((req, res, next) => {
      console.log("req: ", req.sso);
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
      this.server.listen(this.options.port, () => {
        console.log(`Example app listening on port ${this.options.port}`);
        this.server.off("error", callback);
        resolve();
      });

      this.server.once("error", callback);
    });
  }

  startHttps() {
    return new Promise<void>((resolve, reject) => {
      const callback = (err: unknown) => {
        reject(err instanceof Error ? err : new Error(err as string));
      };
      this.httpsServer.listen(this.options.httpsPort, () => {
        console.log(`Example app listening on port ${this.options.httpsPort}`);
        this.httpsServer.off("error", callback);
        resolve();
      });

      this.httpsServer.once("error", callback);
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

  stopHttps() {
    return new Promise<void>((resolve, reject) => {
      if (this.httpsServer === undefined) {
        resolve();
        return;
      }
      this.httpsServer.close((err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  }
}
