import React, {FC, useEffect, useState} from "react";
import { Text, View, LayoutAnimation, NativeModules, Image } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { ButtonText, SlideText, SlideTitle, SubTitle, Title } from "../../component/text";
import { ButtonTouchable, SimpleTouchable } from "../../component/touchable";
import { CenterView, ContainerView, PlainRowView, RowView, SlideTitleContainer } from "../../component/view";
import { SCREEN, STATUS_TYPE } from "../../constant/constant";
import { getOneQuestionScoreRecord, getPersonalities, getQuestionNums, getRequestToAnswerQuestions, getSubmitQuestionRecordById, getSubmitQuestionScoreRecordById } from "../../request/question";
import { ContextObj, Language, MultiLanguage, PageProps, StackPageProps } from "../../type/common";
import { ContextConsumer } from "../../utils/context";
import imageLoader from "../../utils/imageLoader";
import { COMMON_OVERLAY, EXTRA_BORDER_RADIUS, EXTRA_ELEVATION, TRANSPARENT } from "../../utils/size";
import { T } from "../../utils/translate";
import { checkIfRequestError, getChangeStatusModalFromNavigation, getParamFromNavigation, makeRequestWithStatus } from "../../utils/utilFunction";
import { getDefaultPersonalityScore, getDefaultQuestionChoiceRecord } from "./helper";
import { QuestionSlide } from "./QuestionSlide";
import { SelectQuestionNumModal } from "./SelectQuestionNumModal";
import { P, Personality, PersonalityScore, Question, QuestionChoiceRecord, QuestionNum, QuestionScoreRecord, SubmitQuestionRecord, SubmitQuestionScoreRecord } from "./type";

const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

export const QuestionRecord: FC<StackPageProps> = ({navigation}) => {

  const changeStatusModal = getChangeStatusModalFromNavigation(navigation);

  const isManual = getParamFromNavigation(navigation, "isManual");
  const changeUseUsers = getParamFromNavigation(navigation, "changeUseUsers");
  const submitQuestionRecordId = getParamFromNavigation(navigation, "submitQuestionRecordId");
  const submitQuestionScoreRecordId = getParamFromNavigation(navigation, "submitQuestionScoreRecordId");

  const [questionChoiceRecords, setQuestionChoiceRecords] = useState([] as QuestionChoiceRecord[]);
  const [questions, setQuestions] = useState([] as Question[]);

  const [personalities, setPersonalities] = useState([] as Personality[]);
  const [submitQuestionRecord, setSubmitQuestionRecord] = useState(null as any);

  const [questionScoreRecords, setQuestionScoreRecords] = useState([] as QuestionScoreRecord[]);

  // need?
  useEffect(() => {
    makeAllRequest();
  }, []);

  useEffect(() => {
    makeAllRequest();
  }, [submitQuestionRecordId, submitQuestionScoreRecordId]);

  const makeAllRequest = async () => {
    changeStatusModal({statusType: STATUS_TYPE.LOADING});
    const getSubmitQuestionRecordResult = await getSubmitQuestionRecord();
    if (!getSubmitQuestionRecordResult) {
      changeStatusModal({statusType: STATUS_TYPE.LOADING, isVisible: false});
      return;
    }
    const getUseScoreResult = await getPersonalitiesAndScore(getSubmitQuestionRecordResult);
    const isError = !getSubmitQuestionRecordResult || !getUseScoreResult;
    if (isError) {
      changeStatusModal({statusType: STATUS_TYPE.ERROR});
    } else {
      changeStatusModal({statusType: STATUS_TYPE.LOADING, isVisible: false});
    }
  };

  const getQuestionScoreRecords = async (useQuestions: Question[], usePersonalities: Personality[]) => {
    if (submitQuestionScoreRecordId) {
      const result = await getSubmitQuestionScoreRecordById(submitQuestionScoreRecordId);
      const questionScoreRecords = result.data.data.questionScoreRecords;
      return questionScoreRecords;
    } else {
      const personalityScore = getDefaultPersonalityScore(usePersonalities);
      const questionScoreRecords: QuestionScoreRecord[] = useQuestions.map((useQuestion) => {
        return {
          questionId: useQuestion.id,
          personalityScore,
        };
      });
      return questionScoreRecords;
    }
  };

  const getPersonalitiesAndScore = async (useQuestions: Question[]) => {
    const personalityResult = await getPersonalities();
    if (!personalityResult) {return null; }
    const personalities = personalityResult.data.data;
    const questionScoreRecords = await getQuestionScoreRecords(useQuestions, personalities);
    setQuestionScoreRecords(questionScoreRecords);
    setPersonalities(personalities);
    return true;
  };

  const getSubmitQuestionRecord = async () => {
    if (!submitQuestionRecordId) {return null; }
    const result = await getSubmitQuestionRecordById(submitQuestionRecordId);
    if (checkIfRequestError(result)) {return null; }
    const questionChoiceRecords = result.data.data.questionChoiceRecords;
    const useQuestions = questionChoiceRecords.map((questionChoiceRecord) => questionChoiceRecord.question) as Question[];
    const useQuestionChoiceRecords = questionChoiceRecords.map((questionChoiceRecord) => {
      const {questionId, choiceId, userId, content, imageUrl} = questionChoiceRecord;
      return {questionId, choiceId, userId, content, imageUrl, isChoosingImage: !!imageUrl, isChoosingContent: !!content};
    });
    setSubmitQuestionRecord(result.data.data);
    setQuestions(useQuestions);
    setQuestionChoiceRecords(useQuestionChoiceRecords);
    return useQuestions;
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
        navigation.navigate(SCREEN.SUBMIT_QUESTION_END, {userId: (submitQuestionRecord as SubmitQuestionRecord)?.userId, isManual, changeUseUsers}); 
      }
    };

    return (
      <ContainerView style={{}}>
        <Image source={imageLoader.question_couple} style={{position: "absolute", width: wp(100), height: hp(90), opacity: 0.5, resizeMode: "stretch"}} blurRadius={2} />
        <QuestionSlide questions={questions} onAllSubmit={onAllSubmit} questionChoiceRecords={questionChoiceRecords}
          personalities={personalities} questionScoreRecords={questionScoreRecords} changeQuestionScoreRecords={setQuestionScoreRecords}
          submitQuestionRecord={submitQuestionRecord} isAnswer={false} isDisabled={!!submitQuestionScoreRecordId} />
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
