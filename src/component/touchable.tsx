import React, {FC, useState} from "react";
import { Image, Text } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import styled from "styled-components/native";
import { FONT_BUTTON, FONT_NORMAL } from "../constant/constant";
import { User } from "../type/common";
import { BORDER_RADIUS } from "../utils/size";
import { T } from "../utils/translate";
import { SubTitle } from "./text";

type ImageTouchableProps = {
  imageSource: any,
  extraStyle?: any,
  text?: string,
}

export const ButtonTouchable = styled.TouchableOpacity.attrs(props => {
  return {
    // width: (props as any).width,
    // size: "1em",
  }
})`
  color: #FFFFFF;
  background-color: ${props => props.theme.lightSecondary};
  font-size: ${wp(3.5)};
  font-family: ${FONT_BUTTON};
  font-weight: 400;
  /* border: 2px solid red;
  border-radius: 3px; */
  border-top-right-radius: ${BORDER_RADIUS};
  border-bottom-left-radius: ${BORDER_RADIUS};
  border-right-color: ${props => props.theme.buttonBorder};
  border-right-width: 2;
  border-bottom-color: ${props => props.theme.buttonBorder};
  border-bottom-width: 2;

  shadow-opacity: 0.3;
  shadow-radius: 2px;
  shadow-color: #000000;
  shadow-offset: 2px 2px;
  elevation: 8;

  padding-left: ${wp(1.5)};
  padding-right: ${wp(1.5)};

  height: ${wp(7)};
  align-items: center;
  justify-content: center;
`;

export const SimpleTouchable = styled.TouchableOpacity.attrs(props => {
  return {
    // width: (props as any).width,
    // size: "1em",
  }
})`
  flex-direction: row;
  background-color: ${props => props.theme.buttonBackground};
  font-size: ${wp(3.5)};
  font-family: ${FONT_BUTTON};
  font-weight: 400;
  /* border: 2px solid red;
  border-radius: 3px; */
  border-top-right-radius: ${BORDER_RADIUS};
  border-bottom-left-radius: ${BORDER_RADIUS};

  border-color: ${props => props.theme.buttonBorder};
  border-width: 2;

  shadow-opacity: 0.3;
  shadow-radius: 2px;
  shadow-color: #000000;
  shadow-offset: 0px 0px;
  elevation: 5;

  padding-left: ${wp(2)};
  padding-right: ${wp(2)};
  height: ${wp(8)};
  align-items: center;
`;

export const PlainTouchable = styled.TouchableOpacity.attrs(props => {
  return {
    // width: (props as any).width,
    // size: "1em",
  }
})`
  flex-direction: row;
  align-items: center;
`;

export const ImageTouchable = ({imageSource, extraStyle, text}: ImageTouchableProps) => {
  return (
    <SimpleTouchable style={{...extraStyle}} activeOpacity={0.6}>
      <Image source={imageSource} style={{width: wp(5), height: wp(5)}} />
      {text && <SubTitle style={{paddingLeft: wp(2.5), minWidth: wp(35)}}>{text}</SubTitle>}
    </SimpleTouchable>
  )
};
