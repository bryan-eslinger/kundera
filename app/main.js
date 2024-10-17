import net from "net";

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this block to pass the first stage
const server = net.createServer((connection) => {
  server.on("connection", (socket) => {
    socket.on("data", () => {
      const correlationId = 42
      const buffer = Buffer.from[4, correlationId];
      socket.end(buffer);
    })
  })
});

server.listen(9092, "127.0.0.1");
