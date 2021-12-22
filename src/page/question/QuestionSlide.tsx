import React, {FC, useEffect, useRef, useState} from "react";
import { Text, View, LayoutAnimation, NativeModules, Image } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { ButtonText, SlideText, SlideTitle, SubTitle, Title } from "../../component/text";
import { ButtonTouchable, PlainTouchable, SimpleTouchable } from "../../component/touchable";
import { CenterView, ContainerView, PlainRowView, RowView, SlideTitleContainer } from "../../component/view";
import { FONT_NORMAL, STATUS_TYPE } from "../../constant/constant";
import { getRequestToAnswerQuestions } from "../../request/question";
import { ContextObj, Language, MultiLanguage, PageProps } from "../../type/common";
import { ContextConsumer } from "../../utils/context";
import imageLoader from "../../utils/imageLoader";
import { BORDER_RADIUS, COMMON_BORDER_RADIUS, COMMON_ELEVATION, COMMON_OVERLAY, EXTRA_BORDER_RADIUS, EXTRA_ELEVATION, TRANSPARENT } from "../../utils/size";
import { T } from "../../utils/translate";
import { checkIfRequestError, makeRequestWithStatus } from "../../utils/utilFunction";
import { SelectQuestionNumModal } from "./SelectQuestionNumModal";
import { Personality, PersonalityScore, Question, QuestionChoiceRecord, SubmitQuestionRecord } from "./type";
import Carousel from 'react-native-snap-carousel';
import Modal from "react-native-modal";
import { NormalModal } from "../../component/modal";
import { QuestionAnswerModal } from "./QuestionAnswerModal";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { QuestionScoreModal } from "./QuestionScoreModal";

export type QuestionSlideProps = {
  questions: Question[],
  onAllSubmit: (isCancel: boolean) => any,
  questionChoiceRecords: QuestionChoiceRecord[],
  changeQuestionChoiceRecords?: (questionChoiceRecords: QuestionChoiceRecord[]) => any,
  isAnswer: boolean,
  personalities?: Personality[],
  personalityScore?: PersonalityScore,
  changePersonalityScore?: (key: string, value: number) => any,
  submitQuestionRecord?: SubmitQuestionRecord,
}

export const QuestionSlide: FC<QuestionSlideProps> = ({questions, questionChoiceRecords, changeQuestionChoiceRecords, isAnswer, onAllSubmit,
  personalities, personalityScore, changePersonalityScore, submitQuestionRecord}) => {
  const ref: any = useRef(null);
  const [slideIndex, setSlideIndex] = useState(0);
  const [isFocusQuestion, setIsFocusQuestion] = useState(true);

  useEffect(() => {
    setIsFocusQuestion(true);
  }, []);

  useEffect(() => {
    setSlideIndex(0);
    setIsFocusQuestion(true);
  }, [questions]);

  const changeSlideIndex = (slideIndex: number) => {
    // LayoutAnimation.spring();
    setSlideIndex(slideIndex);
    ref?.current.snapToItem(slideIndex);
  };

  const getContent = (contextObj: ContextObj) => {

    const {user, theme, setOverlayColor} = contextObj;
    const {language} = user;

    const onPressOutside = () => {
      setIsFocusQuestion(!isFocusQuestion);
    };

    const getSlide = ({item, index}: {item: Question, index: number}) => {
      const {imageUrl, questionChoices} = item;
      const blurRadius = (isFocusQuestion) ? 1 : 0;
      return (
        <PlainTouchable
          style={{
            height: hp(90),
            width: wp(100),
          }}
          activeOpacity={1.0}
          onPress={() => onPressOutside()}
        >
          <View style={{height: hp(90), width: wp(100), padding: wp(5)}}>
            <View style={{height: hp(85), width: wp(90), elevation: EXTRA_ELEVATION, backgroundColor: theme.buttonBackground, borderRadius: EXTRA_BORDER_RADIUS, opacity: 0.99}}>
              <Image source={{uri: imageUrl}} style={{height: hp(85), width: wp(90), resizeMode: "stretch", borderRadius: EXTRA_BORDER_RADIUS}} blurRadius={0} />
            </View>
          </View>
        </PlainTouchable>
      );
    };

    return (
      <View>
        <Carousel
          layout="default"
          ref={ref}
          data={questions}
          sliderWidth={wp(100)}
          itemWidth={wp(100)}
          renderItem={getSlide}
          onSnapToItem={(index) => {
            changeSlideIndex(index)
          }}
          shouldOptimizeUpdates={true}
          inactiveSlideOpacity={0.6}
          inactiveSlideScale={1.0}
          enableMomentum={true}
          scrollEnabled={false}
          scrollEndDragDebounceValue={200}
        />
        {isAnswer && changeQuestionChoiceRecords && <QuestionAnswerModal questions={questions} slideIndex={slideIndex} setSlideIndex={changeSlideIndex}
          isFocusQuestion={isFocusQuestion} setIsFocusQuestion={setIsFocusQuestion} questionChoiceRecords={questionChoiceRecords}
          changeQuestionChoiceRecords={changeQuestionChoiceRecords} onAllSubmit={onAllSubmit} />}
        {!isAnswer && personalities && personalityScore && changePersonalityScore && submitQuestionRecord &&
          <QuestionScoreModal questions={questions} slideIndex={slideIndex} setSlideIndex={changeSlideIndex}
            isFocusQuestion={isFocusQuestion} setIsFocusQuestion={setIsFocusQuestion}
            onAllSubmit={onAllSubmit} questionChoiceRecords={questionChoiceRecords}
            personalities={personalities} personalityScore={personalityScore} changePersonalityScore={changePersonalityScore}
            submitQuestionRecord={submitQuestionRecord} /> }
      </View>
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
