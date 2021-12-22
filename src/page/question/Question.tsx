import React, {FC, useEffect, useState} from "react";
import { Text, View, LayoutAnimation, NativeModules, Image } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { ButtonText, SlideText, SlideTitle, SubTitle, Title } from "../../component/text";
import { ButtonTouchable, SimpleTouchable } from "../../component/touchable";
import { CenterView, ContainerView, PlainRowView, RowView, SlideTitleContainer } from "../../component/view";
import { SCREEN, STATUS_TYPE } from "../../constant/constant";
import { getOneQuestionScoreRecord, getPersonalities, getQuestionNums, getRequestToAnswerQuestions, getSubmitQuestionRecordById, getUserLastSubmitQuestionRecord } from "../../request/question";
import { ContextObj, Language, MultiLanguage, PageProps } from "../../type/common";
import { ContextConsumer } from "../../utils/context";
import imageLoader from "../../utils/imageLoader";
import { COMMON_OVERLAY, EXTRA_BORDER_RADIUS, EXTRA_ELEVATION, TRANSPARENT } from "../../utils/size";
import { T } from "../../utils/translate";
import { checkIfRequestError, getChangeStatusModalFromNavigation, getParamFromNavigation, makeRequestWithStatus } from "../../utils/utilFunction";
import { getDefaultPersonalityScore, getDefaultQuestionChoiceRecord } from "./helper";
import { QuestionSlide } from "./QuestionSlide";
import { SelectQuestionNumModal } from "./SelectQuestionNumModal";
import { P, Personality, PersonalityScore, Question, QuestionChoiceRecord, QuestionNum, QuestionScoreRecord, SubmitQuestionRecord } from "./type";

const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

const defaultNum = 0;

export const QuestionPage: FC<PageProps> = ({navigation}) => {

  const changeStatusModal = getChangeStatusModalFromNavigation(navigation);

  const [useNum, setUseNum] = useState(defaultNum);
  const [isAnswering, setIsAnswering] = useState(false);
  const [questionNums, setQuestionNums] = useState([] as QuestionNum[]);
  
  const [questions, setQuestions] = useState([] as Question[]);
  const [questionChoiceRecords, setQuestionChoiceRecords] = useState([] as QuestionChoiceRecord[]);
  
  useEffect(() => {
    setQuestionChoiceRecords(getDefaultQuestionChoiceRecord(questions, []));
  }, [questions]);

  const changeUseNum = (num: number) => {
    LayoutAnimation.spring();
    setUseNum(num);
  };

  useEffect(() => {
    requestQuestonNums();
  }, []);

  const requestQuestonNums = async () => {
    const result = await makeRequestWithStatus<P<QuestionNum>>(() => getQuestionNums(), changeStatusModal, false);
    if (!result) {return null; }
    setQuestionNums(result.data.data.data);
    setUseNum(result.data.data.data[0].questionNum);
  };

  const getContent = (contextObj: ContextObj) => {
    const {theme, user, setOverlayColor, changeStatusModal, useNavigation, setUseNavigation} = contextObj;
    const {language} = user;

    const onAllSubmit = (isCancel: boolean) => {
      setIsAnswering(false);
      setQuestions([]);
      setQuestionChoiceRecords([] as QuestionChoiceRecord[]);
      if (isCancel) {
        navigation.navigate(SCREEN.HOME);
      } else {
        navigation.navigate(SCREEN.QUESTION_END); 
      }
    };

    const getQuestions = async () => {
      const result = await makeRequestWithStatus<Question[]>(() => getRequestToAnswerQuestions(useNum), changeStatusModal, false);
      if (!result) {return; }
      const questions = result.data.data;
      setQuestions(questions);
    };

    const changeIsAnswering = (to: boolean) => {
      setIsAnswering(to);
      getQuestions();
    };

    return (
      <ContainerView style={{}}>
        {!isAnswering && <Image source={imageLoader.question_couple} style={{position: "absolute", width: wp(100), height: hp(90), opacity: 0.5, resizeMode: "stretch"}} blurRadius={2} />}
        {!isAnswering && <SelectQuestionNumModal questionNums={questionNums} useNum={useNum} setUseNum={changeUseNum}
          setIsAnswering={changeIsAnswering} navigation={navigation} />}
        {isAnswering &&
          <QuestionSlide questions={questions} onAllSubmit={onAllSubmit} questionChoiceRecords={questionChoiceRecords}
            isAnswer={true} />
        }
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
