import React, {FC, useEffect, useState} from "react";
import { Text, View, LayoutAnimation, NativeModules, Image } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { ButtonText, SlideText, SlideTitle, SubTitle, Title } from "../../component/text";
import { ButtonTouchable, SimpleTouchable } from "../../component/touchable";
import { CenterView, ContainerView, PlainRowView, RowView, SlideTitleContainer } from "../../component/view";
import { SCREEN, STATUS_TYPE } from "../../constant/constant";
import { getOneQuestionScoreRecord, getPersonalities, getQuestionNums, getRequestToAnswerQuestions, getSubmitQuestionRecordById, getUserLastSubmitQuestionRecord, submitQuestionScoreRecord } from "../../request/question";
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
  const submitQuestionRecordId = getParamFromNavigation(navigation, "submitQuestionRecordId");
  const isReadOnly = getParamFromNavigation(navigation, "isReadOnly");

  const [useNum, setUseNum] = useState(defaultNum);
  const [isAnswering, setIsAnswering] = useState(false);
  const [questionNums, setQuestionNums] = useState([] as QuestionNum[]);
  
  const [questions, setQuestions] = useState([] as Question[]);
  const [questionChoiceRecords, setQuestionChoiceRecords] = useState([] as QuestionChoiceRecord[]);
  
  const [isShow, setIsShow] = useState(true);

  useEffect(() => {
    if (!submitQuestionRecordId) {
      setQuestionChoiceRecords(getDefaultQuestionChoiceRecord(questions, []));
    }
  }, [questions]);

  useEffect(() => {
    if (submitQuestionRecordId) {
      setIsAnswering(false);
      requestQuestonNums();
    } else {
      getSubmitQuestionRecord();
    }
  }, [submitQuestionRecordId]);

  const changeUseNum = (num: number) => {
    LayoutAnimation.spring();
    setUseNum(num);
  };

  useEffect(() => {
    if (!submitQuestionRecordId) {
      requestQuestonNums();
    } else {
      getSubmitQuestionRecord();
    }

    navigation.addListener("focus", () => {
      console.log("focus");
      setIsShow(true);

      if (!submitQuestionRecordId) {
        requestQuestonNums();
      } else {
        getSubmitQuestionRecord();
      }
    });

  }, []);

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
    setQuestions(useQuestions);
    setQuestionChoiceRecords(useQuestionChoiceRecords);
    setIsAnswering(true);
    return true;
  };

  const requestQuestonNums = async () => {
    const result = await makeRequestWithStatus<P<QuestionNum>>(() => getQuestionNums(), changeStatusModal, false);
    if (!result) {return null; }
    setQuestionNums(result.data.data.data);
    setUseNum(result.data.data.data[0].questionNum);
  };

  const getContent = (contextObj: ContextObj) => {
    const {theme, user, setOverlayColor, changeStatusModal, useNavigation, setUseNavigation} = contextObj;
    const {language} = user;

    const clickBackFunction = () => {
      if (useNavigation?.navigation.canGoBack()) {
        useNavigation.navigation.goBack();
      }
    };

    const onAllSubmit = (isCancel: boolean) => {
      if (isReadOnly) {
        setIsShow(false);
        navigation.navigate(SCREEN.HISTORY);
        return;
      }

      setIsAnswering(false);
      setQuestions([]);
      setQuestionChoiceRecords([] as QuestionChoiceRecord[]);
      if (isCancel) {
        clickBackFunction();
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

    if (!isShow) {return null; }

    return (
      <ContainerView style={{}}>
        {!isAnswering && <Image source={imageLoader.question_couple} style={{position: "absolute", width: wp(100), height: hp(90), opacity: 0.5, resizeMode: "stretch"}} blurRadius={2} />}
        {!isAnswering && !submitQuestionRecordId && <SelectQuestionNumModal questionNums={questionNums} useNum={useNum} setUseNum={changeUseNum}
          setIsAnswering={changeIsAnswering} navigation={navigation} />}
        {isAnswering &&
          <QuestionSlide questions={questions} onAllSubmit={onAllSubmit} questionChoiceRecords={questionChoiceRecords}
            changeQuestionChoiceRecords={setQuestionChoiceRecords} isAnswer={true} isDisabled={!!submitQuestionRecordId} />
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
