import { StackNavigationProp } from "@react-navigation/stack";
import moment from "moment-timezone";
import React, {FC, useEffect, useState} from "react";
import { Text, View, LayoutAnimation, NativeModules, Image } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { RoundButton } from "../../component/button";
import { ButtonText, SlideText, SlideTitle, SubTitle, Title } from "../../component/text";
import { ButtonTouchable, PlainTouchable, RoundTouchable, SimpleTouchable } from "../../component/touchable";
import { CenterView, ContainerView, PlainRowView, RowView, SlideTitleContainer, ThreePartRow } from "../../component/view";
import { SCREEN, STATUS_TYPE } from "../../constant/constant";
import { getRequestToAnswerQuestions, getSubmitQuestionRecordById, getSubmitQuestionRecords, submitQuestionScoreRecord } from "../../request/question";
import { ContextObj, Language, MultiLanguage, PageProps, User } from "../../type/common";
import { ContextConsumer } from "../../utils/context";
import imageLoader from "../../utils/imageLoader";
import { COMMON_BORDER_RADIUS, COMMON_OVERLAY, COMMON_SHADOW, EXTRA_BORDER_RADIUS, EXTRA_ELEVATION, EXTRA_SHADOW, TRANSPARENT } from "../../utils/size";
import { T } from "../../utils/translate";
import { checkIfRequestError, getChangeStatusModalFromNavigation, getParamFromNavigation, makeRequestWithStatus } from "../../utils/utilFunction";
import { PersonalityScore, SubmitQuestionRecord } from "../question/type";
import { PersonalityScoreBlock } from "./personlityScoreBlock";

type QuestionRecordDataListProps = {
  navigation: StackNavigationProp<any>,
  submitQuestionRecords: SubmitQuestionRecord[],
  useUser: User,
  setSubmitQuestionRecordId: (submitQuestionRecordId: string) => any,
  setIsVisible: (isVisible: boolean) => any,
  isSelf: boolean,
}

export const QuestionRecordDataList: FC<QuestionRecordDataListProps> = ({navigation, submitQuestionRecords, useUser, setSubmitQuestionRecordId, setIsVisible, isSelf}) => {

  const getContent = (contextObj: ContextObj) => {
    const {theme, user, setOverlayColor, changeStatusModal, setUseNavigation} = contextObj;
    const {language} = user;

    const toQuestion = (submitQuestionRecordId: string) => {
      setUseNavigation({navigation});
      navigation.navigate(SCREEN.QUESTION, {submitQuestionRecordId, useUser, isReadOnly: true});
      setIsVisible(false);
    };
  
    const toQuestionRecord = (submitQuestionRecordId: string) => {
      console.log(isSelf);
      setUseNavigation({navigation});
      navigation.navigate(SCREEN.QUESTION_RECORD, {submitQuestionRecordId, useUser, isReadOnly: isSelf});
      setIsVisible(false);
    }
  

    const getBody = (name: any, submitQuestionRecord: SubmitQuestionRecord) => {
      const date = moment(submitQuestionRecord.createdAt).format("YYYY-MM-DD HH:mm");
      return (
        <CenterView>
          <RowView style={{justifyContent: "flex-start"}}>
            <Text style={{fontSize: hp(1.4), color: theme.subText}}>{date}</Text>
          </RowView>
        </CenterView>
      );
    };

    const getButton = (submitQuestionRecordId: string) => {
      return (
        <View style={{flexDirection: "row"}}>
          {user.id !== useUser.id && <RoundTouchable activeOpacity={0.6} style={{height: hp(4), width: hp(4), backgroundColor: theme.primary}}
            onPress={() => toQuestionRecord(submitQuestionRecordId)}>
            <Image source={imageLoader.pen} style={{height: hp(2), width: hp(2)}} />
          </RoundTouchable>}
          {user.id === useUser.id && <RoundTouchable activeOpacity={0.6} style={{height: hp(4), width: hp(4), backgroundColor: theme.primary}}
            onPress={() => setSubmitQuestionRecordId(submitQuestionRecordId)}>
            <Image source={imageLoader.review} style={{height: hp(2), width: hp(2)}} />
          </RoundTouchable>}
        </View>
      );
    };

    const getRow = (submitQuestionRecord: SubmitQuestionRecord, index: number) => {
      const marginTop = (index === 0) ? hp(2) : hp(2);
      const borderRadius = COMMON_BORDER_RADIUS * 2;
      const personalInfo = submitQuestionRecord?.user?.personalInfo;
      const name = personalInfo?.name;
      const profileUrl = personalInfo?.profilePicOneUrl;
      return (
        <PlainTouchable activeOpacity={0.8} onPress={() => toQuestion(submitQuestionRecord.id)}>
          <ThreePartRow height={hp(8)} extraStyle={{borderRadius, borderColor: theme.border, borderWidth: 2, marginTop,
            backgroundColor: theme.onSecondary, elevation: EXTRA_ELEVATION, ...COMMON_SHADOW}}
            Left={null}
            Body={getBody(name, submitQuestionRecord)}
            Right={getButton(submitQuestionRecord.id)}
          />
        </PlainTouchable>
      );
    };

    return (
      <ContainerView style={{backgroundColor: TRANSPARENT}}>
        {submitQuestionRecords.map((submitQuestionRecord, index: number) => {
          return getRow(submitQuestionRecord, index);
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
