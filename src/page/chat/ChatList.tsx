import React, {FC, useState} from "react";
import { View } from "react-native";
import { ContextObj, PageProps } from "../../type/common";
import { ContextConsumer } from "../../utils/context";

export const ChatList: FC<PageProps> = () => {
  
  const getContent = (contextObj: ContextObj) => {
    return (
      <View>

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
