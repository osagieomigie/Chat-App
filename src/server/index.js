var app = require("express")();
var http = require("http").createServer(app);
var io = require("socket.io")(http);
//var cookieParser = require("cookie-parser");
//app.use(cookieParser());

let users = [];
let chatHistory = [];
let activeUsers = [];

io.on("connection", function(socket) {
  // update online users
  socket.on("userName", function(value) {
    console.log(`A user connected ${value}`);

    users.push({
      userName: value,
      nickName: value,
      socketID: socket.id,
      color: "#000000"
    });

    activeUsers.push({
      userName: value,
      nickName: value,
      status: "online",
      color: "#000000"
    });

    // reflect user that joined group
    io.emit("Update live users", activeUsers); // send activeUsers

    console.log(`users: ${JSON.stringify(users)}`);
    console.log(`active users: ${JSON.stringify(activeUsers)}`);
  });

  // when a user joins the group chat, the Group should be notified. The user should also see previous messages
  io.emit("user connected", chatHistory);
  console.log(JSON.stringify(chatHistory));

  // reflect changes made
  io.emit("Update live users", activeUsers); // send activeUsers

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
          //user.cookie = value.cookie; // save info in a cookie

          // update activeUsers
          const getAUsers = activeUsers.find(
            aUser => aUser.userName === givenName
          );
          getAUsers.nickName = value.from;
        }
      });
    } else {
      // notify user about unability to change name
      io.emit("nick name error", value.from);
    }

    // reflect changes made
    io.emit("Update live users", activeUsers); // send activeUsers
  });

  // if user changes their nickname color.
  socket.on("change nick color", function(value) {
    value.msg = value.msg.substring(11);
    users.forEach(user => {
      if (user.userName === value.from) {
        user.color = value.msg;
        activeUsers.forEach(u => {
          if (u.userName === user.userName) {
            u.color = user.color;
          }
        });
      }
    });

    // reflect changes made
    io.emit("Update live users", activeUsers); // send activeUsers
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

        // update activeUsers
        activeUsers.forEach((u, i) => {
          if (u.userName == user.userName) {
            //delete activeUsers[i];
            activeUsers.splice(i, 1);
          }
        });

        // reflect user that left group chat
        io.emit("Update live users", activeUsers);
        console.log(users);
      }
    });
  });
});

http.listen(3001, function() {
  console.log("listening on *:3001");
});
