import React, {FC, useEffect, useRef, useState} from "react";
import { Text, View, LayoutAnimation, NativeModules, Image, TextInput, KeyboardAvoidingView, Keyboard } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { ButtonText, SlideText, SlideTitle, SubTitle, Title } from "../../component/text";
import { ButtonTouchable, PlainTouchable, SimpleTouchable } from "../../component/touchable";
import { CenterView, ContainerView, PlainRowView, RowView, SlideTitleContainer } from "../../component/view";
import { FONT_NORMAL, PERSONALITY_SCORE_MAX, SCREEN, STATUS_TYPE } from "../../constant/constant";
import { getRequestToAnswerQuestions, submitQuestion, submitQuestionScoreRecord } from "../../request/question";
import { ContextObj, Language, MultiLanguage, PageProps } from "../../type/common";
import { ContextConsumer } from "../../utils/context";
import imageLoader from "../../utils/imageLoader";
import { BORDER_RADIUS, COMMON_BORDER_RADIUS, COMMON_ELEVATION, COMMON_OVERLAY, EXTRA_BORDER_RADIUS, EXTRA_ELEVATION, TRANSPARENT } from "../../utils/size";
import { T } from "../../utils/translate";
import { changeStateObj, checkIfRequestError, checkIsSwipe, makeRequestWithStatus } from "../../utils/utilFunction";
import { SelectQuestionNumModal } from "./SelectQuestionNumModal";
import { Personality, PersonalityScore, Question, QuestionChoiceRecord, QuestionScoreRecord, SubmitQuestionRecord } from "./type";
import Carousel from 'react-native-snap-carousel';
import Modal from "react-native-modal";
import { NormalModal } from "../../component/modal";
import { NormalInput } from "../../component/input";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { checkErrorWhenGoToNextQuestion, getCurrentAnswer, getDefaultQuestionChoiceRecord, uploadBase64InQuestionChoiceRecords } from "./helper";
import { Canvas } from "./Canvas";
import GestureRecognizer from 'react-native-swipe-gestures';
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { BoxRow } from "../../component/BoxRow";
import ImageView from "react-native-image-viewing";

const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

export type QuestionScoreModal = {
  questions: Question[],
  questionChoiceRecords: QuestionChoiceRecord[],
  slideIndex: number,
  setSlideIndex: (index: number) => any,
  isFocusQuestion: boolean,
  setIsFocusQuestion: (isFocusQuestion: boolean) => any,
  onAllSubmit: (isCancel: boolean) => any,
  personalities: Personality[],
  personalityScore: PersonalityScore,
  changePersonalityScore: (key: string, value: number) => any,
  submitQuestionRecord: SubmitQuestionRecord,
};

