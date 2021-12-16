import React, { Component, FC } from "react";
import { Text, View } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import styled from "styled-components/native";
import { FONT_BUTTON, FONT_NORMAL } from "../constant/constant";

type LineTextLineProps = {
  text: string,
  extraStyle?: any,
  textStyle?: any,
  lineStyle?: any,
}

export const DrawerItemText = styled.Text.attrs(props => {
  return {
  };
})`
  color: ${props => props.theme.subTitle};
  font-size: ${hp(1.75)};
  font-family: ${FONT_NORMAL};
  font-weight: 600;
`;

export const Title = styled.Text.attrs(props => {
  return {
  }
})`
  color: ${props => props.theme.secondary};
  font-size: ${wp(3.5)};
  font-family: ${FONT_NORMAL};
  font-weight: 600;
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

export const SlideTitle = styled.Text.attrs(props => {
  return {
  }
})`
  color: ${props => props.theme.secondary};
  font-size: ${hp(3)};
  font-family: ${FONT_BUTTON};
  font-weight: 400;
`;

export const SlideText = styled.Text.attrs(props => {
  return {
  }
})`
  color: ${props => props.theme.onSecondary};
  font-size: ${hp(2)};
  font-family: ${FONT_NORMAL};
  font-weight: 400;
`;

type LineProps = {
  lineStyle?: any,
};

const Line = ({lineStyle}: LineProps) => {
  return (
    <View style={{flex: 1, alignItems: "center", paddingHorizontal: wp(4)}}>
      <DivideLine style={{...lineStyle}} />
    </View>
  );
};

export const LineTextLine = ({text, extraStyle, textStyle, lineStyle}: LineTextLineProps) => {
  return (
    <View style={{flexDirection: "row", paddingHorizontal: wp(8), width: "100%", height: hp(1.5), ...extraStyle}}>
      <Line lineStyle={{...lineStyle}} />
      <View>
        <SubTitle style={{...textStyle}}>{text}</SubTitle>
      </View>
      <Line lineStyle={{...lineStyle}} />
    </View>
  );
};
