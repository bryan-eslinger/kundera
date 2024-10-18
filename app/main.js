import net from "net";

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

class Response {
  constructor(correlationId) {
    this.correlationId = correlationId;
    this.messageLength = Buffer.alloc(4);
  }

  toBuffer() {
    const message = Buffer.alloc(4);
    message.writeInt32BE(this.correlationId);
    this.messageLength.writeInt32BE(message.length);
    return Buffer.concat([this.messageLength, message]);
  }
}

// Uncomment this block to pass the first stage
const server = net.createServer((socket) => {
  socket.on("connection", (socket) => {
    console.debug("new connection")
  })

  socket.on("data", () => {
    console.debug("data received");
    const response = new Response(7);
    socket.write(response.toBuffer());
    socket.end();
  })
});

server.listen(9092, "127.0.0.1");
