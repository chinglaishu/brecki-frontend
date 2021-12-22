import React, {FC, useState} from "react";
import { Text, View, LayoutAnimation, NativeModules, Image } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { ButtonText, SlideText, SlideTitle, SubTitle, Title } from "../component/text";
import { ButtonTouchable, PlainTouchable, RoundTouchable, SimpleTouchable } from "../component/touchable";
import { CenterView, ContainerView, PlainRowView, RowView, SlideTitleContainer } from "../component/view";
import { SCREEN, STATUS_TYPE } from "../constant/constant";
import { getRequestToAnswerQuestions } from "../request/question";
import { ContextObj, Language, MultiLanguage, PageProps } from "../type/common";
import { ContextConsumer } from "../utils/context";
import imageLoader from "../utils/imageLoader";
import { TRANSPARENT } from "../utils/size";
import { T } from "../utils/translate";
import { getNumListByNum } from "../utils/utilFunction";

const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

type BoxRowProps = {
  maxBox: number,
  currentBox: number,
  fillColor: string,
  borderColor: string,
  onClickEvent: (index: number) => any,
  extraStyle?: any,
  useBoxSize?: number,
  useMarginRight?: number,
  useHeightRatio?: number,
}

export const BoxRow: FC<BoxRowProps> = ({maxBox, currentBox, fillColor, borderColor, extraStyle, onClickEvent,
  useBoxSize, useMarginRight, useHeightRatio}) => {

  let numList = getNumListByNum(maxBox - 1);

  const getContent = (contextObj: ContextObj) => {
    const {theme, user} = contextObj;
    const {language} = user;

    const boxSize = useBoxSize || wp(5);
    const marginRight = useMarginRight || 4;
    const heightRatio = useHeightRatio || 1.0;

    const getBox = (isFill: boolean, index: number) => {
      const backgroundColor = (isFill) ? fillColor : TRANSPARENT;
      const applyMarginRight = (index === numList.length) ? 0 : marginRight;
      return (
        <PlainTouchable activeOpacity={0.6} onPress={() => onClickEvent(index)}>
          <View style={{width: boxSize, height: boxSize * heightRatio, borderWidth: 2, borderColor: borderColor, backgroundColor, marginRight: applyMarginRight}} />
        </PlainTouchable>
      );
    }

    return (
      <RowView style={{justifyContent: "flex-start", ...extraStyle}}>
        {numList.map((num, index: number) => {
          const useIndex = index + 1;
          const isFill = (useIndex <= currentBox);
          return getBox(isFill, useIndex);
        })}
      </RowView>
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
