import React from "react";
import { getLightTheme } from "../style/theme";
import { ContextObj } from "../type/common";
import { guest } from "./data";
import { TRANSPARENT } from "./size";

const defaultFn: any = () => {console.log("default function")};
const contextObj: ContextObj = {
  user: guest,
  setUser: defaultFn,
  theme: getLightTheme("en"),
  setTheme: defaultFn,
  changeStatusModal: defaultFn,
  logout: defaultFn,
  overlayColor: TRANSPARENT,
  setOverlayColor: defaultFn,
  useNavigation: null,
  setUseNavigation: defaultFn,
  matchs: [],
  refreshMatchs: defaultFn,
  setMatchs: defaultFn,
  changeMatchIsTyping: defaultFn,
};

const Context = React.createContext(contextObj);

export const ContextProvider = Context.Provider;
export const ContextConsumer = Context.Consumer;
