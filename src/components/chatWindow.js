import React, { useEffect, useRef } from "react";
import { useStyles } from "./useStyles.js";
import FriendsWindow from "./friendsWindow.js";
import Chip from "@material-ui/core/Chip";
import Typography from "@material-ui/core/Typography";

export default function ChatWindow({ messages, user, users }) {
  const classes = useStyles();

  const messagesEndRef = useRef(null);

  // ensures chatbox is at the bottom, upon the arrive of a new message
  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  return (
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
                style={{
                  fontWeight: "bold",
                  padding: "1%",
                  marginRight: "1%"
                }}
              />

              <Typography
                variant="body1"
                gutterBottom
                style={{
                  color: c.color,
                  fontWeight: "bold",
                  marginRight: "1%"
                }}
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
      <FriendsWindow users={users} />
    </div>
  );
}

// chatWindow;
