import { DrawerNavigationProp } from "@react-navigation/drawer";
import { ParamListBase } from "@react-navigation/routers";
import { StackNavigationProp } from "@react-navigation/stack";
import { AxiosResponse } from "axios";
import { DefaultTheme } from "styled-components";
import { StatusModalProps } from "../component/modal";
import { AGE_RANGE_NUM, SEX_NUM, STATUS_TYPE } from "../constant/constant";
import { Match } from "../page/likeZone/type";
import { PersonalityScore, SubmitQuestionScoreRecord } from "../page/question/type";

export type PersonalInfoLocation = {
  placeId: string,
  name: MultiLanguage,
};

export type Target = {
  targetSexs: SEX_NUM[];
  targetAgeRanges: AGE_RANGE_NUM[];
  targetLocations: PersonalInfoLocation[];
};

export type PERSONAL_INFO_KEY = "name" | "sex" | "ageRange" | "location" | "profilePicOneUrl"
  | "profilePicTwoUrl" | "targetSex" | "targetAgeRange" | "targetLocation" | "profilePicOneFileType"
  | "profilePicTwoFileType";

export type ProfilePicTwoUrl = {
  blurMore: string,
  blurLess: string,
  clear: string,
};

export type PersonalInfo = {
  name: string,
  sex: SEX_NUM,
  ageRange: AGE_RANGE_NUM,
  location: PersonalInfoLocation,
  profilePicOneUrl: string,
  profilePicTwoUrl: ProfilePicTwoUrl,

  profilePicOneFileType?: string,
  profilePicTwoFileType?: string;

  targetSex: SEX_NUM;
  targetAgeRange: AGE_RANGE_NUM;
  targetLocation: PersonalInfoLocation;
};

export type User = {
  id: string,
  username: string,
  language: Language,
  phone?: string,
  displayName?: string,
  personalInfo?: PersonalInfo,
  target?: Target,
  firebaseEmail?: string,
  firebasePassword?: string,
  notificationTokens?: string[],
  isEdited?: boolean,
  isGuest?: boolean,
  isLoading?: boolean,
  submitQuestionScoreRecord?: SubmitQuestionScoreRecord,
  personalityScore?: PersonalityScore,
  personalityScoreNum?: number;
};

export type SetUserFunction = (user: User) => any;

export type UseNavigation = {
  navigation: DrawerNavigationProp<any> | StackNavigationProp<any>,
  backScreen: string,
};

export type ContextObj = {
  user: User,
  setUser: SetUserFunction,
  theme: DefaultTheme,
  setTheme: (theme: DefaultTheme) => any,
  changeStatusModal: (obj: StatusModalProps) => any,
  logout: () => any,
  overlayColor: string,
  setOverlayColor: (color: string) => any,
  useNavigation: UseNavigation | null,
  setUseNavigation: (useNavigation: UseNavigation | null) => any,
  matchs: Match[],
  refreshMatchs: () => any,
  setMatchs: (matchs: Match[]) => any,
  changeMatchIsTyping: (matchId: string, isTyping: boolean) => any,
};

export type PageProps = {
  navigation: DrawerNavigationProp<any>,
};

export type StackPageProps = {
  navigation: StackNavigationProp<any>,
};

type AuthNavigationParams = {
  isLogin: boolean,
};

export type AuthProps = {
  navigation: StackNavigationProp<ParamListBase>,
  setUser: any,
}

export type InputObjItem = {
  content: string,
  formatError: any,
};

export type InputObjKey = "username" | "password" | "confirmPassword" | "phoneRegionCode" | "phoneNumber" | any;

export type InputObj = {
  [K in InputObjKey]: InputObjItem;
};

export type MultiLanguage = {
  en: string,
  zh: string,
};

export type Language = "en" | "zh";

export type Route = {
  key: string,
  name: string,
  params: any,
};

export type CommonResponse<T> = {
  isSuccess: boolean,
  data: T,
  message?: string,
  info?: string,
}

export type R<T> = Promise<AxiosResponse<CommonResponse<T>>>;

export type GoogleRequest<T> = Promise<AxiosResponse<T>>;

export type SystemOrManualMatch = {
  id: string,
  userId: string,
  matchUserIds: string[],
  matchUsers: User[],
};

export type MessageType = "text" | "image" | "voice";
