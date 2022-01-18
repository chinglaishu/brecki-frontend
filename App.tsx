import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import { StyleSheet, SafeAreaView, Text, View, BackHandler,
  Dimensions, Animated, Easing, Platform, LayoutAnimation, NativeModules,
  AppState, 
  Keyboard} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthNavigator, MainNavigator } from './src/navigator/MainNavigator';
import { Auth } from './src/page/auth/Auth';
import { getLightTheme } from './src/style/theme';
import {ContextProvider} from './src/utils/context';
import { guest } from './src/utils/data';
import { useFonts, RubikMonoOne_400Regular } from '@expo-google-fonts/rubik-mono-one';
import {RobotoMono_400Regular} from '@expo-google-fonts/roboto-mono';
import {ThemeProvider} from "styled-components/native";
import "./src/request/config";
import { StatusModal, StatusModalProps } from './src/component/modal';
import { changeStateObj, checkIfRequestError, checkIsIOS, clearTemporarayStorage, getCurrentRouteName, getDefaultHandleTypeByStatus, getParamFromNavigation, getStoreData, removeStoreData } from './src/utils/utilFunction';
import { T } from './src/utils/translate';
import { AUTH_SCREEN, MODAL_HANDLE_TYPE, SCREEN, STATUS_TYPE, STORE_KEY } from './src/constant/constant';
import { getUserSelf } from './src/request/user';
import { initAxiosHeader, setAxiosAuthorization, setAxiosLanguage } from './src/request/config';
import Progressbar from './src/utils/test';
import { TRANSPARENT } from './src/utils/size';
import { Canvas } from './src/page/question/Canvas';
import fire from './src/utils/firebase';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import Toast from 'react-native-toast-message';
import { getToast } from './src/component/Toast';
import { Match } from './src/page/likeZone/type';
import { getAllMatchs } from './src/request/match';
import { User } from './src/type/common';
import { ContainerView } from './src/component/view';
import { PlainTouchable } from './src/component/touchable';

const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

