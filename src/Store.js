import React from "react";
import io from "socket.io-client";

export const CTX = React.createContext();

// { from: "Nadia", msg: "Hey" },
// { from: "Ahmed", msg: "Bye" }
const initialState = {
  messages: []
};

function reducer(state, action) {
  switch (action.type) {
    case "RECEIVE_MESSAGE":
      return {
        ...state,
        messages: [...state.messages, action.payload]
      };
    default:
      return state;
  }
}

let socket;

function sendChatAction(value) {
  socket.emit("chat message", value);
}

const user = "Osa" + Math.random(100).toFixed(2);

export default function Store(props) {
  const [allChats, dispatch] = React.useReducer(reducer, initialState);

  if (!socket) {
    socket = io(":3001");
    socket.on("chat message", function(msg) {
      // add chat to store
      dispatch({ type: "RECEIVE_MESSAGE", payload: msg });
    });
  }

  return (
    <CTX.Provider value={{ allChats, sendChatAction, user }}>
      {props.children}
    </CTX.Provider>
  );
}
