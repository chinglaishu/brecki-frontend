
export const FONT_NORMAL = "RobotoMono_400Regular";
export const FONT_BUTTON = "RubikMonoOne_400Regular";

export const AUTHORIZATION_HEADER = "Authorization";
export const LANGUAGE_HEADER = "Accept-Language";

export const STORE_KEY = {
  ACCESS_TOKEN: "a",
  REFRESH_TOKEN: "b",
  LANGUAGE: "c",
};

export type STATUS_TYPE = "loading" | "success" | "error" | "info";
export const STATUS_TYPE: {
  LOADING: STATUS_TYPE,
  SUCCESS: STATUS_TYPE,
  ERROR: STATUS_TYPE,
  INFO: STATUS_TYPE,
} = {
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
  INFO: "info",
};

export type MODAL_HANDLE_TYPE = 0.75 | 4 | 0;
export const MODAL_HANDLE_TYPE: {
  SHORT_CLOSE: MODAL_HANDLE_TYPE,
  LONG_CLOSE: MODAL_HANDLE_TYPE,
  USER_HANDLE: MODAL_HANDLE_TYPE,
} = {
  SHORT_CLOSE: 0.75,
  LONG_CLOSE: 4,
  USER_HANDLE: 0,
};

export type AUTH_SCREEN = "Login" | "Signup" | "ForgetPassword" | "VerifyPhone" | "ResetPassword";
export const AUTH_SCREEN: {
  LOGIN: AUTH_SCREEN,
  SIGN_UP: AUTH_SCREEN,
  FORGET_PASSWORD: AUTH_SCREEN,
  VERIFY_PHONE: AUTH_SCREEN,
  RESET_PASSWORD: AUTH_SCREEN,
} = {
  LOGIN: "Login",
  SIGN_UP: "Signup",
  FORGET_PASSWORD: "ForgetPassword",
  VERIFY_PHONE: "VerifyPhone",
  RESET_PASSWORD: "ResetPassword",
};

export type SCREEN = "Home" | "Question" | "QuestionRecord" | "QuesetionEnd" | "SubmitQuestionEnd" | "SystemLikeZone"
  | "ManualLikeZone" | "Chat" | "ChatList" | "PersonalInfo" | "Setting" | "Account" | "History" | "Data";
export const SCREEN: {
  HOME: SCREEN,
  QUESTION: SCREEN,
  QUESTION_RECORD: SCREEN,
  QUESTION_END: SCREEN,
  SUBMIT_QUESTION_END: SCREEN,
  SYSTEM_LIKE_ZONE: SCREEN,
  MANUAL_LIKE_ZONE: SCREEN,
  CHAT: SCREEN,
  CHAT_LIST: SCREEN,
  PERSONAL_INFO: SCREEN,
  SETTING: SCREEN,
  ACCOUNT: SCREEN,
  HISTORY: SCREEN,
  DATA: SCREEN,
} = {
  HOME: "Home",
  QUESTION: "Question",
  QUESTION_RECORD: "QuestionRecord",
  QUESTION_END: "QuesetionEnd",
  SUBMIT_QUESTION_END: "SubmitQuestionEnd",
  SYSTEM_LIKE_ZONE: "SystemLikeZone",
  MANUAL_LIKE_ZONE: "ManualLikeZone",
  CHAT: "Chat",
  CHAT_LIST: "ChatList",
  PERSONAL_INFO: "PersonalInfo",
  SETTING: "Setting",
  ACCOUNT: "Account",
  HISTORY: "History",
  DATA: "Data",
};

export const LAST_SCREEN_PARAM_KEY = "last_screen";

export const SMS_CODE_DIGIT = 6;

export type ACCOUNT_TYPE_NUM = 0 | 1 | 2 | 3;
export const ACCOUNT_TYPE_NUM: {
  
  NORMAL: ACCOUNT_TYPE_NUM,
  GOOGLE: ACCOUNT_TYPE_NUM,
  FACEBOOK: ACCOUNT_TYPE_NUM,
  APPLE: ACCOUNT_TYPE_NUM,

} = {

  NORMAL: 0,
  GOOGLE: 1,
  FACEBOOK: 2,
  APPLE: 3,

};

export type SEX_NUM = 0 | 1 | 2;
export const SEX_NUM: {
  MALE: SEX_NUM,
  FEMALE: SEX_NUM,
  OTHER: SEX_NUM,
} = {
  MALE: 0,
  FEMALE: 1,
  OTHER: 2,
};

export const SEX_NUM_REF = {
  en: {
    0: "Male",
    1: "Female",
    2: "Other",
  },
  zh: {
    0: "Male",
    1: "Female",
    2: "Other",
  },
};

