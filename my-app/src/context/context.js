import React, { createContext, useReducer } from "react";
import { reducer } from "./reducer";
export const GlobalContext = createContext("Initial Value");

// data is the state variable and we update state variable by process first we make a clone of state variable
// then we add in the place of old variable
let data = {
  user: {},
  isLogin: null,
  role: null,
  // name: "some thing else",
  darkTheme: true,
};

export default function ContextProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, data);
  return (
    <GlobalContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalContext.Provider>
  );
}
