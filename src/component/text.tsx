import React, { Component, FC } from "react";
import { Text, View } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import styled from "styled-components/native";
import { FONT_BUTTON, FONT_NORMAL } from "../constant/constant";

type LineTextLineProps = {
  text: string,
  extraStyle?: any,
}

export const Title = styled.Text.attrs(props => {
  return {
  }
})`
  color: ${props => props.theme.secondary};
  font-size: ${wp(3.5)};
  font-family: ${FONT_NORMAL};
`;

export const SubTitle = styled.Text.attrs(props => {
  return {
  }
})`
  color: ${props => props.theme.subTitle};
  font-size: ${wp(2.5)};
  font-family: ${FONT_NORMAL};
`;

export const Reminder = styled.Text.attrs(props => {
  return {
    fontWeight: (props.theme.language === "zh") ? 400 : 600,
  }
})`
  color: ${props => props.theme.reminder};
  font-size: ${wp(2.5)};
  font-family: ${FONT_NORMAL};
  font-weight: ${props => props.fontWeight};
`;

export const DivideLine = styled.Text.attrs(props => {
  return {
  }
})`
  height: 60%;
  width: 100%;
  border-bottom-color: ${props => props.theme.subTitle};
  border-bottom-width: 1;
  opacity: 0.4;
`;

export const ButtonText = styled.Text.attrs(props => {
  return {
  }
})`
  color: ${props => props.theme.onPrimary};
  font-size: ${wp(3.5)};
  font-family: ${FONT_BUTTON};
  font-weight: 400;
`;

export const InputText = styled.Text.attrs(props => {
  return {
  }
})`
  color: ${props => props.theme.text};
  font-size: ${wp(3)};
  font-family: ${FONT_NORMAL};
  font-weight: 400;
`;

export const InputError = styled.Text.attrs(props => {
  return {
  }
})`
  color: ${props => props.theme.warning};
  font-size: ${wp(2.5)};
  font-family: ${FONT_NORMAL};
  font-weight: 400;
`;

const Line = () => {
  return (
    <View style={{flex: 1, alignItems: "center", paddingHorizontal: wp(4)}}>
      <DivideLine />
    </View>
  );
};

export const LineTextLine = ({text, extraStyle}: LineTextLineProps) => {
  return (
    <View style={{flexDirection: "row", paddingHorizontal: wp(8), width: "100%", height: hp(1.5), ...extraStyle}}>
      <Line />
      <View>
        <SubTitle>{text}</SubTitle>
      </View>
      <Line />
    </View>
  );
};