export const QuestionScoreModal: FC<QuestionScoreModal> = ({questions, questionChoiceRecords, slideIndex, setSlideIndex,
  isFocusQuestion, setIsFocusQuestion, onAllSubmit, personalities, personalityScore, changePersonalityScore,
  submitQuestionRecord}) => {

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
    Keyboard.addListener('keyboardDidHide', _keyboardDidHide);

    // cleanup function
    return () => {
      Keyboard.removeListener('keyboardDidShow', _keyboardDidShow);
      Keyboard.removeListener('keyboardDidHide', _keyboardDidHide);
    };
  }, []);

  const [keyboardStatus, setKeyboardStatus] = useState(false as any);
  const _keyboardDidShow = () => setKeyboardStatus(true);
  const _keyboardDidHide = () => {
    inputRef.current.blur();
    setKeyboardStatus(false);
  };

  const inputRef: any = useRef(null);

  const [typingString, setTypingString] = useState("_");
  const [isDrawing, setIsDrawing] = useState(false);
  const [isImageVisible, setIsImageVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => changeTypingString(), 500);
  }, [typingString]);

  // useEffect(() => {
  //   setQuestionChoiceRecords(getDefaultQuestionChoiceRecord(questions, useQuestionChoiceRecords));
  // }, [questions, useQuestionChoiceRecords]);

  const changeTypingString = () => {
    const nextString = typingString === "_" ? "" : "_";
    setTypingString(nextString);
  };

  const onPressOutside = () => {
    if (keyboardStatus) {
      Keyboard.dismiss();
    } else {
      setIsFocusQuestion(!isFocusQuestion);
    }
  };

  const onSubmitScore = async (changeStatusModal: any) => {
    const result = await makeRequestWithStatus<QuestionScoreRecord>(() => submitQuestionScoreRecord(personalityScore, submitQuestionRecord?.userId as string, submitQuestionRecord.id), changeStatusModal, false);
    if (!result) {return; }
    onAllSubmit(false);
  };

  const onSubmitQuestion = async (changeStatusModal: any) => {
    const useQuestionChoiceRecords = await uploadBase64InQuestionChoiceRecords(questionChoiceRecords);
    const result = await makeRequestWithStatus<SubmitQuestionRecord>(() => submitQuestion(useQuestionChoiceRecords), changeStatusModal, false);
    if (!result) {return; }
    onAllSubmit(false);
  };

  // const changeQuestionChoiceRecords = (questionChoiceRecords: QuestionChoiceRecord[]) => {
  //   setQuestionChoiceRecords(questionChoiceRecords);
  // }

  const getContent = (contextObj: ContextObj) => {

    const {user, theme, changeStatusModal, setOverlayColor} = contextObj;
    const {language} = user;

    const isLastQuestion = slideIndex === questionChoiceRecords.length - 1;
    const nextButtonText = isLastQuestion ? T.SUBMIT[language] : T.NEXT[language];

    const goNext = () => {
      if (checkErrorWhenGoToNextQuestion(questionChoiceRecords[slideIndex])) {
        // changeStatusModal({statusType: STATUS_TYPE.INFO, title: T.CAN_NOT_EMPTY[language]});
        return;
      }
      if (isLastQuestion) {
        onSubmitScore(changeStatusModal)
      } else {
        setSlideIndex(slideIndex + 1);
      }
    }

    const swipe = (direction: string, state: any) => {
      if (!checkIsSwipe(state)) {return; }
      if (direction !== "SWIPE_RIGHT") {
        goNext();
        return;
      }
      const nextIndex = slideIndex - 1;
      if (nextIndex < 0) {return; }
      setSlideIndex(nextIndex);
    };

    const question: Question = questions[slideIndex];
    if (!question) {return null; }
    const {title, questionChoices} = question;
    const currentChoiceId = questionChoiceRecords[slideIndex]?.choiceId;
    const currentContent = questionChoiceRecords[slideIndex]?.content;
    const currentBase64 = questionChoiceRecords[slideIndex]?.base64;
    const isChoosingImage = questionChoiceRecords[slideIndex]?.isChoosingImage;
    const currentAnswer = getCurrentAnswer(questionChoiceRecords, slideIndex, questionChoices, language) || "";
    const useImageBackground = (currentBase64) ? theme.questionBlockBackground : TRANSPARENT;
    const useImageContainerBackground = (currentBase64) ? TRANSPARENT : theme.questionBlockBackground;
    const isDisabled = checkErrorWhenGoToNextQuestion(questionChoiceRecords[slideIndex]);
    const buttonColor = (isDisabled) ? theme.subText : theme.lightSecondary;

    const getScoreView = () => {
      if (!personalities) {return null; }
      if (!personalityScore) {return null; }
      if (!changePersonalityScore) {return null; }
      return (
        <ContainerView style={{backgroundColor: TRANSPARENT}}>
          <PlainTouchable activeOpacity={1.0}>
            <CenterView style={{alignItems: "flex-start", padding: wp(8), backgroundColor: theme.questionBlockBackground, borderRadius: EXTRA_BORDER_RADIUS, 
              borderWidth: 2, borderColor: theme.border, paddingVertical: hp(4), marginTop: hp(10)}}>
              {
                personalities.map((personality, index: number) => {
                  const isFirst = index === 0;
                  const marginTop = (isFirst) ? 0 : hp(2);
                  const currentBox = personalityScore[personality.key];
                  return (
                    <View style={{marginTop}}>
                      <Title style={{marginBottom: hp(0.25)}}>{personality.name[language]}</Title>
                      <BoxRow maxBox={PERSONALITY_SCORE_MAX} currentBox={currentBox} fillColor={theme.lightSecondary}
                        borderColor={theme.border} onClickEvent={(index: number) => changePersonalityScore(personality.key, index)} />
                    </View>
                  );
                })
              }
            </CenterView>
          </PlainTouchable>
        </ContainerView>
      )
    };

    const getAnswerText = () => {
      const useText = (isChoosingImage) ? "" : `${currentAnswer}${typingString}`
      return (
        <RowView style={{justifyContent: "flex-start"}}>
          <Text style={{color: theme.onPrimary, fontSize: hp(2), marginTop: hp(1),
            fontFamily: FONT_NORMAL}}>
            {`A: ${useText}`}
          </Text>
          {isChoosingImage &&
            <PlainTouchable activeOpacity={0.6} onPress={() => setIsImageVisible(true)}>
              <Image source={{uri: currentAnswer}} style={{width: hp(8), height: hp(8), marginTop: hp(1)}} />
            </PlainTouchable>
          }
          {isChoosingImage && <ImageView
            images={[{uri: currentAnswer}]}
            imageIndex={0}
            visible={isImageVisible}
            onRequestClose={() => setIsImageVisible(false)}
          />}
        </RowView>
      );
    };

    // const button
    return (
      <>
        <NormalModal isVisible={isFocusQuestion}>
          <GestureRecognizer
            style={{}}
            onSwipe={(direction: string, state: any) => swipe(direction, state)}>
              
            <PlainTouchable style={{height: hp(100), width: wp(100)}} activeOpacity={1.0}
              onPress={() => onPressOutside()}>
              <ContainerView style={{backgroundColor: TRANSPARENT}}>

                {getScoreView()}

                <View style={{margin: wp(5), marginBottom: hp(4),
                  padding: wp(2),
                  paddingVertical: hp(0.5),
                  width: wp(90),
                  height: hp(15),
                  marginHorizontal: wp(0),
                  borderWidth: 2, borderColor: theme.onPrimary,
                  borderBottomLeftRadius: COMMON_BORDER_RADIUS,
                  borderTopRightRadius: COMMON_BORDER_RADIUS,
                  backgroundColor: theme.questionBlockBackground}}>
                  <Text style={{color: theme.onPrimary, fontSize: hp(2),
                    fontFamily: FONT_NORMAL}}>{`Q: ${title[language]}`}</Text>
                  {getAnswerText()}
                  <RowView style={{position: "absolute", right: wp(2), bottom: wp(2), flex: 1, alignItems: "flex-end", justifyContent: "flex-end"}}>
                    <ButtonTouchable style={{backgroundColor: TRANSPARENT, borderColor: theme.warning, elevation: 0,
                      marginRight: wp(2)}}
                      activeOpacity={0.6} onPress={() => onAllSubmit(true)}>
                      <ButtonText style={{color: theme.warning}}>
                        {T.CANCEL[language]}                      
                      </ButtonText>  
                    </ButtonTouchable>   
                    
                    <ButtonTouchable style={{backgroundColor: TRANSPARENT, borderColor: buttonColor, elevation: 0}}
                      activeOpacity={(isDisabled) ? 1.0 : 0.6} onPress={() => goNext()}>
                      <ButtonText style={{color: buttonColor}}>
                        {nextButtonText}                      
                      </ButtonText>  
                    </ButtonTouchable>                    
                  </RowView>

                </View>
              </ContainerView>
            </PlainTouchable>
          </GestureRecognizer>
        </NormalModal>
      </>
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
