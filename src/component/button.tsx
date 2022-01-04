import React, {FC, useState} from "react";
import { Image, Button } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { BORDER_RADIUS, ROUND_BUTTON_HEIGHT } from "../utils/size";
import { InputContainer } from "./view";
import styled, { DefaultTheme } from "styled-components/native";
import { FONT_NORMAL } from "../constant/constant";
import { PlainTouchable, RoundTouchable } from "./touchable";
import { ContextConsumer } from "../utils/context";
import { ContextObj } from "../type/common";
import { Title } from "./text";
import { T } from "../utils/translate";

type RoundButtonProps = {
  touchableExtraStyle?: any,
  buttonText: string,
  buttonTextExtraStyle?: any,
  clickFunction: any,
}

export const RoundButton: FC<RoundButtonProps> = ({touchableExtraStyle, buttonText, buttonTextExtraStyle, clickFunction}) => {

  const getContent = (contextObj: ContextObj) => {
    const {theme, user} = contextObj;
    const {language} = user;

    return (
      <RoundTouchable style={{padding: wp(2), width: wp(80), height: ROUND_BUTTON_HEIGHT, ...touchableExtraStyle}}
        activeOpacity={0.6} onPress={() => clickFunction()}>
        <Title style={{color: theme.onSecondary, fontSize: hp(2.25), ...buttonTextExtraStyle}}>{buttonText}</Title>
      </RoundTouchable>
    );
  };

  return (
    <ContextConsumer>
      {(contextObj: ContextObj) => {
        return getContent(contextObj);
      }}
    </ContextConsumer>
  )
};
