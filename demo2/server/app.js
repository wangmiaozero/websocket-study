/*
 * @Description: 
 * @Version: 0.1
 * @Autor: wangmiao
 * @Date: 2021-02-16 00:14:26
 * @LastEditors: wangmiao
 * @LastEditTime: 2021-02-16 00:14:38
 */
const fs = require("fs");
const httpServ = require("https");
const WebSocketServer = require("ws").Server; // 引用Server类

const cfg = {
  port: 3456,
  ssl_key: "../../https/xxx.key", // 配置https所需的文件2
  ssl_cert: "../../https/xxx.crt", // 配置https所需的文件1
};

// 创建request请求监听器
const processRequest = (req, res) => {
  res.writeHead(200);
  res.end("Websocket linked successfully");
};

const app = httpServ
  .createServer(
    {
      // 向server传递key和cert参数
      key: fs.readFileSync(cfg.ssl_key),
      cert: fs.readFileSync(cfg.ssl_cert),
    },
    processRequest
  )
  .listen(cfg.port);

// 实例化WebSocket服务器
const wss = new WebSocketServer({
  server: app,
});
// 群发
wss.broadcast = function broadcast(data) {
    wss.clients.forEach(function each(client) {
      client.send(data);
    });
};
// 如果有WebSocket请求接入，wss对象可以响应connection事件来处理
wss.on("connection", (wsConnect) => {
  console.log("Server monitoring");
  wss.broadcast(wss._server._connections);
  wsConnect.on("message", (message) => {
    wss.broadcast(message);
  });
  wsConnect.on("close", function close() {
    console.log("disconnected");
    wss.broadcast(wss._server._connections);
  });
});