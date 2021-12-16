import React, {FC, useEffect, useState} from "react";
import { Text, View, LayoutAnimation, NativeModules, Image } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { ButtonText, SlideText, SlideTitle, SubTitle, Title } from "../../component/text";
import { ButtonTouchable, SimpleTouchable } from "../../component/touchable";
import { CenterView, ContainerView, PlainRowView, RowView, SlideTitleContainer } from "../../component/view";
import { SCREEN, STATUS_TYPE } from "../../constant/constant";
import { getRequestToAnswerQuestions } from "../../request/question";
import { ContextObj, Language, MultiLanguage, PageProps } from "../../type/common";
import { ContextConsumer } from "../../utils/context";
import imageLoader from "../../utils/imageLoader";
import { COMMON_OVERLAY, EXTRA_BORDER_RADIUS, EXTRA_ELEVATION, TRANSPARENT } from "../../utils/size";
import { T } from "../../utils/translate";
import { checkIfRequestError, makeRequestWithStatus } from "../../utils/utilFunction";
import { Canvas } from "./Canvas";
import { QuestionSlide } from "./QuestionSlide";
import { SelectQuestionNumModal } from "./SelectQuestionNumModal";
import { Question } from "./type";

// should be db?
const numList = [5, 8, 12, 15];

export const QuestionPage: FC<PageProps> = ({navigation}) => {

  const [useNum, setUseNum] = useState(numList[0]);
  const [isAnswering, setIsAnswering] = useState(false);
  const [questions, setQuestions] = useState([] as Question[]);

  const changeUseNum = (num: number) => {
    setUseNum(num);
  };

  const onAllSubmit = (isCancel: boolean) => {
    setUseNum(numList[0]);
    setIsAnswering(false);
    setQuestions([]);
    if (isCancel) {
      navigation.navigate(SCREEN.HOME);
    } else {
      navigation.navigate(SCREEN.QUESTION_END); 
    }
  };

  const getContent = (contextObj: ContextObj) => {
    const {theme, user, setOverlayColor, changeStatusModal} = contextObj;
    const {language} = user;

    const getQuestions = async () => {
      const result = await makeRequestWithStatus<Question[]>(() => getRequestToAnswerQuestions(1), changeStatusModal, false);
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
        {!isAnswering && <SelectQuestionNumModal numList={numList} useNum={useNum} setUseNum={changeUseNum}
          setIsAnswering={changeIsAnswering} navigation={navigation} />}
        {isAnswering &&
          <QuestionSlide questions={questions} navigation={navigation} onAllSubmit={onAllSubmit} />
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
