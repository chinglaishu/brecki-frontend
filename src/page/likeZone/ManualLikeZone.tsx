import React, {FC, useState} from "react";
import { Text, View, LayoutAnimation, NativeModules } from "react-native";
import { ButtonText, SlideText, SlideTitle, Title } from "../../component/text";
import { ContainerView, SlideTitleContainer } from "../../component/view";
import { ContextObj, Language, MultiLanguage, PageProps } from "../../type/common";
import { ContextConsumer } from "../../utils/context";
import { T } from "../../utils/translate";

const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

export const ManualLikeZone: FC<PageProps> = ({navigation}) => {

  const getContent = (contextObj: ContextObj) => {
    const {theme, user} = contextObj;
    const {language} = user;
    return (
      <ContainerView>
        <Text>Like Zone</Text>
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
