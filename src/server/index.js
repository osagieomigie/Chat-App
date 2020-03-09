var app = require("express")();
var http = require("http").createServer(app);
var io = require("socket.io")(http);

let users = [];
let chatHistory = [];

io.on("connection", function(socket) {
  // update online users
  socket.on("userName", function(value) {
    console.log(`A user connected ${value}`);
    users.push({
      userName: value,
      nickName: value,
      socketID: socket.id,
      color: "#000000",
      status: "online"
    });

    // reflect user that joined group
    io.emit("Update live users", users);
    console.log(users);
  });

  // when a user joins the group chat, the Group should be notified. The user should also see previous messages
  io.emit("user connected", chatHistory);
  console.log(JSON.stringify(chatHistory));

  // reflect changes made
  io.emit("Update live users", users);

  // if user sets their nick name.
  socket.on("change nickName", function(value) {
    let givenName = value.from;
    value.from = value.msg.substring(6);

    // search to see if name is unique
    const getNames = users.find(user => user.nickName === value.from);

    // set name if unique
    if (getNames == null) {
      users.forEach(user => {
        if (user.userName === givenName) {
          user.nickName = value.from;
        }
      });
    } else {
      // notify user about unability to change name
      io.emit("nick name error", value.from);
    }

    // reflect changes made
    io.emit("Update live users", users);
  });

  // if user changes their nickname color.
  socket.on("change nick color", function(value) {
    value.msg = value.msg.substring(11);
    users.forEach(user => {
      if (user.userName === value.from) {
        user.color = value.msg;
      }
    });

    // reflect changes made
    io.emit("Update live users", users);
  });

  // when user sends a chat
  socket.on("send Message", function(value) {
    console.log("message: " + value.msg);

    // send back timestamp
    var d = new Date();
    d = d.toLocaleTimeString();

    // verify user before emitting.
    users.forEach(user => {
      if (value.from === user.userName) {
        //value.from = user.nickName; // update user name to nick name
        value.color = user.color;
        value.nickName = user.nickName;
      }
    });
    value.time = d;

    // send chat to all users
    io.emit("chat message", value);
    chatHistory.push(value);
  });

  // update users online, delete users that have left chat
  socket.on("disconnect", function(user) {
    users.forEach((user, index) => {
      if (user.socketID === socket.id) {
        console.log(`${user.userName} left`);
        delete users[index];
        users.splice(index, 1);
        //user.status = "offline";

        // reflect user that left group chat
        io.emit("Update live users", users);
        console.log(users);
      }
    });
  });
});

http.listen(3001, function() {
  console.log("listening on *:3001");
});
