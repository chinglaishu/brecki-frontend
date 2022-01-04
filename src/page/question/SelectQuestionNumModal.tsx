import { DrawerNavigationProp } from "@react-navigation/drawer";
import React, {FC, useState} from "react";
import { Text, View, LayoutAnimation, NativeModules } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { NormalModal } from "../../component/modal";
import { ButtonText, SlideText, SlideTitle, SubTitle, Title } from "../../component/text";
import { ButtonTouchable, PlainTouchable, RoundTouchable, SimpleTouchable } from "../../component/touchable";
import { CenterView, CommonBlock, ContainerView, PlainRowView, RowView, SlideTitleContainer } from "../../component/view";
import { SCREEN } from "../../constant/constant";
import { ContextObj, Language, MultiLanguage, PageProps } from "../../type/common";
import { ContextConsumer } from "../../utils/context";
import { BORDER_RADIUS, EXTRA_BORDER_RADIUS, EXTRA_ELEVATION } from "../../utils/size";
import { T } from "../../utils/translate";
import { getQuestionNumDescriptionByNum } from "./helper";
import { QuestionNum } from "./type";

type SelectQuestionNumProps = {
  questionNums: QuestionNum[],
  useNum: number,
  setUseNum: (num: number) => any,
  setIsAnswering: (isAnswering: boolean) => any,
  navigation: DrawerNavigationProp<any>,
};

export const SelectQuestionNumModal: FC<SelectQuestionNumProps> = ({questionNums, useNum, setUseNum, setIsAnswering,
  navigation}) => {

  const getContent = (contextObj: ContextObj) => {

    const {theme, user} = contextObj;
    const {language} = user;
    const activeColor = theme.onSecondary;
    const passiveColor = theme.text;
    const description = getQuestionNumDescriptionByNum(questionNums, useNum, language);
    return (
      <CommonBlock style={{width: wp(80), marginBottom: hp(2.5)}}>
        <Title style={{color: theme.subText, marginBottom: hp(2.5), fontSize: hp(2.5)}}>{T.CHOOSE_QUESTION_NUM[language]}</Title>
        <SubTitle style={{color: theme.subText, paddingHorizontal: wp(2.5), textAlign: "center", opacity: 0.6, fontSize: hp(2)}}>{description}</SubTitle>
        <PlainRowView style={{marginTop: hp(5)}}>
          {questionNums.map((questionNum, index: number) => {
            const num = questionNum.questionNum;
            const color = (num === useNum) ? activeColor : theme.subText;
            const backgroundColor = (num === useNum) ? theme.secondary : theme.empty;
            const marginLeft = (index !== 0) ? wp(5) : 0;
            return (
              <PlainTouchable style={{marginLeft, elevation: 0, backgroundColor, borderRadius: BORDER_RADIUS * 10,
                width: hp(5), height: hp(5), justifyContent: "center", alignItems: "center"}}
                activeOpacity={0.6}
                onPress={() => {
                  setUseNum(num);
                }}>
                <Text style={{color, fontSize: hp(2)}}>{num}</Text>
              </PlainTouchable>
            );
          })}
        </PlainRowView>

        <RoundTouchable style={{padding: wp(2), width: wp(50), height: hp(6), marginTop: hp(5),
          backgroundColor: theme.secondary}}
          activeOpacity={0.6} onPress={() => {
            setIsAnswering(true);
          }}>
          <Title style={{color: theme.onSecondary, fontSize: hp(2)}}>{T.START[language]}</Title>
        </RoundTouchable>

        <RoundTouchable style={{padding: wp(2), width: wp(50), height: hp(6), marginTop: hp(2.5),
          backgroundColor: theme.subText}}
          activeOpacity={0.6} onPress={() => {
            navigation.navigate(SCREEN.HOME);
          }}>
          <Title style={{color: theme.onSecondary, fontSize: hp(2)}}>{T.BACK_TO_HOME[language]}</Title>
        </RoundTouchable>
      </CommonBlock>
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
