import React, { Component, FC } from "react";
import { Image, Text, View } from "react-native";
import styled from "styled-components/native";
import { FONT_NORMAL } from "../constant/constant";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { BORDER_RADIUS } from "../utils/size";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { ContextConsumer } from "../utils/context";
import { ContextObj } from "../type/common";
import { PlainTouchable, SimpleTouchable } from "./touchable";
import imageLoader from "../utils/imageLoader";
import { DrawerHeaderProps } from "@react-navigation/drawer/lib/typescript/src/types";

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

export const RowView = styled.View.attrs(props => {
  return {
  };
})`
  width: 100%;
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
  elevation: 4;

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
};

export const ThreePartRow = (props: ThreePartRowProps) => {
  const {height, Left, Body, Right} = props;

  return (
    <RowView style={{height, flexDirection: "row"}}>
      <View style={{marginHorizontal: 10, height: "100%", justifyContent: "center"}}>
        {Left}
      </View>
      <View style={{flex: 1, flexDirection: "row", alignItems: "center"}}>
        {Body}
      </View>
      <View style={{marginHorizontal: 10, flexDirection: "row"}}>
        {Right}
      </View>
    </RowView>
  );
};

type HeaderProps = {
  headerProps: DrawerHeaderProps,
};

export const Header: FC<HeaderProps> = ({headerProps}) => {
  const getContent = (contextObj: ContextObj) => {
    return (
      <ThreePartRow height={50}
        Left={
          <PlainTouchable onPress={() => headerProps.navigation.openDrawer()}>
            <Image source={imageLoader.icon} style={{width: 30, height: 30}} />
          </PlainTouchable>
        }
        Body={<Text>{1}</Text>}
        Right={
          <PlainTouchable style={{}}>
            <Image source={imageLoader.icon} style={{width: 30, height: 30}} />
          </PlainTouchable>
        }
      />
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
