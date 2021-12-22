import React, {FC, useState} from "react";
import { Text, View, LayoutAnimation, NativeModules, Image } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { StatusPage } from "../../component/StatusPage";
import { ButtonText, SlideText, SlideTitle, SubTitle, Title } from "../../component/text";
import { ButtonTouchable, RoundTouchable, SimpleTouchable } from "../../component/touchable";
import { CenterView, ContainerView, PlainRowView, RowView, SlideTitleContainer } from "../../component/view";
import { SCREEN, STATUS_TYPE } from "../../constant/constant";
import { getRequestToAnswerQuestions } from "../../request/question";
import { ContextObj, Language, MultiLanguage, PageProps } from "../../type/common";
import { ContextConsumer } from "../../utils/context";
import imageLoader from "../../utils/imageLoader";
import { COMMON_OVERLAY, EXTRA_BORDER_RADIUS, EXTRA_ELEVATION, TRANSPARENT } from "../../utils/size";
import { T } from "../../utils/translate";
import { checkIfRequestError, makeRequestWithStatus } from "../../utils/utilFunction";
import { Canvas } from "./Canvas";
import { QuestionSlide } from "./QuestionSlide";
import { SelectQuestionNumModal } from "./SelectQuestionNumModal";
import { Question } from "./type";

const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

export const SubmitQuestionEnd: FC<PageProps> = ({navigation}) => {

  const getContent = (contextObj: ContextObj) => {
    const {theme, user, setOverlayColor, changeStatusModal, useNavigation, setUseNavigation} = contextObj;
    const {language} = user;
    const width = wp(40);

    const clickBackFunction = () => {
      useNavigation?.navigation.navigate(useNavigation.backScreen);
      setUseNavigation(null);
    };

    const clickLike = async () => {
      
      clickBackFunction();
    };

    return (
      <ContainerView style={{paddingHorizontal: wp(10)}}>
        <ContainerView>
          <Image source={imageLoader.character_done} style={{width, height: width * 1.4, marginBottom: hp(2), marginTop: hp(4)}} />
          <Title style={{color: "#00000080", fontSize: hp(2), textAlign: "center"}}>{T.SUBMIT_QUESTION_END[language]}</Title>
        </ContainerView>

        <RoundTouchable style={{padding: wp(2), width: wp(80), height: hp(6.5), marginBottom: hp(2), backgroundColor: theme.warning,
          flexDirection: "row"}}
          activeOpacity={0.6} onPress={() => console.log("like")}>
          <Image source={imageLoader.heart} style={{width: hp(2.5), height: hp(2.1), marginRight: wp(2)}} />
          <Title style={{color: theme.onSecondary, fontSize: hp(2.25)}}>{T.LIKE[language]}</Title>
        </RoundTouchable>

        <RoundTouchable style={{padding: wp(2), width: wp(80), height: hp(6.5), marginBottom: hp(4)}}
          activeOpacity={0.6} onPress={() => clickBackFunction()}>
          <Title style={{color: theme.onSecondary, fontSize: hp(2.25)}}>{T.BACK[language]}</Title>
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