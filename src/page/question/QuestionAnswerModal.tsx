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
import { changeStateObj, checkIfRequestError, checkIsIOS, checkIsSwipe, makeRequestWithStatus } from "../../utils/utilFunction";
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

export type QuestionAnswerModalProps = {
  questions: Question[],
  questionChoiceRecords: QuestionChoiceRecord[],
  changeQuestionChoiceRecords: (questionChoiceRecords: QuestionChoiceRecord[]) => any,
  slideIndex: number,
  setSlideIndex: (index: number) => any,
  isFocusQuestion: boolean,
  setIsFocusQuestion: (isFocusQuestion: boolean) => any,
  onAllSubmit: (isCancel: boolean) => any,
  isDisabled: boolean,
};

export const QuestionAnswerModal: FC<QuestionAnswerModalProps> = ({questions, questionChoiceRecords, changeQuestionChoiceRecords, slideIndex, setSlideIndex,
  isFocusQuestion, setIsFocusQuestion, onAllSubmit}) => {

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

  const onSubmitQuestion = async (changeStatusModal: any) => {
    const useQuestionChoiceRecords = await uploadBase64InQuestionChoiceRecords(questionChoiceRecords);
    const result = await makeRequestWithStatus<SubmitQuestionRecord>(() => submitQuestion(useQuestionChoiceRecords), changeStatusModal, false);
    if (!result) {return; }
    onAllSubmit(false);
  };

  const onSelectOption = (index: number, choiceId: string) => {
    const newQuestionChoiceRecords: QuestionChoiceRecord[] = JSON.parse(JSON.stringify(questionChoiceRecords));
    newQuestionChoiceRecords[index].choiceId = choiceId;
    newQuestionChoiceRecords[index].isChoosingContent = false;
    newQuestionChoiceRecords[index].isChoosingImage = false;
    inputRef.current.blur();
    changeQuestionChoiceRecords(newQuestionChoiceRecords);
  };

  const onTypeOpenOption = (index: number, choiceId: string, content: string) => {
    const newQuestionChoiceRecords: QuestionChoiceRecord[] = JSON.parse(JSON.stringify(questionChoiceRecords));
    newQuestionChoiceRecords[index].choiceId = choiceId;
    newQuestionChoiceRecords[index].content = content;
    newQuestionChoiceRecords[index].isChoosingContent = true;
    newQuestionChoiceRecords[index].isChoosingImage = false;
    changeQuestionChoiceRecords(newQuestionChoiceRecords);
  };

  const onDrawOption = (index: number, choiceId: string, base64: string) => {
    const newQuestionChoiceRecords: QuestionChoiceRecord[] = JSON.parse(JSON.stringify(questionChoiceRecords));
    newQuestionChoiceRecords[index].choiceId = choiceId;
    newQuestionChoiceRecords[index].base64 = base64;
    newQuestionChoiceRecords[index].isChoosingImage = true;
    newQuestionChoiceRecords[index].isChoosingContent = false;
    changeQuestionChoiceRecords(newQuestionChoiceRecords);
  };

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
        onSubmitQuestion(changeStatusModal);
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

    const changeIsDrawing = (isDrawing: boolean) => {
      const overlayColor = (isDrawing) ? COMMON_OVERLAY : TRANSPARENT;
      setOverlayColor(overlayColor);
      setIsDrawing(isDrawing);
    };

    const startDrawing = (index: number, choiceId: string) => {
      const newQuestionChoiceRecords: QuestionChoiceRecord[] = JSON.parse(JSON.stringify(questionChoiceRecords));
      newQuestionChoiceRecords[index].choiceId = choiceId;
      newQuestionChoiceRecords[index].isChoosingImage = true;
      newQuestionChoiceRecords[index].isChoosingContent = false;
      changeQuestionChoiceRecords(newQuestionChoiceRecords);
      setIsFocusQuestion(false);
      changeIsDrawing(true);
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

    const getAnswerView = () => {
      return (
        <CenterView style={{flex: 1, marginTop: hp(20)}}>

          {questionChoices.map((questionChoice, index: number) => {
            const {choice, isFree, isPaint, id} = questionChoice;
            const isLast = questionChoices.length - 1 === index;
            const marginBottom = (isLast) ? 0 : hp(3);
            const isSelected = (id === currentChoiceId);
            const useColor = (isSelected) ? theme.lightSecondary : theme.onPrimary;

            if (isPaint) {
              return (
                <PlainTouchable activeOpacity={1.0} style={{}}
                  onPress={() => startDrawing(slideIndex, id)}>
                  <CenterView style={{height: hp(60), width: wp(80), borderRadius: COMMON_BORDER_RADIUS,
                    borderWidth: 2, marginBottom: wp(10),
                    backgroundColor: useImageContainerBackground, borderColor: theme.onSecondary}}>
                    <Image source={{uri: currentBase64}} style={{height: hp(60), width: wp(80), borderRadius: COMMON_BORDER_RADIUS, resizeMode: "stretch"}} />
                    <CenterView style={{position: "absolute", height: hp(60) - 2, width: wp(80) - 2, backgroundColor: useImageBackground,
                      borderRadius: COMMON_BORDER_RADIUS}}>
                      <Image source={imageLoader.pen} style={{width: wp(15), height: wp(15), opacity: 0.5}} />
                    </CenterView>
                  </CenterView>
                </PlainTouchable>
              );
            }

            if (isFree) {

              return (
                <PlainTouchable activeOpacity={1.0} onPress={() => onTypeOpenOption(slideIndex, id, currentContent)}>
                  <CenterView style={{padding: wp(3), marginBottom, backgroundColor: theme.questionBlockBackground,
                    borderWidth: 2, borderColor: useColor, borderRadius: BORDER_RADIUS * 4,
                    width: wp(60)}}>
                    <TextInput spellCheck={false} ref={inputRef} style={{color: useColor, fontSize: hp(2), textAlign: "center",
                      }} placeholderTextColor={"#FFFFFF50"} placeholder={T.OPEN_OPTION_PLACEHOLDER[language]}
                      selectionColor={"#000000"} value={currentContent} onPressIn={() => onTypeOpenOption(slideIndex, id, currentContent)}
                      onChange={(e: any) => onTypeOpenOption(slideIndex, id, e.nativeEvent.text)}
                      underlineColorAndroid={TRANSPARENT} multiline={true} />
                  </CenterView>
                </PlainTouchable>
              );
            }

            return (
              <PlainTouchable activeOpacity={0.6} onPress={() => onSelectOption(slideIndex, id)}>
                <CenterView style={{padding: wp(3), marginBottom, backgroundColor: theme.questionBlockBackground,
                  borderWidth: 2, borderColor: useColor, borderRadius: BORDER_RADIUS,
                  width: wp(60)}}>
                  <Text style={{color: useColor, fontSize: hp(2)}}>{choice[language]}</Text>
                </CenterView>
              </PlainTouchable>
            );

          })}

        </CenterView>
      );
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

                {getAnswerView()}

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

        <Canvas onDrawOption={(base64: string) => onDrawOption(slideIndex, currentChoiceId as any, base64)}
          isDrawing={isDrawing} changeIsDrawing={changeIsDrawing}
          setIsFocusQuestion={setIsFocusQuestion} base64={currentBase64} />
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
