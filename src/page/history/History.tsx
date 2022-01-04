import React, {FC, useEffect, useState} from "react";
import { Text, View, LayoutAnimation, NativeModules, Image } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { RoundButton } from "../../component/button";
import { ButtonText, SlideText, SlideTitle, SubTitle, Title } from "../../component/text";
import { ButtonTouchable, SimpleTouchable } from "../../component/touchable";
import { CenterView, ContainerView, PlainRowView, RowView, SlideTitleContainer } from "../../component/view";
import { SCREEN, STATUS_TYPE } from "../../constant/constant";
import { getRequestToAnswerQuestions } from "../../request/question";
import { ContextObj, Language, MultiLanguage, PageProps, User } from "../../type/common";
import { ContextConsumer } from "../../utils/context";
import imageLoader from "../../utils/imageLoader";
import { COMMON_OVERLAY, EXTRA_BORDER_RADIUS, EXTRA_ELEVATION, TRANSPARENT } from "../../utils/size";
import { T } from "../../utils/translate";
import { checkIfRequestError, getChangeStatusModalFromNavigation, getParamFromNavigation, makeRequestWithStatus } from "../../utils/utilFunction";
import { PersonalityScore } from "../question/type";
import { PersonalityScoreBlock } from "./personlityScoreBlock";

export const HistoryPage: FC<PageProps> = ({navigation}) => {

  const changeStatusModal = getChangeStatusModalFromNavigation(navigation);
  const useUser: User = getParamFromNavigation(navigation, "useUser");

  const getContent = (contextObj: ContextObj) => {
    const {theme, user, setOverlayColor, changeStatusModal} = contextObj;
    const {language} = user;

    return (
      <ContainerView style={{}}>
        <PersonalityScoreBlock personalityScore={useUser.personalityScore as PersonalityScore} navigation={navigation as any} />
        <RoundButton touchableExtraStyle={{marginTop: hp(6), marginBottom: hp(2)}}
          buttonText={T.TO_QUESTION_RECORD[language]} clickFunction={() => navigation.navigate(SCREEN.QUESTION)} />
        <RoundButton touchableExtraStyle={{marginBottom: hp(6), backgroundColor: theme.empty}}
          buttonText={T.TO_QUESTION_SCORE_RECORD[language]} clickFunction={() => navigation.navigate(SCREEN.SYSTEM_LIKE_ZONE)} />
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
