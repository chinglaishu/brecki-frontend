import { DrawerNavigationProp } from "@react-navigation/drawer";
import { StackNavigationProp } from "@react-navigation/stack";
import moment from "moment";
import React, {FC, useEffect, useState} from "react";
import { Text, View, LayoutAnimation, NativeModules, Image, ScrollView } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { RoundButton } from "../../component/button";
import { NormalModal } from "../../component/modal";
import { ButtonText, SlideText, SlideTitle, SubTitle, Title } from "../../component/text";
import { ButtonTouchable, PlainTouchable, RoundTouchable, SimpleTouchable } from "../../component/touchable";
import { CenterView, ContainerView, PlainRowView, RowView, SlideTitleContainer, ThreePartRow } from "../../component/view";
import { SCREEN, STATUS_TYPE } from "../../constant/constant";
import { getRequestToAnswerQuestions, getSubmitQuestionRecordById, getSubmitQuestionRecords, getSubmitQuestionScoreRecords, getSubmitQuestionScoreRecordsBySubmitQuestionRecordId } from "../../request/question";
import { ContextObj, Language, MultiLanguage, PageProps, User } from "../../type/common";
import { ContextConsumer } from "../../utils/context";
import imageLoader from "../../utils/imageLoader";
import { BORDER_RADIUS, COMMON_BORDER_RADIUS, COMMON_ELEVATION, COMMON_OVERLAY, COMMON_SHADOW, EXTRA_BORDER_RADIUS, EXTRA_ELEVATION, EXTRA_SHADOW, TRANSPARENT } from "../../utils/size";
import { T } from "../../utils/translate";
import { checkIfRequestError, getChangeStatusModalFromNavigation, getParamFromNavigation, makeRequestWithStatus } from "../../utils/utilFunction";
import { PersonalityScore, SubmitQuestionRecord, SubmitQuestionScoreRecord } from "../question/type";
import { PersonalityScoreBlock } from "./personlityScoreBlock";
import { QuestionRecordDataList } from "./QuestionRecordDataList";
import { QuestionScoreRecordDataList } from "./QuestionScoreRecordDataList";

export type QuestionRecordModalProps = {
  navigation: StackNavigationProp<any>,
  useUser: User,
  isVisible: boolean,
  setIsVisible: (isVisible: boolean) => any,
};

export const QuestionRecordModal: FC<QuestionRecordModalProps> = ({navigation, useUser, isVisible, setIsVisible}) => {

  console.log('a')
  console.log(isVisible);

  const changeStatusModal = getChangeStatusModalFromNavigation(navigation);
  const [submitQuestionRecords, setSubmitQuestionRecords] = useState([] as SubmitQuestionRecord[]);
  const [submitQuestionScoreRecords, setSubmitQuestionScoreRecords] = useState([] as SubmitQuestionScoreRecord[]);
  // not null if viewing a submitQuestion record id
  const [submitQuestionRecordId, setSubmitQuestionRecordId] = useState(null as any);

  const requestSubmitQuestionRecords = async () => {
    const result = await makeRequestWithStatus<SubmitQuestionRecord[]>(() => getSubmitQuestionRecords(useUser.id), changeStatusModal, false, true, true);
    if (!result) {return; }
    const data = result.data.data;
    const reverse = data.reverse();
    setSubmitQuestionRecords(reverse);
  };

  const requestSubtmiQuestionScoreRecords = async (submitQuestionRecordId: string) => {
    const result = await makeRequestWithStatus<SubmitQuestionScoreRecord[]>(() => getSubmitQuestionScoreRecordsBySubmitQuestionRecordId(submitQuestionRecordId), changeStatusModal, false, true, true);
    if (!result) {return; }
    const data = result.data.data;
    const reverse = data.reverse();
    setSubmitQuestionScoreRecords(reverse);
  };

  useEffect(() => {
    if (submitQuestionRecordId) {
      requestSubtmiQuestionScoreRecords(submitQuestionRecordId);
    }
  }, [submitQuestionRecordId]);

  useEffect(() => {
    requestSubmitQuestionRecords();
  }, []);

  const getContent = (contextObj: ContextObj) => {
    const {theme, user, setOverlayColor, changeStatusModal} = contextObj;
    const {language} = user;

    const isSelf = user.id === useUser.id;

    const getTitle = () => {
      if (submitQuestionRecordId) {
        for (let i = 0 ; i < submitQuestionRecords.length ; i++) {
          if (submitQuestionRecords[i].id === submitQuestionRecordId) {
            const date = submitQuestionRecords[i].createdAt;
            return moment(date).format("YYYY-MM-DD HH:mm");
          }
        }
        return "";
      } else {
        return T.QUESTION_RECORD[language];
      }
    }
  
    const getHeader = () => {
  
      return (
        <RowView style={{height: hp(6), marginTop: hp(1), elevation: COMMON_ELEVATION, ...COMMON_SHADOW}}>
          {submitQuestionRecordId && <PlainTouchable onPress={() => setSubmitQuestionRecordId(null)}>
            <Image source={imageLoader.back} style={{width: hp(2.5), height: hp(2.5), marginRight: wp(2)}} />
          </PlainTouchable>}
  
          <Text style={{fontSize: hp(2), color: theme.text}}>
            {getTitle()}
          </Text>
  
        </RowView>
      );
    };

    console.log('isv');
    console.log(isVisible);
  
    return (
      <NormalModal isVisible={isVisible}>
        <PlainTouchable style={{height: hp(100), width: wp(100)}} activeOpacity={1.0}
          onPress={() => setIsVisible(false)}>
          <ContainerView style={{justifyContent: "flex-end", backgroundColor: TRANSPARENT,
            paddingHorizontal: wp(6), height: hp(100), paddingBottom: hp(3) }}>
            <PlainTouchable activeOpacity={1.0}>
              <View style={{borderRadius: COMMON_BORDER_RADIUS, backgroundColor: theme.onPrimary, paddingHorizontal: wp(5), 
                paddingBottom: hp(1)}}>

                {getHeader()}

                <View style={{maxHeight: hp(35), minHeight: hp(15)}}>
                  <ScrollView contentContainerStyle={{paddingHorizontal: wp(1), paddingBottom: hp(2)}}>
                    {!submitQuestionRecordId && 
                      <QuestionRecordDataList navigation={navigation} submitQuestionRecords={submitQuestionRecords}
                        useUser={useUser} setSubmitQuestionRecordId={setSubmitQuestionRecordId} setIsVisible={setIsVisible}
                        isSelf={isSelf} />
                    }
                    {submitQuestionRecordId &&
                      <QuestionScoreRecordDataList navigation={navigation} submitQuestionScoreRecords={submitQuestionScoreRecords}
                        useUser={useUser} setIsVisible={setIsVisible} />
                    }
                  </ScrollView>
                </View>
              </View>
            </PlainTouchable>
          </ContainerView>
        </PlainTouchable>
      </NormalModal>
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
