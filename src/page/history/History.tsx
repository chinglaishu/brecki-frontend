import React, {FC, isValidElement, useEffect, useState} from "react";
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
import { checkIfRequestError, checkIsIOS, getChangeStatusModalFromNavigation, getParamFromNavigation, getStoreData, makeRequestWithStatus, setStoreData } from "../../utils/utilFunction";
import { PersonalityScore } from "../question/type";
import { PersonalityScoreBlock } from "./personlityScoreBlock";
import { QuestionRecordModal } from "./QuestionRecordModal";
import { QuestionScoreRecordModal } from "./QuestionScoreRecordModal";

const defaultPersonalityScore: PersonalityScore = {
  Openness: 0,
  Conscientiousness: 0,
  Extraversion: 0,
  Agreeableness: 0,
  Neuroticism: 0,
};

export const HistoryPage: FC<StackPageProps> = ({navigation}) => {

  const changeStatusModal = getChangeStatusModalFromNavigation(navigation);
  const getUser: User = getParamFromNavigation(navigation, "useUser");

  const [isQuestionRecordMoalVisible, setIsQuestionRecordModalVisible] = useState(false);
  const [isQuestionScoreRecordModalVisible, setIsQuestionScoreRecordModalVisible] = useState(false);

  const [useUser, setUseUser] = useState(null as User | null);

  const getUseUser = async () => {

    const getUseUserFromStorage = await getStoreData("useUser");
    if (getUseUserFromStorage) {
      const user = JSON.parse(getUseUserFromStorage);
      setUseUser(user);
      return;
    }

    const result = await makeRequestWithStatus<User>(() => getUserSelf(), changeStatusModal, false, false, true);
    if (!result) {return; }
    const user = result.data.data;
    setUseUser(user);
  };

  const storeNewUseUser = async (user: User) => {
    await setStoreData("useUser", JSON.stringify(user));
    setUseUser(user);
  }

  useEffect(() => {
    if (!getUser && !useUser) {
      getUseUser();
    } else {
      storeNewUseUser(getUser);
    }
  }, []);

  useEffect(() => {
    if (getUser) {
      storeNewUseUser(getUser);
    } else {
      getUseUser();
    }
  }, [getUser]);

  const getContent = (contextObj: ContextObj) => {
    const {theme, user, setOverlayColor, changeStatusModal} = contextObj;
    const {language} = user;


    console.log(isQuestionRecordMoalVisible);
    console.log(isQuestionScoreRecordModalVisible);
    if (!useUser) {return; }

    const isOthers = useUser.id !== user.id;
    const marginBottom = (checkIsIOS()) ? hp(6) : hp(2);
    return (
      <ContainerView style={{}}>
        <PersonalityScoreBlock personalityScore={useUser.personalityScore as PersonalityScore || defaultPersonalityScore} navigation={navigation as any} />
        <RoundButton touchableExtraStyle={{marginTop: hp(6), marginBottom}}
          buttonText={T.TO_QUESTION_RECORD[language]} clickFunction={() => {
            console.log("test");
            setIsQuestionRecordModalVisible(true);
            setIsQuestionScoreRecordModalVisible(true);
            console.log("test2");
          }} />
        {/* {false && <RoundButton touchableExtraStyle={{marginBottom: hp(6), backgroundColor: theme.empty}}
          buttonText={T.TO_QUESTION_SCORE_RECORD[language]} clickFunction={() => setIsQuestionScoreRecordModalVisible(true)} />}
       */}
        <QuestionRecordModal isVisible={isQuestionRecordMoalVisible} setIsVisible={setIsQuestionRecordModalVisible}
          useUser={useUser} navigation={navigation} />
        {/* {!isOthers && <QuestionScoreRecordModal isVisible={isQuestionScoreRecordModalVisible} setIsVisible={setIsQuestionScoreRecordModalVisible}
          useUser={useUser} navigation={navigation} />} */}
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
