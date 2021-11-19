import React, {FC, useState} from "react";
import { Image, Button } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { BORDER_RADIUS } from "../utils/size";
import { InputContainer } from "./view";
import styled, { DefaultTheme } from "styled-components/native";
import { FONT_NORMAL } from "../constant/constant";

export const NormalButton = styled.Button.attrs(props => {
  return {
  }
})`

`;

// export const NormalInput = () => {
//   maxLength = maxLength || 10;
//   return (

//   );
// };
