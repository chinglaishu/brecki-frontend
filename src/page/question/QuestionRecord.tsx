import React, {FC, useEffect, useState} from "react";
import { Text, View, LayoutAnimation, NativeModules, Image } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { ButtonText, SlideText, SlideTitle, SubTitle, Title } from "../../component/text";
import { ButtonTouchable, SimpleTouchable } from "../../component/touchable";
import { CenterView, ContainerView, PlainRowView, RowView, SlideTitleContainer } from "../../component/view";
import { SCREEN, STATUS_TYPE } from "../../constant/constant";
import { getOneQuestionScoreRecord, getPersonalities, getQuestionNums, getRequestToAnswerQuestions, getSubmitQuestionRecordById, getUserLastSubmitQuestionRecord } from "../../request/question";
import { ContextObj, Language, MultiLanguage, PageProps, StackPageProps } from "../../type/common";
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

export const QuestionRecord: FC<StackPageProps> = ({navigation}) => {

  const changeStatusModal = getChangeStatusModalFromNavigation(navigation);
  const submitQuestionRecordId = getParamFromNavigation(navigation, "submitQuestionRecordId");
  
  const [questionChoiceRecords, setQuestionChoiceRecords] = useState([] as QuestionChoiceRecord[]);
  const [questions, setQuestions] = useState([] as Question[]);

  const [personalityScore, setPersonalityScore] = useState({} as PersonalityScore);
  const [personalities, setPersonalities] = useState([] as Personality[]);
  const [submitQuestionRecord, setSubmitQuestionRecord] = useState(null as any);

  // need?
  useEffect(() => {
    getSubmitQuestionRecord();
  }, []);

  useEffect(() => {
    getSubmitQuestionRecord();
  }, [submitQuestionRecordId]);

  const changePersonalityScore = (key: string, value: number) => {
    const useObj: any = {};
    const useValue = personalityScore[key] === value ? 0 : value;
    useObj[key] = useValue;
    setPersonalityScore({...personalityScore, ...useObj});
  };

  const getUseScore = async (toUserId: string, submitQuestionRecordId: string) => {
    const result = await makeRequestWithStatus<QuestionScoreRecord>(() => getOneQuestionScoreRecord(toUserId, submitQuestionRecordId), changeStatusModal, false, true, false);
    const personalityResult = await makeRequestWithStatus<Personality[]>(() => getPersonalities(), changeStatusModal, false, true);
    if (!personalityResult) {return; }
    const personalities = personalityResult.data.data;
    const defaultScore = getDefaultPersonalityScore(personalities);
    const usePersonalityScore = {...defaultScore, ...result?.data?.data?.personalityScore};
    setPersonalityScore(usePersonalityScore);
    setPersonalities(personalities);
    return true;
  };

  const getSubmitQuestionRecord = async () => {
    const result = await makeRequestWithStatus<SubmitQuestionRecord>(() => getSubmitQuestionRecordById(submitQuestionRecordId), changeStatusModal, false, true, false);
    if (!result) {return; }
    await getUseScore(result.data.data.userId as string, result.data.data.id);
    const questionChoiceRecords = result.data.data.questionChoiceRecords;
    const useQuestions = questionChoiceRecords.map((questionChoiceRecord) => questionChoiceRecord.question) as Question[];
    const useQuestionChoiceRecords = questionChoiceRecords.map((questionChoiceRecord) => {
      const {questionId, choiceId, userId, content, imageUrl} = questionChoiceRecord;
      return {questionId, choiceId, userId, content, imageUrl};
    });
    setSubmitQuestionRecord(result.data.data);
    setQuestions(useQuestions);
    setQuestionChoiceRecords(useQuestionChoiceRecords);
  };

  const getContent = (contextObj: ContextObj) => {
    const {theme, user, setOverlayColor, changeStatusModal, useNavigation, setUseNavigation} = contextObj;
    const {language} = user;

    const clickBackFunction = () => {
      useNavigation?.navigation.navigate(useNavigation.backScreen);
      setUseNavigation(null);
    };

    const onAllSubmit = (isCancel: boolean) => {
      setQuestions([]);
      setQuestionChoiceRecords([] as QuestionChoiceRecord[]);
      if (isCancel) {
        clickBackFunction();
      } else {
        navigation.navigate(SCREEN.SUBMIT_QUESTION_END); 
      }
    };

    return (
      <ContainerView style={{}}>
        <Image source={imageLoader.question_couple} style={{position: "absolute", width: wp(100), height: hp(90), opacity: 0.5, resizeMode: "stretch"}} blurRadius={2} />
        <QuestionSlide questions={questions} onAllSubmit={onAllSubmit} questionChoiceRecords={questionChoiceRecords}
          personalities={personalities} personalityScore={personalityScore} changePersonalityScore={changePersonalityScore}
          submitQuestionRecord={submitQuestionRecord} isAnswer={false} />
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
