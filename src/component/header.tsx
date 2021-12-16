import React, { Component, FC } from "react";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { DrawerHeaderProps } from "@react-navigation/drawer/lib/typescript/src/types";
import { getCurrentRouteName, getDisplayNameByRouteName } from "../utils/utilFunction";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { ContextConsumer } from "../utils/context";
import { ContextObj } from "../type/common";
import { PlainTouchable, SimpleTouchable } from "./touchable";
import imageLoader from "../utils/imageLoader";
import { ThreePartRow } from "./view";
import { Image, Text, View } from "react-native";
import Constants from 'expo-constants';
import { Title, ButtonText } from "./text";
import { TRANSPARENT } from "../utils/size";

type HeaderProps = {
  headerProps: DrawerHeaderProps,
};

export const Header: FC<HeaderProps> = ({headerProps}) => {
  const currentRoute = getCurrentRouteName(headerProps.navigation);
  const getContent = (contextObj: ContextObj) => {
    const {theme, overlayColor} = contextObj;
    const title = getDisplayNameByRouteName(currentRoute, contextObj.user.language);
    return (
      <>
        <ThreePartRow height={hp(10)} extraStyle={{paddingTop: Constants.statusBarHeight, backgroundColor: theme.primary, opacity: 1}}
          Left={
            <PlainTouchable onPress={() => headerProps.navigation.openDrawer()}>
              <Image source={imageLoader.menu_white} style={{width: hp(3.5), height: hp(3.5)}} />
            </PlainTouchable>
          }
          Body={<Title style={{fontSize: hp(2.4), color: theme.onPrimary}}>{title}</Title>}
          Right={
            <PlainTouchable style={{}}>
              <Image source={imageLoader.setting} style={{width: hp(3.5), height: hp(3.5)}} />
            </PlainTouchable>
          }
        />
        {overlayColor !== TRANSPARENT && <View style={{position: "absolute", backgroundColor: overlayColor, height: hp(10), width: wp(100)}} />}
      </>
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