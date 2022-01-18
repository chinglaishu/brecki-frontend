import { DrawerNavigationProp } from "@react-navigation/drawer";
import { StackNavigationProp } from "@react-navigation/stack";
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
import { COMMON_BORDER_RADIUS, COMMON_ELEVATION, COMMON_OVERLAY, COMMON_SHADOW, EXTRA_BORDER_RADIUS, EXTRA_ELEVATION, TRANSPARENT } from "../../utils/size";
import { T } from "../../utils/translate";
import { checkIfRequestError, getChangeStatusModalFromNavigation, getParamFromNavigation, makeRequestWithStatus } from "../../utils/utilFunction";
import { PersonalityScore, SubmitQuestionRecord, SubmitQuestionScoreRecord } from "../question/type";
import { PersonalityScoreBlock } from "./personlityScoreBlock";
import { QuestionRecordDataList } from "./QuestionRecordDataList";
import { QuestionScoreRecordDataList } from "./QuestionScoreRecordDataList";

export type QuestionScoreRecordModalProps = {
  navigation: StackNavigationProp<any>,
  useUser: User,
  isVisible: boolean,
  setIsVisible: (isVisible: boolean) => any,
};

export const QuestionScoreRecordModal: FC<QuestionScoreRecordModalProps> = ({navigation, useUser, isVisible, setIsVisible}) => {

  const changeStatusModal = getChangeStatusModalFromNavigation(navigation);
  const [submitQuestionScoreRecords, setSubmitQuestionScoreRecords] = useState([] as SubmitQuestionScoreRecord[]);

  const requestSubtmiQuestionScoreRecords = async () => {
    const result = await makeRequestWithStatus<SubmitQuestionScoreRecord[]>(() => getSubmitQuestionScoreRecords(useUser.id), changeStatusModal, false, false, true);
    if (!result) {return; }
    const data = result.data.data;
    const reverse = data.reverse();
    setSubmitQuestionScoreRecords(reverse);
  };

  useEffect(() => {
    requestSubtmiQuestionScoreRecords();
  }, []);

  const getContent = (contextObj: ContextObj) => {
    const {theme, user, setOverlayColor, changeStatusModal} = contextObj;
    const {language} = user;

    const getHeader = () => {
  
      return (
        <RowView style={{height: hp(6), marginTop: hp(1), elevation: COMMON_ELEVATION, ...COMMON_SHADOW}}>

          <Text style={{fontSize: hp(2), color: theme.text}}>
            {T.QUESTION_RECORD[language]}
          </Text>
  
        </RowView>
      );
    };

    return (
      <NormalModal isVisible={isVisible}>
        <PlainTouchable style={{height: hp(100), width: wp(100)}} activeOpacity={1.0}
          onPress={() => setIsVisible(false)}>
          <ContainerView style={{justifyContent: "flex-end", backgroundColor: TRANSPARENT,
            paddingHorizontal: wp(6), height: hp(100), paddingBottom: hp(3) }}>
            <View style={{borderRadius: COMMON_BORDER_RADIUS, backgroundColor: theme.onPrimary, paddingHorizontal: wp(5), 
              paddingBottom: hp(1)}}>

              {getHeader()}

              <View style={{maxHeight: hp(35), minHeight: hp(15)}}>
                <ScrollView contentContainerStyle={{paddingHorizontal: wp(1), paddingBottom: hp(2)}}>
                  <QuestionScoreRecordDataList navigation={navigation} submitQuestionScoreRecords={submitQuestionScoreRecords}
                    useUser={useUser} setIsVisible={setIsVisible} />
                </ScrollView>
              </View>

            </View>

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
