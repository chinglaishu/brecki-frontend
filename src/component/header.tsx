import React, { Component, FC, useEffect } from "react";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { DrawerHeaderProps } from "@react-navigation/drawer/lib/typescript/src/types";
import { getCurrentRouteName, getDisplayNameByRouteName, getParamFromNavigation } from "../utils/utilFunction";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { ContextConsumer } from "../utils/context";
import { ContextObj } from "../type/common";
import { PlainTouchable, SimpleTouchable } from "./touchable";
import imageLoader from "../utils/imageLoader";
import { ThreePartRow } from "./view";
import { Image, Text, View, KeyboardAvoidingView } from "react-native";
import Constants from 'expo-constants';
import { Title, ButtonText } from "./text";
import { TRANSPARENT } from "../utils/size";
import { SCREEN } from "../constant/constant";
import * as Notifications from 'expo-notifications';
import Toast from 'react-native-toast-message';

type HeaderProps = {
  headerProps: DrawerHeaderProps,
  extraStyle?: any,
};

export const Header: FC<HeaderProps> = ({headerProps, extraStyle}) => {
  const {navigation} = headerProps;
  const currentRoute = getCurrentRouteName(navigation);

  useEffect(() => {
    Notifications.addNotificationReceivedListener(handleNotification);
    Notifications.addNotificationResponseReceivedListener(handleNotificationResponse);
  }, []);

  const handleNotification = (notification: any) => {
    console.log(notification);
    const chatRoute = getParamFromNavigation(navigation, "chatRoute") || SCREEN.CHAT_LIST;
    const matchId = getParamFromNavigation(navigation, "matchId");
    if (currentRoute === SCREEN.CHAT_LIST && chatRoute === SCREEN.CHAT_LIST) {return; }
    if (currentRoute === SCREEN.CHAT_LIST && chatRoute === SCREEN.CHAT && matchId === notification?.matchId) {return; }
    Toast.show({type: "message", props: { title: "new message", name: "user1", content: "test" }});
  };

  const handleNotificationResponse = (response: any) => {
    console.log(response);
  };

  const onClick = () => {
    navigation.openDrawer();
  };

  const getContent = (contextObj: ContextObj) => {
    const {theme, overlayColor, useNavigation, setUseNavigation} = contextObj;

    const clickBackFunction = () => {
      if (useNavigation?.backScreen === SCREEN.CHAT_LIST) {
        navigation.setParams({chatRoute: SCREEN.CHAT_LIST});
      }
      useNavigation?.navigation.navigate(useNavigation.backScreen);
      setUseNavigation({navigation: useNavigation?.navigation as any, backScreen: null as any});
    };

    let title = getDisplayNameByRouteName(currentRoute, contextObj.user.language);
    if (useNavigation) {
      const useRoute = getCurrentRouteName(useNavigation.navigation);
      if (useRoute) {
        title = getDisplayNameByRouteName(useRoute, contextObj.user.language);
      }
    }

    const image = (!!useNavigation?.backScreen) ? imageLoader.back : imageLoader.menu_white;
    const useFunction = (!!useNavigation?.backScreen) ? clickBackFunction : onClick;

    return (
      <>
        <ThreePartRow height={hp(10)} extraStyle={{paddingTop: Constants.statusBarHeight, backgroundColor: theme.primary, opacity: 1, ...extraStyle}}
          Left={
            <PlainTouchable onPress={() => useFunction()}>
              <Image source={image} style={{width: hp(3.5), height: hp(3.5), tintColor: theme.onPrimary}} />
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