import React, {FC, useState} from "react";
import { View } from "react-native";
import { ContextObj } from "../type/common";
import { ContextConsumer } from "./context";

export const Template: FC<any> = () => {
  
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
