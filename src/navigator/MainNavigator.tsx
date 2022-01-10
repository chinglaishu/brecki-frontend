import React, { Component, FC } from "react";
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { Home } from '../page/home/Home';
import { Setting } from '../page//setting/Setting';
import { createStackNavigator } from '@react-navigation/stack';
import { Auth } from '../page/auth/Auth';
import { AUTH_SCREEN, SCREEN } from '../constant/constant';
import { VerifyPhone } from '../page/auth/VerifyPhone';
import { ResetPassword } from '../page/auth/ResetPassword';
import { PersonalInfo } from '../page/personalInfo/PersonalInfo';
import { ContextConsumer } from "../utils/context";
import { ContextObj, User } from "../type/common";
import { T } from "../utils/translate";
import { Header } from "../component/header";
import { CustomDrawer } from "./CustomDrawer";
import { LikeZoneStack } from "./LikeZoneNavigator";
import { QuestionPage } from "../page/question/Question";
import { Chat } from "../page/chat/Chat";
import { QuestionEnd } from "../page/question/QuestionEnd";
import { StatusModalProps } from "../component/modal";
import { HistoryPage } from "../page/history/History";
import { ChatList } from "../page/chat/ChatList";
import { ChatStack } from "./ChatNavigator";
import { KeyboardAvoidingView } from "react-native";
import { SettingStack } from "./SettingNavigator";

type MainNavigatorProps = {
  initialRoute: SCREEN,
  changeStatusModal: (obj: StatusModalProps) => any,
};

type AuthNavigatorProps = {
  initialRoute: AUTH_SCREEN,
  changeStatusModal: (obj: StatusModalProps) => any,
};

const Drawer = createDrawerNavigator();

export const MainNavigator: FC<MainNavigatorProps> = ({initialRoute, changeStatusModal}: MainNavigatorProps) => {

  const getContent = (contextObj: ContextObj) => {
    const {user, matchs, refreshMatchs, useNavigation, setUseNavigation} = contextObj;
    const {language} = user;
    return (
        <NavigationContainer>
          <Drawer.Navigator initialRouteName={initialRoute} screenOptions={{header: (props) => <Header headerProps={props} matchs={matchs} refreshMatchs={refreshMatchs} useNavigation={useNavigation} setUseNavigation={setUseNavigation} /> }}
            drawerContent={(props) => <CustomDrawer drawerContentProps={props} />}
            backBehavior={"history"}>
            <Drawer.Screen name={SCREEN.HOME} component={Home} options={{title: T.SCREEN_HOME[language]}} initialParams={{changeStatusModal}}/>
            <Drawer.Screen name={SCREEN.QUESTION} component={QuestionPage} options={{title: T.SCREEN_QUESTION[language]}} initialParams={{changeStatusModal}} />
            <Drawer.Screen name={SCREEN.SYSTEM_LIKE_ZONE} component={LikeZoneStack} options={{title: T.SCREEN_LIKE_ZONE[language]}} initialParams={{changeStatusModal}} />
            <Drawer.Screen name={SCREEN.CHAT_LIST} component={ChatStack} options={{title: T.SCREEN_CHAT[language]}} initialParams={{changeStatusModal}} />
            <Drawer.Screen name={SCREEN.PERSONAL_INFO} component={PersonalInfo} options={{title: T.SCREEN_PERSONAL_INFO[language]}} initialParams={{changeStatusModal}} />
            <Drawer.Screen name={SCREEN.SETTING} component={SettingStack} options={{title: T.SCREEN_SETTING[language]}} initialParams={{changeStatusModal}} />
            <Drawer.Screen name={SCREEN.QUESTION_END} component={QuestionEnd} options={{title: T.SCREEN_QUESTION[language]}} initialParams={{changeStatusModal}} />
            <Drawer.Screen name={SCREEN.HISTORY} component={HistoryPage} options={{title: T.SCREEN_HISTORY[language]}} initialParams={{changeStatusModal}} />
          </Drawer.Navigator>
        </NavigationContainer>
    );
  };

  return (
    <ContextConsumer>
      {(contextObj: ContextObj) => {
        return getContent(contextObj);
      }}
    </ContextConsumer>
  );
};

const Stack = createStackNavigator();

export const AuthNavigator = ({initialRoute, changeStatusModal}: AuthNavigatorProps) => {

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute} screenOptions={{animationEnabled: true, header: () => null}}>
        <Stack.Screen name={AUTH_SCREEN.LOGIN} component={Auth} initialParams={{changeStatusModal}}/>
        <Stack.Screen name={AUTH_SCREEN.SIGN_UP} component={Auth} initialParams={{changeStatusModal}} />
        <Stack.Screen name={AUTH_SCREEN.FORGET_PASSWORD} component={Auth} initialParams={{changeStatusModal}} />
        <Stack.Screen name={AUTH_SCREEN.VERIFY_PHONE} component={VerifyPhone} initialParams={{changeStatusModal}} />
        <Stack.Screen name={AUTH_SCREEN.RESET_PASSWORD} component={ResetPassword} initialParams={{changeStatusModal}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
