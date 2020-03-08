import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Chip from "@material-ui/core/Chip";
//import Icon from "@material-ui/core/Icon";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import io from "socket.io-client";

let socket;

const useStyles = makeStyles(theme => ({
  root: {
    margin: "5%"
  },
  paperStyle: {
    padding: theme.spacing(3, 2)
  },
  flex: {
    display: "flex",
    alignItems: "center"
  },
  chatWindow: {
    width: "70%",
    height: "400px",
    padding: "20px",
    overflow: "auto"
  },
  friendsWindow: {
    width: "30%",
    height: "400px",
    borderLeft: "1px solid grey"
  },
  chatBox: {
    width: "85%"
  },
  button: {
    width: "15%"
  }
}));

export default function UserDashboard({ location }) {
  const classes = useStyles();
  const [user, setUser] = useState("");
  const tmpUser = `User-${Math.random(100).toFixed(2)}`;
  const [newUser, setNewUser] = useState(tmpUser);
  const [users, setUsers] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const endpoint = ":3001";

  useEffect(() => {
    socket = io(endpoint);
    setNewUser(tmpUser);
    setUser(tmpUser);

    // for new users
    socket.on("user connected", function(data) {
      console.log(JSON.stringify(data));
      data.forEach(element => {
        console.log(element);
        setMessages(messages => [...messages, element]);
      });
    });
  }, [newUser]);

  useEffect(() => {
    socket.on("chat message", message => {
      setMessages([...messages, message]);
    });

    socket.on("activeUsers", ({ users }) => {
      setUsers(users);
    });

    return () => {
      socket.emit("disconnect");

      socket.off();
    };
  }, [messages]);

  return (
    <div className={classes.root}>
      <Paper className={classes.paperStyle}>
        <Typography variant="h5" component="h3">
          Chat Room
        </Typography>
        <div className={classes.flex}>
          <div className={classes.chatWindow}>
            {messages.map((c, index) => (
              <div className={classes.flex} key={index}>
                <Chip label={c.from} className={classes.chip} />
                <Typography variant="body1" gutterBottom>
                  {c.msg}{" "}
                </Typography>
              </div>
            ))}
          </div>
          <div className={classes.friendsWindow}></div>
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
                socket.emit("send Message", { from: user, msg: message });
                setMessage("");
              }
            }}
          />
          <div className={classes.button}>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={() => {
                socket.emit("send Message", { from: user, msg: message });
                setMessage("");
              }}
              // endIcon={<Icon>></Icon>}
            >
              Send
            </Button>
          </div>
        </div>
      </Paper>
    </div>
  );
}
