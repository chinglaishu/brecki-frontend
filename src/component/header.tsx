import React, { Component, FC, useEffect } from "react";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { DrawerHeaderProps } from "@react-navigation/drawer/lib/typescript/src/types";
import { getCurrentRouteName, getDisplayNameByRouteName, getParamFromNavigation } from "../utils/utilFunction";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { ContextConsumer } from "../utils/context";
import { ContextObj, PersonalInfo, UseNavigation, User } from "../type/common";
import { PlainTouchable, SimpleTouchable } from "./touchable";
import imageLoader from "../utils/imageLoader";
import { CenterView, RowView, ThreePartRow } from "./view";
import { Image, Text, View, KeyboardAvoidingView, BackHandler } from "react-native";
import Constants from 'expo-constants';
import { Title, ButtonText } from "./text";
import { TRANSPARENT } from "../utils/size";
import { SCREEN } from "../constant/constant";
import * as Notifications from 'expo-notifications';
import Toast from 'react-native-toast-message';
import { MessageNotificationData } from "../page/chat/type";
import { Notification } from "expo-notifications";
import { getUseUser, getUseUserByMatchId, handleMessageNotification } from "../page/chat/helper";
import { Match } from "../page/likeZone/type";
import { T } from "../utils/translate";
import { StackNavigationProp } from "@react-navigation/stack";
import { PlainAvatar } from "./image";

type HeaderProps = {
  headerProps: DrawerHeaderProps,
  extraStyle?: any,
  matchs: Match[],
  refreshMatchs: () => any,
  useNavigation: UseNavigation | null,
  setUseNavigation: (useNavigation: UseNavigation) => any,
};

export const Header: FC<HeaderProps> = ({headerProps, extraStyle, matchs, refreshMatchs, useNavigation, setUseNavigation}) => {
  const {navigation} = headerProps;
  const currentRoute = getCurrentRouteName(navigation);

  useEffect(() => {
    Notifications.addNotificationReceivedListener((notification) => handleMessageNotification(navigation, notification, matchs, refreshMatchs));
    Notifications.addNotificationResponseReceivedListener(handleNotificationResponse);
  }, []);

  const clickBackFunction = () => {
    if (useNavigation?.backScreen === SCREEN.CHAT_LIST) {
      navigation.setParams({chatRoute: SCREEN.CHAT_LIST});
    }
    
    if (useNavigation?.backScreen === SCREEN.CHAT) {
      const matchId = getParamFromNavigation(useNavigation?.navigation as any, "matchId");
      useNavigation?.navigation.navigate(useNavigation.backScreen, {matchId, drawerNavigation: navigation});
      setUseNavigation({navigation: useNavigation?.navigation as any, backScreen: SCREEN.CHAT_LIST});
      return;
    }
    useNavigation?.navigation.navigate(useNavigation.backScreen, {drawerNavigation: navigation});
    setUseNavigation({navigation: useNavigation?.navigation as any, backScreen: null as any});
  };

  BackHandler.addEventListener('hardwareBackPress', function () {
    if (useNavigation?.backScreen) {
      clickBackFunction();
      return true;
    } else {
      return false;
    }
  });

  const handleNotificationResponse = (response: any) => {
    console.log("response");
    console.log(response);
  };

  const onClick = () => {
    navigation.openDrawer();
  };

  const getContent = (contextObj: ContextObj) => {
    const {theme, overlayColor, useNavigation, setUseNavigation, user} = contextObj;

    const {language} = user;

    const isChat = () => {
      if (useNavigation) {
        const useRoute = getCurrentRouteName(useNavigation.navigation);
        return useRoute === SCREEN.CHAT;
      }
      return false;
    };

    const toPersonalInfo = (personalInfo: PersonalInfo) => {
      const matchId = getParamFromNavigation(useNavigation?.navigation as any, "matchId");
      useNavigation?.navigation.navigate(SCREEN.PERSONAL_INFO, {personalInfo, matchId});
      setUseNavigation({navigation: useNavigation?.navigation as any, backScreen: SCREEN.CHAT as any});
    };  

    const getChatHeaderBody = () => {
      const matchId = getParamFromNavigation(useNavigation?.navigation as any, "matchId");
      const match = matchs.find((match) => match.id === matchId);
      if (!match) {return null; }
      const {isTyping} = match;
      const useUser = getUseUser(match.users, user);
      const name = useUser?.personalInfo?.name;
      const imageUrl = useUser?.personalInfo?.profilePicOneUrl;
      return (
        <PlainTouchable activeOpacity={0.8} onPress={() => toPersonalInfo(useUser?.personalInfo as PersonalInfo)}>
          <CenterView style={{flexDirection: "row", justifyContent: "flex-start", marginLeft: -1 * wp(4)}}>
            <PlainAvatar source={{uri: imageUrl}} style={{height: hp(4.5), width: hp(4.5), borderWidth: 0, marginRight: wp(2)}}/>
            <CenterView>
              <View style={{flexDirection: "row"}}>
                <Title style={{fontSize: hp(2), color: theme.onPrimary}}>{name}</Title>
              </View>
              {isTyping &&
                <View style={{flexDirection: "row"}}>
                  <Text style={{fontSize: hp(1.2), color: theme.subText}}>{T.IS_TYPING[language]}</Text>
                </View>}
            </CenterView>
          </CenterView>
        </PlainTouchable>
      );
    };

    const getChatHeaderRight = () => {
      return (
        <View style={{flexDirection: "row", height: "100%"}}>
          <PlainTouchable>
            <Image source={imageLoader.undo} style={{width: hp(3), height: hp(3)}} />
          </PlainTouchable>
        </View>
      );
    };

    const toSetting = () => {

    };

    const getSettingRight = () => {
      return (
        <PlainTouchable style={{}} activeOpacity={0.6} onPress={() => toSetting()}>
          <Image source={imageLoader.setting} style={{width: hp(3.5), height: hp(3.5)}} />
        </PlainTouchable>
      );
    };

    const getChatHeaderLeft = () => {
      return (
        <PlainTouchable onPress={() => useFunction()}>
          <Image source={image} style={{width: hp(3.5), height: hp(3.5), tintColor: theme.onPrimary, marginLeft: -1 * wp(2)}} />
        </PlainTouchable>
      );
    };

    const getLeft = () => {
      return (
        <PlainTouchable onPress={() => useFunction()}>
          <Image source={image} style={{width: hp(3.5), height: hp(3.5), tintColor: theme.onPrimary}} />
        </PlainTouchable>
      );
    };

    const getBody = () => {
      let title = getDisplayNameByRouteName(currentRoute, contextObj.user.language);
      if (useNavigation) {
        const useRoute = getCurrentRouteName(useNavigation.navigation);
  
        if (useRoute) {
          title = getDisplayNameByRouteName(useRoute, contextObj.user.language);
        }
      }
      return (
        <Title style={{fontSize: hp(2.4), color: theme.onPrimary}}>{title}</Title>
      );
    };

    const image = (!!useNavigation?.backScreen) ? imageLoader.back : imageLoader.menu_white;
    const useFunction = (!!useNavigation?.backScreen) ? clickBackFunction : onClick;
    const useIsChat = isChat();
    return (
      <>
        <ThreePartRow height={hp(10)} extraStyle={{paddingTop: Constants.statusBarHeight, backgroundColor: theme.primary, opacity: 1, ...extraStyle}}
          Left={useIsChat ? getChatHeaderLeft() : getLeft()}
          Body={useIsChat ? getChatHeaderBody() : getBody()}
          Right={useIsChat ? getChatHeaderRight() : getSettingRight()}
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