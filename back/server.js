console.log("About to start the server...");

const http = require("node:http");

// Create an HTTP server
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain", blabla: 123 });
  res.end("okay");
});

// Now that server is running
server.listen(1337, "127.0.0.1", () => {
  console.log("Server started on port 1337");
});
