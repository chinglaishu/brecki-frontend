import { DrawerContentComponentProps, DrawerContentScrollView } from "@react-navigation/drawer";
import React, {FC, useRef, useState} from "react";
import { Image, Text, View, LayoutAnimation, NativeModules, Animated, Easing } from "react-native";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { SubTitle, DrawerItemText, Title } from "../component/text";
import { PlainTouchable } from "../component/touchable";
import { ContainerView, RowView } from "../component/view";
import { SCREEN } from "../constant/constant";
import { ContextObj, User } from "../type/common";
import { ContextConsumer } from "../utils/context";
import imageLoader from "../utils/imageLoader";
import Constants from 'expo-constants';
import { T } from "../utils/translate";

const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

type CustomDrawerProps = {
  drawerContentProps: DrawerContentComponentProps,
};

type DrawerItemProps = {
  name: string,
  imageSource: any,
  screen: string,
  activeBackgroundColor: string,
  onPressEvent: any,
  isDisable: boolean,
};

type DrawerItemData = {
  name: string,
  imageSource: any,
  screen: string,
  needPersonalInfo?: boolean,
};

const DrawerItem: FC<DrawerItemProps> = ({name, imageSource, screen, activeBackgroundColor, onPressEvent, isDisable}) => {

  const [useWidth, setUseWidth] = useState(new Animated.Value(0));
  // const [useHeight, setUseHeight] = useState(new Animated.Value(0));
  const [opacity, setOpacity] = useState(new Animated.Value(0));

  const doAnimation = (toValue: number, duration: number, easing: any) => {

    Animated.timing(useWidth, {
      toValue,
      duration,
      useNativeDriver: false,
    }).start();

    Animated.timing(opacity, {
      toValue,
      duration,
      useNativeDriver: false,
    }).start();

    // Animated.parallel(
    //   [
    //     Animated.timing(useWidth, {
    //       toValue,
    //       duration,
    //       easing: easing(Easing.quad),
    //       useNativeDriver: false,
    //     }),
    //     // Animated.timing(useHeight, {
    //     //   toValue,
    //     //   duration,
    //     //   useNativeDriver: false,
    //     // }),
    //     Animated.timing(opacity, {
    //       toValue,
    //       duration: 300,
    //       easing: easing(Easing.quad),
    //       useNativeDriver: true,
    //     })
    //   ], {
    //     stopTogether: false,
    //   }
    // ).start();
  }

  const useWidthAnim = useWidth.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  // const useHeightAnim = useWidth.interpolate({
  //   inputRange: [0, 1],
  //   outputRange: ["5%", "100%"],
  // });

  const useOpacityAnim = useWidth.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const overOpacity = (isDisable) ? 0.4 : 1.0;

  return (
    <PlainTouchable activeOpacity={0.6} style={{paddingLeft: wp(4), paddingVertical: hp(2), opacity: overOpacity}}
      onPressIn={() => doAnimation(1, 200, Easing.out)}
      onPressOut={() => doAnimation(0, 0, Easing.out)}
      onPress={() => {
        doAnimation(0, 200, Easing.out);
        onPressEvent(screen);
      }} disabled={isDisable}
      >
      <RowView style={{alignItems: "flex-start", justifyContent: "flex-start"}}>
        <Image source={imageSource} style={{height: hp(2.5), width: hp(2.5), marginRight: wp(4)}} />
        <DrawerItemText>{name}</DrawerItemText>
      </RowView>
      <View style={{position: "absolute", flex: 1, top: 0, left: 0, right: 0, bottom: 0, flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
        <Animated.View style={{width: useWidthAnim, opacity: useOpacityAnim, height: "100%",
          backgroundColor: activeBackgroundColor}}></Animated.View>
      </View>
    </PlainTouchable>
  );
};

const getDrawerItemList = (user: User, activeBackgroundColor: string, onPressEvent: any, dataList: DrawerItemData[]) => {
  return dataList.map((data) => {
    const {imageSource, name, screen, needPersonalInfo} = data;
    const isDisable: any = (needPersonalInfo && !user.personalInfo);
    return (
      <DrawerItem name={name} imageSource={imageSource} activeBackgroundColor={activeBackgroundColor}
        onPressEvent={onPressEvent} screen={screen} isDisable={isDisable} /> 
    );
  });
};

export const CustomDrawer: FC<CustomDrawerProps> = ({drawerContentProps}) => {
  
  // const [activeItem, setActiveItem] = useState("");
  // const [useWidth, setUseWidth] = useState(new Animated.Value(0));
  // const [opacity, setOpacity] = useState(new Animated.Value(0));

  const getContent = (contextObj: ContextObj) => {

    const {user, logout, theme} = contextObj;
    const {language} = user;

    const drawerItemDataList: DrawerItemData[] = [
      {
        name: SCREEN.HOME,
        imageSource: imageLoader.drawer_home,
        screen: SCREEN.HOME,
        needPersonalInfo: true,
      },
      {
        name: SCREEN.PERSONAL_INFO,
        imageSource: imageLoader.username,
        screen: SCREEN.PERSONAL_INFO,
      },
      {
        name: "Message",
        imageSource: imageLoader.drawer_chat,
        screen: SCREEN.CHAT_LIST,
        needPersonalInfo: true,
      },
      {
        name: "History",
        imageSource: imageLoader.drawer_history,
        screen: SCREEN.HISTORY,
        needPersonalInfo: true,
      },
      {
        name: "Data",
        imageSource: imageLoader.drawer_data,
        screen: SCREEN.DATA,
        needPersonalInfo: true,
      },
      {
        name: SCREEN.SETTING,
        imageSource: imageLoader.drawer_setting,
        screen: SCREEN.SETTING,
      },
    ];

    const bottomItemDataList: DrawerItemData[] = [
      {
        name: T.LOGOUT[language],
        imageSource: imageLoader.drawer_logout,
        screen: "logout",
      },
    ];

    const onPressEvent = (screen: string) => {
      if (screen === "logout") {
        logout();
      } else {
        drawerContentProps.navigation.navigate(screen);
      }
    };

    const backgroundColor = "#FFFFFF";
    const activeBackgroundColor = "#00000040";

    return (
      <View style={{backgroundColor, flex: 1}}>
        <View style={{backgroundColor: theme.secondary, paddingTop: Constants.statusBarHeight, height: hp(10),
          justifyContent: "flex-end", paddingLeft: wp(4), paddingBottom: wp(2)}}>
          <DrawerItemText style={{color: theme.onSecondary}}>{user.personalInfo?.name || user.username}</DrawerItemText>
        </View>
        <View style={{flex: 1, marginTop: hp(2)}}>
          {getDrawerItemList(user, activeBackgroundColor, onPressEvent, drawerItemDataList)}
        </View>
        <View style={{borderTopColor: theme.border, borderTopWidth: 1}}>
          {getDrawerItemList(user, activeBackgroundColor, logout, bottomItemDataList)}
        </View>
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
