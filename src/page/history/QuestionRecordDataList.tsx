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
import { COMMON_BORDER_RADIUS, COMMON_OVERLAY, EXTRA_BORDER_RADIUS, EXTRA_ELEVATION, TRANSPARENT } from "../../utils/size";
import { T } from "../../utils/translate";
import { checkIfRequestError, getChangeStatusModalFromNavigation, getParamFromNavigation, makeRequestWithStatus } from "../../utils/utilFunction";
import { PersonalityScore, SubmitQuestionRecord } from "../question/type";
import { PersonalityScoreBlock } from "./personlityScoreBlock";

export const QuestionRecordDataList: FC<PageProps> = ({navigation}) => {

  const changeStatusModal = getChangeStatusModalFromNavigation(navigation);
  const userId: string = getParamFromNavigation(navigation, "userId");

  const [submitQuestionRecords, setSubmitQuestionRecords] = useState([] as SubmitQuestionRecord[]);

  const requestSubmitQuestionRecords = async () => {
    const result = await makeRequestWithStatus<SubmitQuestionRecord[]>(() => getSubmitQuestionRecords(userId), changeStatusModal, false);
    if (!result) {return; }
    setSubmitQuestionRecords(result.data.data);
  };

  useEffect(() => {
    requestSubmitQuestionRecords();
  }, []);

  const toQuestion = (submitQuestionRecordId: string) => {
    navigation.navigate(SCREEN.QUESTION, {submitQuestionRecordId});
  };

  const getContent = (contextObj: ContextObj) => {
    const {theme, user, setOverlayColor, changeStatusModal} = contextObj;
    const {language} = user;

    const getBody = (name: any, submitQuestionRecord: SubmitQuestionRecord) => {
      return (
        <CenterView>
          <RowView style={{marginBottom: hp(0.25), justifyContent: "flex-start"}}>
            <Text style={{fontSize: hp(2)}}>{name}</Text>
          </RowView>
          <RowView style={{justifyContent: "flex-start", flexWrap: "wrap"}}>
            <Text>{"sdfds"}</Text>
          </RowView>
        </CenterView>
      );
    };

    const getButton = (submitQuestionRecordId: string) => {
      if (user.id === userId) {return null; }
      return (
        <RoundTouchable activeOpacity={0.6} style={{height: hp(5), width: hp(5), backgroundColor: theme.primary}}
          onPress={() => toQuestion(submitQuestionRecordId)}>
          <Image source={imageLoader.pen} style={{height: hp(2.5), width: hp(3)}} />
        </RoundTouchable>
      );
    };

    const getRow = (submitQuestionRecord: SubmitQuestionRecord, index: number) => {
      const marginTop = (index === 0) ? 0 : hp(2);
      const borderRadius = COMMON_BORDER_RADIUS * 2;
      const personalInfo = submitQuestionRecord?.user?.personalInfo;
      const name = personalInfo?.name;
      const profileUrl = personalInfo?.profilePicOneUrl;
      return (
        <PlainTouchable activeOpacity={0.8} onPress={() => toQuestion(submitQuestionRecord.id)}>
          <ThreePartRow height={hp(12)} extraStyle={{borderRadius, borderColor: theme.border, borderWidth: 2, marginTop,
            backgroundColor: theme.onSecondary, elevation: EXTRA_ELEVATION}}
            Left={<Image source={{uri: profileUrl}} style={{height: hp(8), width: hp(8), borderRadius: borderRadius * 2, borderWidth: 2, borderColor: theme.border}} />}
            Body={getBody(name, submitQuestionRecord)}
            Right={getButton(submitQuestionRecord.id)}
          />
        </PlainTouchable>
      );
    };

    return (
      <ContainerView style={{}}>
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
