import {DefaultTheme} from "styled-components";
import { Language } from "../type/common";

declare module "styled-components" {
  export interface DefaultTheme {
    language: Language;
    background: string;
    buttonBackground: string;
    primary: string;
    lightPrimary: string;
    onPrimary: string;
    secondary: string;
    lightSecondary: string;
    onSecondary: string;
    subTitle: string;
    subText: string;
    reminder: string;
    text: string;
    border: string;
    buttonBorder: string;
    warning: string;
  }
}

export const getLightTheme = (language: Language) => {
  const lightTheme: DefaultTheme = {
    language,
    background: "#FFF0DA",
    buttonBackground: "#FFFFFF",
    primary: "#FFC85A",
    lightPrimary: "#FFC85A",
    onPrimary: "#FFFFFF",
    secondary: "#09A99F",
    lightSecondary: "#15CDC1",
    onSecondary: "#FFFFFF",
    subTitle: "#464646",
    subText: "#B2B2B2",
    reminder: "#9C9C9C",
    text: "#1D1D1D",
    border: "#D6D6D6",
    buttonBorder: "#FFFFFF",
    warning: "#F25353",
  };
  return lightTheme;
}

export const getDarkTheme = (language: Language) => {
  const darkTheme: DefaultTheme = {
    language,
    background: "#FFFFFF",
    buttonBackground: "#FFFFFF",
    primary: "#00000040",
    lightPrimary: "#00000020",
    onPrimary: "#FFFFFF",
    secondary: "#00000050",
    lightSecondary: "#00000050",
    onSecondary: "#FFFFFF",
    subTitle: "#00000070",
    subText: "#00000040",
    reminder: "#828282",
    text: "#00000080",
    border: "#00000020",
    buttonBorder: "#FFFFFF",
    warning: "#F43737",
  }
  return darkTheme;
};
