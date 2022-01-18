import React, {FC, useState} from "react";
import { Text, View, LayoutAnimation, NativeModules, Image } from "react-native";
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
import { ChatContainer } from "./ChatNavigator";

const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export const LikeZoneStack: FC<PageProps> = ({navigation}) => {

  // add matching history
  const getContent = (contextObj: ContextObj) => {
    const {theme, user, changeStatusModal} = contextObj;
    const {language} = user;
    return (
      <Stack.Navigator initialRouteName={SCREEN.SYSTEM_LIKE_ZONE} screenOptions={{animationEnabled: true, header: (props) => null }}>
        <Stack.Screen name={SCREEN.SYSTEM_LIKE_ZONE} component={SystemLikeZone} initialParams={{changeStatusModal}}/>
        <Stack.Screen name={SCREEN.MANUAL_LIKE_ZONE} component={ManualLikeZone} initialParams={{changeStatusModal}}/>
        <Stack.Screen name={SCREEN.PERSONAL_INFO} component={PersonalInfo} initialParams={{changeStatusModal}} />
        <Stack.Screen name={SCREEN.QUESTION} component={QuestionPage} initialParams={{changeStatusModal}} />
        <Stack.Screen name={SCREEN.QUESTION_RECORD} component={QuestionRecord} initialParams={{changeStatusModal}} />
        <Stack.Screen name={SCREEN.HISTORY} component={HistoryPage} initialParams={{changeStatusModal}} />
        <Stack.Screen name={SCREEN.SUBMIT_QUESTION_END} component={SubmitQuestionEnd} initialParams={{changeStatusModal}} />
        <Stack.Screen name={SCREEN.CHAT} component={ChatContainer} initialParams={{changeStatusModal}} />
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

type LikeZoneTabProps = {
  stackNavigation: StackNavigationProp<any>,
};

// export const LikeZoneTab: FC<LikeZoneTabProps> = ({stackNavigation}) => {

//   // add matching history
//   const getContent = (contextObj: ContextObj) => {
//     const {theme, user, changeStatusModal} = contextObj;
//     const {language} = user;
//     return (
//       <Tab.Navigator 
//         screenOptions={({ route }) => ({
//           tabBarInactiveTintColor: "#FFFFFF75",
//           tabBarActiveTintColor: theme.onSecondary,
//           tabBarLabelStyle: { fontSize: hp(2), fontFamily: FONT_NORMAL },
//           tabBarStyle: {backgroundColor: theme.secondary, height: BOTTOM_TAB_HEIGHT},
//           header: () => null,
//           tabBarIcon: ({focused, color, size}) => {
//             const image = (route.name === "System") ? imageLoader.setting : imageLoader.pen;
//             const opacity = (focused) ? 1.0 : 0.5;
//             return <Image source={image} style={{width: hp(2.5), height: hp(2.5), marginTop: hp(0.5), opacity}} />
//           }
//         })}>
//         <Tab.Screen name="System" component={SystemLikeZone} initialParams={{navigation: stackNavigation, changeStatusModal}} />
//         <Tab.Screen name="Manual" component={ManualLikeZone} initialParams={{navigation: stackNavigation, changeStatusModal}} />
//       </Tab.Navigator>
//     );
//   };

//   return (
//     <ContextConsumer>
//       {(contextObj: ContextObj) => {
//         return getContent(contextObj);
//       }}
//     </ContextConsumer>
//   )
// };
