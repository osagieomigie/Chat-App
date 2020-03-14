import React, { useState, useEffect } from "react";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import io from "socket.io-client";
import { useStyles } from "./components/useStyles";
import ChatWindow from "./components/chatWindow.js";

let socket;

export default function UserDashboard() {
  const classes = useStyles();
  const [user, setUser] = useState("");
  const tmpUser = `User-${Math.random(100).toFixed(2)}`;
  const [newUser, setNewUser] = useState(tmpUser);
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  //const [cookies, setCookie] = useCookies(["name"]);
  const endpoint = ":3001";

  useEffect(() => {
    socket = io(endpoint);
    setNewUser(tmpUser);
    setUser(tmpUser);

    // emit user name and
    socket.emit("userName", tmpUser);

    // for new users
    socket.on("user connected", function(data) {
      console.log(JSON.stringify(data));
      data.forEach(element => {
        console.log(element);
        setMessages(messages => [...messages, element]);
      });
    });

    socket.on("Update live users", function(data) {
      console.log(JSON.stringify(data));
      setUsers(data);
    });
    // eslint-disable-next-line
  }, [newUser]);

  useEffect(() => {
    socket.on("chat message", payload => {
      setMessages([...messages, payload]);
      console.log(`message ${JSON.stringify(payload)}`);
    });

    socket.on("Update live users", function(data) {
      console.log(JSON.stringify(data));
      setUsers(data);
    });

    return () => {
      socket.emit("disconnect");

      socket.off();
    };
  }, [messages]);

  // determine users option before emitting
  let sendMessage = function(message) {
    let tmp = [];
    tmp = message.split(" ");
    if (tmp[0] === "/nick") {
      // error handling; prevents user from not entering name
      if (tmp[1] !== " " && tmp[1] !== null) {
        socket.emit("change nickName", {
          from: user,
          msg: message
        });
      }

      // notify user about unability to change name
      socket.on("nick name error", function(value) {
        alert(
          `Unable to set your nick name to ${value}, your name will remain the same :(`
        );
      });
    } else if (tmp[0] === "/nickcolor") {
      // error handling;
      if (tmp[1] !== " " && tmp[1] !== null) {
        socket.emit("change nick color", {
          from: user,
          msg: message
        });
      }
    } else {
      socket.emit("send Message", {
        from: user,
        msg: message
      });
    }

    setMessage("");
  };

  // let initCookie = function(newName) {
  //   setCookie("name", newName, { path: "/" });
  // };

  return (
    <div className={classes.root}>
      <Paper className={classes.paperStyle}>
        <Paper>
          <Typography variant="h5" component="h3" className={classes.header}>
            Osa's Chat Room
          </Typography>

          <Typography variant="h6" component="h6">
            You are: {user}
          </Typography>
        </Paper>
        <ChatWindow messages={messages} user={user} users={users} />
        <div className={classes.flex}>
          <TextField
            label="Send a chat"
            variant="outlined"
            value={message}
            className={classes.chatBox}
            onChange={e => setMessage(e.target.value)}
            onKeyPress={e => {
              if (e.key === "Enter") {
                sendMessage(message);
              }
            }}
          />
          <div className={classes.button}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              className={classes.button}
              onClick={() => {
                sendMessage(message);
              }}
            >
              Send
            </Button>
          </div>
        </div>
      </Paper>
    </div>
  );
}