export type WEEK_DAY_NUM = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export const WEEK_DAY_NUM: {

  SUN: WEEK_DAY_NUM,
  MON: WEEK_DAY_NUM,
  TUE: WEEK_DAY_NUM,
  WED: WEEK_DAY_NUM,
  THU: WEEK_DAY_NUM,
  FRI: WEEK_DAY_NUM,
  SAT: WEEK_DAY_NUM,

} = {
  SUN: 0,
  MON: 1,
  TUE: 2,
  WED: 3,
  THU: 4,
  FRI: 5,
  SAT: 6,
};

export type ROLE_NUM = 0 | 1 | 2;
export const ROLE_NUM: {

  ADMIN: ROLE_NUM,
  USER: ROLE_NUM,
  GUEST: ROLE_NUM,

} = {
  ADMIN: 0,
  USER: 1,
  GUEST: 2,
};

export type AGE_RANGE_NUM = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
export const AGE_RANGE_NUM: {

  "below20": AGE_RANGE_NUM,
  "20to24": AGE_RANGE_NUM,
  "25to29": AGE_RANGE_NUM,
  "30to34": AGE_RANGE_NUM,
  "35to39": AGE_RANGE_NUM,
  "40to44": AGE_RANGE_NUM,
  "45to49": AGE_RANGE_NUM,
  "over50": AGE_RANGE_NUM,

} = {

  "below20": 0,
  "20to24": 1,
  "25to29": 2,
  "30to34": 3,
  "35to39": 4,
  "40to44": 5,
  "45to49": 6,
  "over50": 7,

};

export const AGE_RANGE_REF = {
  en: {
    0: "below 20",
    1: "20 - 24",
    2: "25 - 29",
    3: "30 - 34",
    4: "35 - 39",
    5: "40 - 44",
    6: "45 - 49",
    7: "over 50",
  },
  zh: {
    0: "below 20",
    1: "20 - 24",
    2: "25 - 29",
    3: "30 - 34",
    4: "35 - 39",
    5: "40 - 44",
    6: "45 - 49",
    7: "over 50",
  },
};

export type FRIEND_STATUS_NUM = -1 | 0;
export const FRIEND_STATUS_NUM: {

  friend_quit: FRIEND_STATUS_NUM,
  normal: FRIEND_STATUS_NUM,

} = {
  friend_quit: -1,
  normal: 0,
};

export type MATCH_STATUS_NUM = -4 | -3 | -2 | -1 | 0 | 1;
export const MATCH_STATUS_NUM: {
  SOMEONE_QUIT: MATCH_STATUS_NUM,
  SOMEONE_BLOCK: MATCH_STATUS_NUM,
  CROSS: MATCH_STATUS_NUM,
  REJECTED: MATCH_STATUS_NUM,
  WAITING: MATCH_STATUS_NUM,
  ACCEPTED: MATCH_STATUS_NUM,
} = {
  SOMEONE_QUIT: -4,
  SOMEONE_BLOCK: -3,
  CROSS: -2,
  REJECTED: -1,
  WAITING: 0,
  ACCEPTED: 1,
};

export type MATCH_METHOD_NUM = 0 | 1;
export const MATCH_METHOD_NUM: {
  SYSTEM: MATCH_METHOD_NUM,
  MANUAL: MATCH_METHOD_NUM,
} = {
  SYSTEM: 0,
  MANUAL: 1,
};

export type IMAGE_S3_DIRECTORY = "question-drawing"
export const IMAGE_S3_DIRECTORY: {
  QUESTION_DRAWING: IMAGE_S3_DIRECTORY,
} = {
  QUESTION_DRAWING: "question-drawing",
};

export type PERSONALITY_SCORE_KEY = "Openness" | "Conscientiousness" | "Extraversion" |
  "Agreeableness" | "Neuroticism";

export const PERSONALITY_SCORE_KEY_COLOR_REF = {
  Openness: "#FF7557",
  Conscientiousness: "#64F755",
  Extraversion: "#FEED3F",
  Agreeableness: "#3FCDFE",
  Neuroticism: "#F050E9",
};

export const SYSTEM_MATCH_NUM = 8;
export const MANUAL_MATCH_NUM = 1;
export const SYSTEM_MATCH_VALID_AFTER_MINS = 24 * 60;
export const MANUAL_MATCH_VALID_AFTER_MINS = 1;
export const PERSONALITY_SCORE_MAX = 10;
export const MAX_INTIMACY_LEVEL = 1000;
export const MAX_INTIMACY_BOX_NUM = 8;
