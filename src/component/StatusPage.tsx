import React, {FC, useState} from "react";
import { Text, View, LayoutAnimation, NativeModules, Image } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { ButtonText, SlideText, SlideTitle, SubTitle, Title } from "../component/text";
import { ButtonTouchable, RoundTouchable, SimpleTouchable } from "../component/touchable";
import { CenterView, ContainerView, PlainRowView, RowView, SlideTitleContainer } from "../component/view";
import { SCREEN, STATUS_TYPE } from "../constant/constant";
import { getRequestToAnswerQuestions } from "../request/question";
import { ContextObj, Language, MultiLanguage, PageProps } from "../type/common";
import { ContextConsumer } from "../utils/context";
import imageLoader from "../utils/imageLoader";
import { T } from "../utils/translate";

const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

type StatusPageProps = {
  isSuccess: boolean,
  text: string,
  textExtraStyle?: any,
  buttonExtraStyle?: any,
  buttonTextExtraStyle?: any,
  onClickEvent: any,
  buttonText: string,
}

export const StatusPage: FC<StatusPageProps> = ({isSuccess, text, textExtraStyle, buttonExtraStyle,
  buttonTextExtraStyle, onClickEvent, buttonText}) => {

  const image = (isSuccess) ? imageLoader.character_done : imageLoader.character_fail;
  const getContent = (contextObj: ContextObj) => {
    const {theme, user} = contextObj;
    const {language} = user;
    const baseWidth = wp(40);
    const width = (isSuccess) ? baseWidth : baseWidth * 1.4;
    // text #00000080
    return (
      <ContainerView style={{paddingHorizontal: wp(10)}}>
        <ContainerView>
          <Image source={image} style={{width, height: baseWidth * 1.4, marginBottom: hp(2), marginTop: hp(4)}} />
          <Title style={{color: "#00000080", fontSize: hp(2), textAlign: "center", ...textExtraStyle}}>{text}</Title>
        </ContainerView>
        <RoundTouchable style={{padding: wp(2), width: wp(80), height: hp(6.5), marginBottom: hp(6), ...buttonExtraStyle}}
          activeOpacity={0.6} onPress={() => onClickEvent()}>
          <Title style={{color: theme.onSecondary, fontSize: hp(2.25), ...buttonTextExtraStyle}}>{buttonText}</Title>
        </RoundTouchable>
      </ContainerView>
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
