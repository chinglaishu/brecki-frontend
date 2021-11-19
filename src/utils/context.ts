import React from "react";
import { getLightTheme } from "../style/theme";
import { ContextObj } from "../type/common";
import { guest } from "./data";

const contextObj: ContextObj = {
  user: guest,
  theme: getLightTheme("en"),
  changeStatusModal: null as any,
};

const Context = React.createContext(contextObj);

export const ContextProvider = Context.Provider;
export const ContextConsumer = Context.Consumer;
