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
import { RoundButton } from "./button";

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
  buttonDisabled?: boolean,
  extraButtonDisabled?: boolean,
  extraButton?: boolean,
  extraButtonText?: string,
  extraButtonStyle?: any,
  extraButtonTextStyle?: any,
  extraButtonClickEvent?: any,
};

export const StatusPage: FC<StatusPageProps> = ({isSuccess, text, textExtraStyle, buttonExtraStyle, buttonDisabled,
  buttonTextExtraStyle, onClickEvent, buttonText, extraButton, extraButtonText, extraButtonStyle,
  extraButtonTextStyle, extraButtonClickEvent, extraButtonDisabled}) => {

  const image = (isSuccess) ? imageLoader.character_done : imageLoader.character_fail;
  const getContent = (contextObj: ContextObj) => {
    const {theme, user} = contextObj;
    const {language} = user;
    const baseWidth = wp(40);
    const width = (isSuccess) ? baseWidth : baseWidth * 1.4;
    const marginBottom = (extraButton) ? hp(2) : hp(6);
    // text #00000080
    return (
      <ContainerView style={{paddingHorizontal: wp(10)}}>
        <ContainerView>
          <Image source={image} style={{width, height: baseWidth * 1.4, marginBottom: hp(2), marginTop: hp(4)}} />
          <Title style={{color: "#00000080", fontSize: hp(2), textAlign: "center", ...textExtraStyle}}>{text}</Title>
        </ContainerView>
        <RoundButton disabled={buttonDisabled} touchableExtraStyle={{marginBottom, ...buttonExtraStyle}} buttonTextExtraStyle={buttonTextExtraStyle}
          buttonText={buttonText} clickFunction={() => onClickEvent()} />
        {extraButton && <RoundButton touchableExtraStyle={{marginBottom: hp(6), ...extraButtonStyle}} buttonTextExtraStyle={extraButtonTextStyle}
          buttonText={extraButtonText as any} clickFunction={() => extraButtonClickEvent()} disabled={!!extraButtonDisabled} />}
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
