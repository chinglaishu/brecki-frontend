import React, { Component, FC } from "react";
import { Image, Text, View } from "react-native";
import styled from "styled-components/native";
import { FONT_NORMAL } from "../constant/constant";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { BORDER_RADIUS, COMMON_BORDER_RADIUS, COMMON_ELEVATION, EXTRA_BORDER_RADIUS, EXTRA_ELEVATION } from "../utils/size";

export const ContainerView = styled.View.attrs(props => {
  return {
    size: "1em",
    // backgroundColor: (props as any).backgroundColor || props.theme.background,
  }
})`
  flex: 1;
  width: 100%;
  background-color: ${props => props.theme.background};
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const CenterView = styled.View.attrs(props => {
  return {
  };
})`
  align-items: center;
  justify-content: center;
`;

export const RowView = styled.View.attrs(props => {
  return {
  };
})`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const PlainRowView = styled.View.attrs(props => {
  return {
  };
})`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const InputAndErrorContainer = styled.View.attrs(props => {
  return {
  };
})`
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

export const ModalView = styled.View.attrs(props => {
  return {
  };
})`
  background-color: ${props => props.theme.buttonBackground};
  justify-content: center;
  align-items: center;

  border-radius: ${BORDER_RADIUS * 2};
/* 
  shadow-opacity: 0.4;
  shadow-radius: 2px;
  shadow-color: #000000;
  shadow-offset: 0px 0px;
  elevation: 6; */
`;

export const ModalScrollView = styled.ScrollView.attrs(props => {
  return {
  };
})`
  background-color: ${props => props.theme.buttonBackground};
  border-width: 2;
  border-color: ${props => props.theme.border};
  border-radius: ${BORDER_RADIUS * 2};
/* 
  shadow-opacity: 0.4;
  shadow-radius: 2px;
  shadow-color: #000000;
  shadow-offset: 0px 0px;
  elevation: 6; */
`;

export const InputContainer = styled.View.attrs(props => {
  return {
  };
})`
  flex-direction: row;
  color: ${props => props.theme.secondary};
  font-size: ${wp(5)}px;
  font-family: ${FONT_NORMAL};
  border-top-right-radius: ${BORDER_RADIUS};
  border-bottom-left-radius: ${BORDER_RADIUS};
  /* padding-left: ${wp(2)}px; */
  background-color: #FFFFFF;
  border-color: #ACACAC20;
  border-width: 1;
  shadow-opacity: 0.4;
  shadow-radius: 2px;
  shadow-color: #000000;
  shadow-offset: 0px 0px;
  elevation: ${COMMON_ELEVATION};

  height: ${hp(5)};
  width: ${wp(60)};
  justify-content: center;
  align-items: center;
`;

type ThreePartRowProps = {
  height: number,
  Left: Component | any,
  Body: Component | any,
  Right: Component | any,
  extraStyle?: any,
};

export const ThreePartRow = (props: ThreePartRowProps) => {
  const {height, Left, Body, Right, extraStyle} = props;

  return (
    <RowView style={{height, flexDirection: "row", paddingHorizontal: wp(5), ...extraStyle}}>
      <View style={{height: "100%", justifyContent: "center", marginRight: wp(5)}}>
        {Left}
      </View>
      <View style={{flex: 1, flexDirection: "row", alignItems: "center"}}>
        {Body}
      </View>
      <View style={{flexDirection: "row", marginLeft: wp(5)}}>
        {Right}
      </View>
    </RowView>
  );
};

export const RoundInputContainer = styled.View.attrs(props => {
  return {
  };
})`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-right: ${wp(3)}px;
  border-radius: ${BORDER_RADIUS * 4};
  border-color: ${props => props.theme.border};
  border-width: 2px;
`;

export const SlideTitleContainer = styled.View.attrs(props => {
  return {
    // width: (props as any).width,
    // size: "1em",
  }
})`
  background-color: ${props => props.theme.buttonBackground};

  border-top-right-radius: ${BORDER_RADIUS};
  border-bottom-left-radius: ${BORDER_RADIUS};
  border-color: ${props => props.theme.secondary};
  border-width: 2;
  /* border-bottom-color: ${props => props.theme.buttonBorder};
  border-bottom-width: 2; */

  shadow-opacity: 0.3;
  shadow-radius: 2px;
  shadow-color: #000000;
  shadow-offset: 2px 2px;
  elevation: ${COMMON_ELEVATION};

  padding-left: ${wp(5)};
  padding-right: ${wp(5)};

  padding-top: ${hp(1)};
  padding-bottom: ${hp(1)};
  align-items: center;
  justify-content: center;
`;

export const CornerBorderContainer = styled.View.attrs(props => {
  return {
    // width: (props as any).width,
    // size: "1em",
  }
})`
  background-color: ${props => props.theme.onSecondary};

  border-top-right-radius: ${BORDER_RADIUS};
  border-bottom-left-radius: ${BORDER_RADIUS};
  /* border-color: ${props => props.theme.secondary};
  border-width: 2; */

  shadow-opacity: 0.3;
  shadow-radius: 2px;
  shadow-color: #000000;
  shadow-offset: 2px 2px;
  elevation: ${COMMON_ELEVATION};

  padding-left: ${wp(2)};
  padding-right: ${wp(2)};

  padding-top: ${hp(1)};
  padding-bottom: ${hp(1)};
  align-items: center;
  justify-content: center;
`;

export const CommonBlock = styled.View.attrs(props => {
  return {
  };
})`
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme.buttonBackground};
  border-radius: ${EXTRA_BORDER_RADIUS};
  padding-left: ${wp(5)};
  padding-right: ${wp(5)};
  padding-top: ${hp(5)};
  padding-bottom: ${hp(5)};

  shadow-opacity: 0.3;
  shadow-radius: 2px;
  shadow-color: #000000;
  shadow-offset: 2px 2px;
  elevation: ${EXTRA_ELEVATION};
`;
