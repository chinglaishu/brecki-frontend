import { StackNavigationProp } from "@react-navigation/stack";
import React, {FC, useEffect, useState} from "react";
import { Text, View, LayoutAnimation, NativeModules, Image } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { RoundButton } from "../../component/button";
import { ButtonText, SlideText, SlideTitle, SubTitle, Title } from "../../component/text";
import { ButtonTouchable, PlainTouchable, SimpleTouchable } from "../../component/touchable";
import { CenterView, ContainerView, PlainRowView, RowView, SlideTitleContainer, ThreePartRow } from "../../component/view";
import { SCREEN, STATUS_TYPE } from "../../constant/constant";
import { getRequestToAnswerQuestions, getSubmitQuestionRecordById, getSubmitQuestionRecords, getSubmitQuestionScoreRecords } from "../../request/question";
import { ContextObj, Language, MultiLanguage, PageProps, PersonalInfo, User } from "../../type/common";
import { ContextConsumer } from "../../utils/context";
import imageLoader from "../../utils/imageLoader";
import { COMMON_BORDER_RADIUS, COMMON_OVERLAY, EXTRA_BORDER_RADIUS, EXTRA_ELEVATION, EXTRA_SHADOW, TRANSPARENT } from "../../utils/size";
import { T } from "../../utils/translate";
import { checkIfRequestError, getChangeStatusModalFromNavigation, getParamFromNavigation, makeRequestWithStatus } from "../../utils/utilFunction";
import { PersonalityScore, SubmitQuestionRecord, SubmitQuestionScoreRecord } from "../question/type";
import { PersonalityScoreBlock } from "./personlityScoreBlock";

type QuestionScoreRecordDataListProps = {
  navigation: StackNavigationProp<any>
  submitQuestionScoreRecords: SubmitQuestionScoreRecord[],
  useUser: User,
};

export const QuestionScoreRecordDataList: FC<QuestionScoreRecordDataListProps> = ({navigation, submitQuestionScoreRecords}) => {

  const changeStatusModal = getChangeStatusModalFromNavigation(navigation);
  const userId: string = getParamFromNavigation(navigation, "userId");

  const getContent = (contextObj: ContextObj) => {
    const {theme, user, setOverlayColor, changeStatusModal} = contextObj;
    const {language} = user;

    const getBody = (name: any) => {
      return (
        <CenterView>
          <RowView style={{marginBottom: hp(0.25), justifyContent: "flex-start"}}>
            <Text style={{fontSize: hp(2)}}>{name}</Text>
          </RowView>
          <RowView style={{justifyContent: "flex-start", flexWrap: "wrap"}}>
            <Text>{"sfdsf"}</Text>
          </RowView>
        </CenterView>
      );
    };

    const getRow = (submitQuestionScoreRecord: SubmitQuestionScoreRecord, index: number) => {
      const marginTop = (index === 0) ? 0 : hp(2);
      const personalInfo = submitQuestionScoreRecord.user.personalInfo;
      const name = personalInfo?.name;
      const profileUrl = personalInfo?.profilePicOneUrl;
      const borderRadius = COMMON_BORDER_RADIUS * 2;
      const param = {submitQuestionScoreRecordId: submitQuestionScoreRecord.id, submitQuestionRecordId: submitQuestionScoreRecord.submitQuestionRecordId, isReadOnly: true};
      return (
        <PlainTouchable activeOpacity={0.8} onPress={() => navigation.navigate(SCREEN.QUESTION_RECORD, param)}>
          <ThreePartRow height={hp(12)} extraStyle={{borderRadius, borderColor: theme.border, borderWidth: 2, marginTop,
            backgroundColor: theme.onSecondary, elevation: EXTRA_ELEVATION, ...EXTRA_SHADOW}}
            Left={<Image source={{uri: profileUrl}} style={{height: hp(8), width: hp(8), borderRadius: borderRadius * 2, borderWidth: 2, borderColor: theme.border}} />}
            Body={getBody(name)}
            Right={null}
          />
        </PlainTouchable>
      );
    };

    return (
      <ContainerView style={{}}>
        {submitQuestionScoreRecords.map((submitQuestionScoreRecord, index: number) => {
          return getRow(submitQuestionScoreRecord, index);
        })}  
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
