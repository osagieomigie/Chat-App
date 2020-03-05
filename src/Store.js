import React from "react";

export const CTX = React.createContext();

const initialState = {
  messages: [
    { from: "Nadia", msg: "Hey" },
    { from: "Ahmed", msg: "Bye" }
  ]
};

function reducer(state = initialState, action) {
  const { from, msg } = action.payload;
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

export default function Store(props) {
  const reducerHook = React.useReducer(reducer, initialState);
  return <CTX.Provider value={reducerHook}>{props.children}</CTX.Provider>;
}
