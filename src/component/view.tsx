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
import { getCurrentRouteName, getDisplayNameByRouteName } from "../utils/utilFunction";

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
    <RowView style={{height, flexDirection: "row", marginHorizontal: wp(5)}}>
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

type HeaderProps = {
  headerProps: DrawerHeaderProps,
};

export const Header: FC<HeaderProps> = ({headerProps}) => {
  const currentRoute = getCurrentRouteName(headerProps.navigation);
  const getContent = (contextObj: ContextObj) => {
    const title = getDisplayNameByRouteName(currentRoute, contextObj.user.language);
    return (
      <ThreePartRow height={hp(10)}
        Left={
          <PlainTouchable onPress={() => headerProps.navigation.openDrawer()}>
            <Image source={imageLoader.icon} style={{width: hp(6), height: hp(6)}} />
          </PlainTouchable>
        }
        Body={<Text>{title}</Text>}
        Right={
          <PlainTouchable style={{}}>
            <Image source={imageLoader.icon} style={{width: hp(6), height: hp(6)}} />
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
