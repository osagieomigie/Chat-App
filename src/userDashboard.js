import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Chip from "@material-ui/core/Chip";
//import Icon from "@material-ui/core/Icon";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

import { CTX } from "./Store.js";

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
    padding: "20px"
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

export default function UserDashboard() {
  const classes = useStyles();
  const [textValue, changeTextValue] = useState();
  const { allChats, sendChatAction, user } = React.useContext(CTX);
  const [chat] = Object.values(allChats);

  return (
    <div className={classes.root}>
      <Paper className={classes.paperStyle}>
        <Typography variant="h5" component="h3">
          Chat Room
        </Typography>
        <div className={classes.flex}>
          <div className={classes.chatWindow}>
            {chat.map((chat, index) => (
              <div className={classes.flex} key={index}>
                <Chip label={chat.from} className={classes.chip} />
                <Typography variant="body1" gutterBottom>
                  {chat.msg}{" "}
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
            value={textValue}
            className={classes.chatBox}
            onChange={e => changeTextValue(e.target.value)}
            onKeyPress={e => {
              if (e.key === "Enter") {
                sendChatAction({ from: user, msg: textValue });
                changeTextValue("");
              }
            }}
          />
          <div className={classes.button}>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={() => {
                sendChatAction({ from: user, msg: textValue });
                changeTextValue("");
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
