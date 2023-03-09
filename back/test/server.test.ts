import axios from "axios";
import { WebServer } from "../src/WebServer";

describe("Server", () => {
  const url = "http://localhost:3333/api/date";
  test("start stop", async () => {
    const server = new WebServer({ port: 3333 });
    await server.start();
    const resp = await axios.get<object>(url);
    console.log("resp: ", resp.data);
    await server.stop();
  });
});
