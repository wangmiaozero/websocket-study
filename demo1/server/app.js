/*
 * @Description: 
 * @Version: 0.1
 * @Autor: wangmiao
 * @Date: 2021-02-16 00:01:25
 * @LastEditors: wangmiao
 * @LastEditTime: 2021-02-16 00:09:02
 */
const ws = require("nodejs-websocket");
const server = ws.createServer((conn) => {
  conn.on("text", (str) => {
      console.log(str)
    broadcast(str);
  });
  conn.on("error", (err) => {
    console.log(err);
  });
});
server.listen(3000, function () {
  console.log(`open  http://localhost:3000/`);
});
// 群发消息
function broadcast(data) {
  server.connections.forEach((conn) => {
    conn.sendText(data);
  });
}