const Content = () => {

  const [user, setUser] = useState(guest);
  const {language} = user;
  const [theme, setTheme] = useState(getLightTheme(user.language));
  const [overlayColor, setOverlayColor] = useState(TRANSPARENT);
  const [useNavigation, setUseNavigation] = useState(null as any);
  const [matchs, setMatchs] = useState([] as Match[]);
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    Keyboard.addListener('keyboardDidHide', _keyboardDidHide);
    return () => {
      Keyboard.removeListener('keyboardDidHide', _keyboardDidHide);
    };
  }, []);

  const endTyping = async () => {
    if (useNavigation?.navigation) {
      const matchId = getParamFromNavigation(useNavigation?.navigation as any, "matchId");
      if (matchId) {
        return fire.endTyping(matchId, user.id);
      }
    }
    return null;
  }

  const _keyboardDidHide = () => {
    endTyping();
  };

  const handleAppStateChange = (nextAppState: any) => {
    if (user.isGuest) {return; }
    if (appState === nextAppState) {return; }
    if (appState.match(/inactive|background/) && nextAppState === 'active') {
      fire.online(user.id);
    } else {
      endTyping();
      fire.offline(user.id);
    }
    setAppState(nextAppState);
  }

  useEffect(() => {
    AppState.addEventListener("change", handleAppStateChange);
    return () => {
       AppState.removeEventListener("change", handleAppStateChange);
    };
  }, []);

  const changeMatchIsTyping = (matchId: string, isTyping: boolean) => {
    const useMatchs: Match[] = JSON.parse(JSON.stringify(matchs));
    for (let i = 0 ; i < useMatchs.length ; i++) {
      if (useMatchs[i].id === matchId) {
        useMatchs[i].isTyping = isTyping;
      }
    }
    LayoutAnimation.spring();
    setMatchs(useMatchs);
  };

  const refreshMatchs = async (useUserId?: string) => {
    const userId = useUserId || user.id;
    const result = await getAllMatchs(userId);
    if (!result) {return; }
    const matchs = result.data.data;
    setMatchs(matchs);
  };

  const logout = async () => {
    console.log("call logout");
    await removeStoreData(STORE_KEY.ACCESS_TOKEN);
    await removeStoreData(STORE_KEY.REFRESH_TOKEN);
    await initAxiosHeader();
    await endTyping();
    await fire.offline(user.id);
    await fire.logout();
    setUser({...guest, isLoading: false});
  };

  const closeStatusModal = () => {
    const useStatusModalObj = changeStateObj(statusModalObj, "isVisible", false);
    setStatusModalObj(useStatusModalObj);
  };

  const changeStatusModal = ({statusType, isVisible, message, title, handleType}: StatusModalProps) => {
    const useStatusType = statusType || STATUS_TYPE.ERROR;
    if (!title) {
      title = (useStatusType === STATUS_TYPE.ERROR) ? T.REQUEST_FAIL[user.language] : T.LOADING[user.language];
    }
    const useIsVisible = (isVisible === false) ? false : true;
    const useHandleType = handleType || getDefaultHandleTypeByStatus(useStatusType);
    setStatusModalObj({...statusModalObj, ...{statusType: useStatusType, isVisible: useIsVisible, message, title, handleType: useHandleType}});
  };

  const loginAction = async (user: User) => {
    console.log("login");
    console.log("do login")
    setUser({...user, isLoading: false, isGuest: false});
    await fire.login(user);
    await fire.startStatusChecker(user.id);
    await refreshMatchs(user.id);
    await clearTemporarayStorage();
    changeStatusModal({statusType: STATUS_TYPE.SUCCESS, isVisible: false});
  };

  const getInitialUser = async () => {
    await initAxiosHeader();
    const token = await getStoreData(STORE_KEY.ACCESS_TOKEN);
    console.log(`get inital user, token: ${token}`);
    if (!token) {
      setUser({...user, isLoading: false});
    } else {
      changeStatusModal({statusType: STATUS_TYPE.LOADING});
      const result = await getUserSelf();
      if (checkIfRequestError(result)) {
        setUser({...user, isLoading: false});
        changeStatusModal({statusType: STATUS_TYPE.ERROR, message: T.TOKEN_EXPIRE[language]});
      } else {
        const user = result.data.data;
        loginAction(user);
      }
    }
  };

  useEffect(() => {
    getInitialUser();
  }, []);

  const statusModalProps: StatusModalProps = {
    title: "",
    message: "",
    isVisible: false,
    statusType: "success",
    handleType: MODAL_HANDLE_TYPE.USER_HANDLE,
  };

  const [statusModalObj, setStatusModalObj] = useState(statusModalProps);
  const {title, message, isVisible, statusType, handleType} = statusModalObj;

  const {isGuest, isLoading, personalInfo} = user;
  const initialRoute = AUTH_SCREEN.LOGIN;
  const appInitalRoute = personalInfo ? SCREEN.HOME : SCREEN.PERSONAL_INFO; 
  // somehow put View before have "alignItem": "center" will show blank screen!

  return (
    <>
      <ThemeProvider theme={theme}>
        <ContextProvider value={{user, theme, setTheme, setUser, changeStatusModal, logout, loginAction, overlayColor, setOverlayColor,
            useNavigation, setUseNavigation, matchs, refreshMatchs, setMatchs, changeMatchIsTyping}}>
          <PlainTouchable activeOpacity={1.0} onPress={() => Keyboard.dismiss()}>
            <View style={{flex: 1, minHeight: heightPercentageToDP(100)}}>
              {!isLoading && isGuest && <AuthNavigator initialRoute={initialRoute} changeStatusModal={changeStatusModal} />}
              {!isLoading && !isGuest && <MainNavigator initialRoute={appInitalRoute} changeStatusModal={changeStatusModal} />}
            </View>
          </PlainTouchable>
          <StatusModal statusType={statusType} title={title} message={message} isVisible={isVisible} closeModal={closeStatusModal}
            handleType={handleType} />
        </ContextProvider>
        <StatusBar style="auto" />
        {getToast(theme)}
      </ThemeProvider>
    </>
  );
};

export default function App() {
  let [fontsLoaded] = useFonts({RobotoMono_400Regular, RubikMonoOne_400Regular});
  if (!fontsLoaded) {return <Text>Font Loading</Text>; }
  
  if (checkIsIOS()) {
    return (
      <View style={{flex: 1}}>
        <Content />
      </View>
    )
  }

  return (
    <SafeAreaProvider style={{flex: 1}}>
      <SafeAreaView style={{flex: 1}}>
        <Content />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
