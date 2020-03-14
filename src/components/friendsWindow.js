import React from "react";
import { useStyles } from "./useStyles";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";

function FriendsWindow({ users }) {
  const classes = useStyles();

  return (
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
  );
}

export default FriendsWindow;
