import { makeStyles } from "@material-ui/core/styles";
export const useStyles = makeStyles(theme => ({
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
  },
  chip: {
    margin: "0.5%"
  }
}));
