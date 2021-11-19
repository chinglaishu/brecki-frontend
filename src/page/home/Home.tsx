import React, {FC, useState} from "react";
import { Text, View } from "react-native";
import { Title } from "../../component/text";
import { ContainerView } from "../../component/view";
import { ContextObj, PageProps } from "../../type/common";
import { ContextConsumer } from "../../utils/context";

export const Home: FC<PageProps> = ({navigation}) => {
  
  const getContent = (contextObj: ContextObj) => {
    return (
      <ContainerView>
        <Title>Home</Title>
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
