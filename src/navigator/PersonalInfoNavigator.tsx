import React, {FC, useState} from "react";
import { Text, View, LayoutAnimation, NativeModules, Image, KeyboardAvoidingView } from "react-native";
import { ButtonText, SlideText, SlideTitle, Title } from "../component/text";
import { ContainerView, SlideTitleContainer } from "../component/view";
import { ContextObj, Language, MultiLanguage, PageProps } from "../type/common";
import { ContextConsumer } from "../utils/context";
import { T } from "../utils/translate";
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SystemLikeZone } from "../page/likeZone/SystemLikeZone";
import { ManualLikeZone } from "../page/likeZone/ManualLikeZone";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { FONT_NORMAL, SCREEN } from "../constant/constant";
import imageLoader from "../utils/imageLoader";
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import { PersonalInfo } from "../page/personalInfo/PersonalInfo";
import { QuestionPage } from "../page/question/Question";
import { Header } from "../component/header";
import { SubmitQuestionEnd } from "../page/question/SubmitQuestionEnd";
import { BOTTOM_TAB_HEIGHT } from "../utils/size";
import { HistoryPage } from "../page/history/History";
import { Chat } from "../page/chat/Chat";
import { QuestionRecord } from "../page/question/QuestionRecord";
import { ChatList } from "../page/chat/ChatList";
import { ScrollView } from "react-native-gesture-handler";
import { Setting } from "../page/setting/Setting";
import { Account } from "../page/setting/Account";

const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

const Stack = createStackNavigator();

export const PersonalInfoStack: FC<PageProps> = ({navigation}) => {

  // add matching history
  const getContent = (contextObj: ContextObj) => {
    const {theme, user, changeStatusModal} = contextObj;
    const {language} = user;
    return (
      <Stack.Navigator initialRouteName={SCREEN.PERSONAL_INFO} screenOptions={{animationEnabled: true, header: (props) => null }}
        detachInactiveScreens={false}>
        <Stack.Screen name={SCREEN.PERSONAL_INFO} component={PersonalInfo} initialParams={{changeStatusModal}}/>
        <Stack.Screen name={SCREEN.HISTORY} component={HistoryPage} initialParams={{changeStatusModal}}/>
        <Stack.Screen name={SCREEN.QUESTION} component={QuestionPage} initialParams={{changeStatusModal}}/>
        <Stack.Screen name={SCREEN.QUESTION_RECORD} component={QuestionRecord} initialParams={{changeStatusModal}}/>
      </Stack.Navigator>
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
