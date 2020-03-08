var app = require("express")();
var http = require("http").createServer(app);
var io = require("socket.io")(http);

let users = [];
let chatHistory = [];
//let userInfor = {};

io.on("connection", function(socket) {
  console.log("a user connected");

  // when a user joins the group chat, the Group should be notified
  io.emit("user connected", chatHistory);
  console.log(JSON.stringify(chatHistory));

  socket.on("send Message", function(value) {
    console.log("message: " + value);

    // send back timestamp
    var d = new Date();
    d = d.toLocaleTimeString();

    // if user sets their nick name.
    if (value.msg.includes("/nick")) {
      let givenName = value.from;
      value.from = value.msg.substring(6);
      users.push({ userName: givenName, nickName: value.from });
    } else {
      // verify user before emitting.
      users.forEach(user => {
        if (value.from === user.userName) {
          value.from = user.nickName; // update user name to nick name
        }
      });
      value.time = d;
      io.emit("chat message", value);
      chatHistory.push(value);
    }
  });

  //   socket.on('disconnect', function(){

  //   });
});

http.listen(3001, function() {
  console.log("listening on *:3001");
});
