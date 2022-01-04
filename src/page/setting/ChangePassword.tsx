import React, {FC, useState} from "react";
import { Image, Switch, Text, View } from "react-native";
import { Title } from "../../component/text";
import { ContainerView, ThreePartRow } from "../../component/view";
import { ContextObj, PageProps, StackPageProps } from "../../type/common";
import { ContextConsumer } from "../../utils/context";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { BORDER_RADIUS } from "../../utils/size";
import imageLoader from "../../utils/imageLoader";
import { T } from "../../utils/translate";
import { SCREEN } from "../../constant/constant";
import { PlainTouchable } from "../../component/touchable";

export const ChangePassword: FC<StackPageProps> = ({navigation}) => {

  const getContent = (contextObj: ContextObj) => {
    const {theme, user} = contextObj;
    const {language} = user;


    return (
      <ContainerView>
      </ContainerView>
    );
  };

  return (
    <ContextConsumer>
      {(contextObj: ContextObj) => {
        return getContent(contextObj);
      }}
    </ContextConsumer>
  );
};
