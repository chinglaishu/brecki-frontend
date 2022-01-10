import { DrawerNavigationProp } from "@react-navigation/drawer";
import { Notification } from "expo-notifications";
import moment from "moment";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import Toast from "react-native-toast-message";
import { SCREEN } from "../../constant/constant";
import { User } from "../../type/common";
import { getCurrentRouteName, getParamFromNavigation } from "../../utils/utilFunction";
import { Match } from "../likeZone/type";
import { MessageNotificationData, MessageUser } from "./type";

export const getUseUser = (users: User[], currentUser: User) => {
  for (let i = 0 ; i < users.length ; i++) {
    if (users[i].id !== currentUser.id) {
      return users[i];
    }
  }
  return null;
};

export const getUseUserById = (users: User[], userId: string) => {
  for (let i = 0 ; i < users.length ; i++) {
    if (users[i].id !== userId) {
      return users[i];
    }
  }
  return null;
};

export const getUseUserByMatchId = (matchs: Match[], matchId: string, userId: string) => {
  for (let i = 0 ; i < matchs.length ; i++) {
    if (matchs[i].id === matchId) {
      return getUseUserById(matchs[i].users, userId);
    }
  }
  return null;
};

export const checkIfMatchIdExist = (matchs: Match[], matchId: string) => {
  for (let i = 0 ; i < matchs.length ; i++) {
    if (matchs[i].id === matchId) {
      return true;
    }
  }
  return false;
};

export const handleMessageNotification = (navigation: DrawerNavigationProp<any>, notification: Notification,
  matchs: Match[], refreshMatchs: () => any) => {

  const currentRoute = getCurrentRouteName(navigation);
  const {request} = notification;
  const {content} = request;
  const {title, body} = content;
  const messageData = content.data as MessageNotificationData;
  const {matchId, messageType} = messageData;

  if (!checkIfMatchIdExist(matchs, matchId)) {
    refreshMatchs();
  }

  const onPressEvent = async () => {
    navigation.navigate(SCREEN.CHAT_LIST, {nextScreen: SCREEN.CHAT, matchId});
  };

  const chatRoute = getParamFromNavigation(navigation, "chatRoute") || SCREEN.CHAT_LIST;
  const currentMatchId = getParamFromNavigation(navigation, "matchId");
  if (currentRoute === SCREEN.CHAT_LIST && chatRoute === SCREEN.CHAT_LIST) {return; }
  if (currentRoute === SCREEN.CHAT_LIST && chatRoute === SCREEN.CHAT && currentMatchId === matchId) {return; }
  Toast.show({type: "message", props: { title, content: body, matchId, messageType },
    onPress: () => onPressEvent(), topOffset: hp(12)});
};

export const getChatDisplayTime = (timestamp?: number) => {
  if (!timestamp) {return "";}
  return moment(timestamp * 1000).format("YYYY-MM-DD HH:mm");
};

export const checkIfUserRead = (messageUser: MessageUser | null, timestamp: number) => {
  if (!messageUser) {return false; }
  const {lastSeen} = messageUser;
  return moment(lastSeen).isSameOrAfter(moment(timestamp));
};
