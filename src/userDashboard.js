import React, { useState, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Chip from "@material-ui/core/Chip";
import Button from "@material-ui/core/Button";
//import Icon from "@material-ui/core/Icon";
//import FaceIcon from "@material-ui/core/Icon";
import TextField from "@material-ui/core/TextField";
import io from "socket.io-client";

let socket;

const useStyles = makeStyles(theme => ({
  root: {
    margin: "5%"
  },
  paperStyle: {
    backgroundColor: "#E7F2F8",

    padding: "5%"
  },
  header: {
    borderBottom: "1px solid grey",
    padding: "1%"
  },
  flex: {
    display: "flex",
    alignItems: "center"
    //justifyContent: "space-between"
  },
  chatWindow: {
    width: "70%",
    height: "350px",
    padding: "2%",
    overflow: "auto"
  },
  friendsWindow: {
    width: "30%",
    height: "350px",
    borderLeft: "1px solid grey",
    alignItems: "center",
    paddingLeft: "2%",
    overflow: "auto"
  },
  chatBox: {
    width: "70%",
    justifyContent: "flex-end"
  },
  sender: {
    display: "flex",
    letterSpacing: "0.2%",
    alignItems: "center",
    justifyContent: "flex-end",
    verticalAlign: "bottom"
  },
  button: {
    margin: theme.spacing(1)
    //width: "30%"
    //alignItems: "center",
    //paddingLeft: "1%"
  },
  chip: {
    margin: "0.5%"
  }
}));

export default function UserDashboard({ location }) {
  const classes = useStyles();
  const [user, setUser] = useState("");
  const tmpUser = `User-${Math.random(100).toFixed(2)}`;
  const [newUser, setNewUser] = useState(tmpUser);
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const endpoint = ":3001";

  const messagesEndRef = useRef(null);

  // ensures chatbox is at the bottom, upon the arrive of a new message
  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    socket = io(endpoint);
    setNewUser(tmpUser);
    setUser(tmpUser);

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
      socket.emit("change nickName", { from: user, msg: message });

      // notify user about unability to change name
      socket.on("nick name error", function(value) {
        alert(
          `Unable to set your nick name to ${value}, your name will remain the same :(`
        );
      });
    } else if (tmp[0] === "/nickcolor") {
      socket.emit("change nick color", { from: user, msg: message });
    } else {
      socket.emit("send Message", { from: user, msg: message });
    }

    setMessage("");
  };

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
        <div className={classes.flex}>
          <div className={classes.chatWindow}>
            {messages.map((c, index) =>
              c.from === user ? (
                <div className={classes.sender} key={index}>
                  <Chip
                    label={c.msg}
                    className={classes.chip}
                    variant="outlined"
                    color="primary"
                    //icon={<FaceIcon />}
                    style={{
                      color: c.color,
                      fontWeight: "bold",
                      padding: "1%",
                      marginRight: "1%"
                    }}
                  />

                  <Typography
                    variant="body1"
                    gutterBottom
                    style={{ fontWeight: "bold", marginRight: "1%" }}
                  >
                    {c.nickName}{" "}
                  </Typography>

                  <Typography variant="body1" gutterBottom>
                    [{c.time}]{" "}
                  </Typography>
                </div>
              ) : (
                <div className={classes.flex} key={index}>
                  <Typography
                    variant="body1"
                    gutterBottom
                    style={{ marginRight: "1%" }}
                  >
                    [{c.time}]{" "}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {c.nickName}{" "}
                  </Typography>
                  <Chip
                    label={c.msg}
                    className={classes.chip}
                    style={{ color: c.color, padding: "1%", marginLeft: "1%" }}
                  />
                </div>
              )
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className={classes.friendsWindow}>
            <Paper style={{ marginBottom: "1%" }}>
              <Typography variant="h6" component="h6">
                Active Users
              </Typography>
            </Paper>
            {users.map((name, index) =>
              name.status === "online" ? (
                <div className={classes.flex} key={index}>
                  <Typography
                    variant="body1"
                    gutterBottom
                    style={{ color: name.color }}
                  >
                    {name.nickName}{" "}
                  </Typography>
                </div>
              ) : null
            )}
          </div>
        </div>
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
              //endIcon={<Icon>send</Icon>}
            >
              Send
            </Button>
          </div>
        </div>
      </Paper>
    </div>
  );
}
