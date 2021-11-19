import React, {FC, useState} from "react";
import { Text, View } from "react-native";
import { Title } from "../../component/text";
import { ContainerView } from "../../component/view";
import { ContextObj, PageProps } from "../../type/common";
import { ContextConsumer } from "../../utils/context";

export const Setting: FC<PageProps> = ({navigation}) => {
  
  const getContent = (contextObj: ContextObj) => {
    const {theme} = contextObj;
    return (
      <ContainerView>
        <Title>Setting</Title>
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
