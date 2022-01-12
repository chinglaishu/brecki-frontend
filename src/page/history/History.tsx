import React, {FC, useEffect, useState} from "react";
import { Text, View, LayoutAnimation, NativeModules, Image } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { RoundButton } from "../../component/button";
import { ButtonText, SlideText, SlideTitle, SubTitle, Title } from "../../component/text";
import { ButtonTouchable, SimpleTouchable } from "../../component/touchable";
import { CenterView, ContainerView, PlainRowView, RowView, SlideTitleContainer } from "../../component/view";
import { SCREEN, STATUS_TYPE } from "../../constant/constant";
import { getRequestToAnswerQuestions } from "../../request/question";
import { getUserSelf } from "../../request/user";
import { ContextObj, Language, MultiLanguage, PageProps, StackPageProps, User } from "../../type/common";
import { ContextConsumer } from "../../utils/context";
import imageLoader from "../../utils/imageLoader";
import { COMMON_OVERLAY, EXTRA_BORDER_RADIUS, EXTRA_ELEVATION, TRANSPARENT } from "../../utils/size";
import { T } from "../../utils/translate";
import { checkIfRequestError, getChangeStatusModalFromNavigation, getParamFromNavigation, makeRequestWithStatus } from "../../utils/utilFunction";
import { PersonalityScore } from "../question/type";
import { PersonalityScoreBlock } from "./personlityScoreBlock";
import { QuestionRecordModal } from "./QuestionRecordModal";
import { QuestionScoreRecordModal } from "./QuestionScoreRecordModal";

export const HistoryPage: FC<StackPageProps> = ({navigation}) => {

  const changeStatusModal = getChangeStatusModalFromNavigation(navigation);
  const getUser: User = getParamFromNavigation(navigation, "useUser");

  const [isQuestionRecordMoalVisible, setIsQuestionRecordModalVisible] = useState(false);
  const [isQuestionScoreRecordModalVisible, setIsQuestionScoreRecordModalVisible] = useState(false);

  const [useUser, setUseUser] = useState(null as User | null);

  const getUseUser = async () => {
    const result = await makeRequestWithStatus<User>(() => getUserSelf(), changeStatusModal, false, false, true);
    if (!result) {return; }
    const user = result.data.data;
    setUseUser(user);
  };

  useEffect(() => {
    if (!getUser) {
      getUseUser();
    }
  }, []);

  useEffect(() => {
    if (getUser) {
      setUseUser(getUser);
    } else {
      getUseUser();
    }
  }, [getUser]);

  const getContent = (contextObj: ContextObj) => {
    const {theme, user, setOverlayColor, changeStatusModal} = contextObj;
    const {language} = user;

    if (!useUser) {return; }

    return (
      <ContainerView style={{}}>
        <PersonalityScoreBlock personalityScore={useUser.personalityScore as PersonalityScore} navigation={navigation as any} />
        <RoundButton touchableExtraStyle={{marginTop: hp(6), marginBottom: hp(2)}}
          buttonText={T.TO_QUESTION_RECORD[language]} clickFunction={() => setIsQuestionRecordModalVisible(true)} />
        <RoundButton touchableExtraStyle={{marginBottom: hp(6), backgroundColor: theme.empty}}
          buttonText={T.TO_QUESTION_SCORE_RECORD[language]} clickFunction={() => setIsQuestionScoreRecordModalVisible(true)} />
      
        <QuestionRecordModal isVisible={isQuestionRecordMoalVisible} setIsVisible={setIsQuestionRecordModalVisible}
          useUser={useUser} navigation={navigation} />
        <QuestionScoreRecordModal isVisible={isQuestionScoreRecordModalVisible} setIsVisible={setIsQuestionScoreRecordModalVisible}
          useUser={useUser} navigation={navigation} />
      </ContainerView>
    );
  };

  return (
    <ContextConsumer>
      {(contextObj: ContextObj) => {
        return getContent(contextObj);
      }}
    </ContextConsumer>
  );
};
