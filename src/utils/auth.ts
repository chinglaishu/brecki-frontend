import * as GoogleSignIn from "expo-google-sign-in"; 
import * as Facebook from 'expo-facebook';
import { InputObj, InputObjKey, Language } from "../type/common";
import { T } from "./translate";

export const USERNAME_LENGTH_MIN = 8;
export const USERNAME_LENGTH_MAX = 20;
export const PASSWORD_LENGTH_MIN = 8;
export const PASSWORD_LENGTH_MAX = 20;

export const checkAuthFormatError = (key: InputObjKey, language: Language, inputObj: InputObj) => {
  const content = inputObj[key]?.content;
  if (key === "username") {
    return checkUsernameFormatError(content, language);
  } else if (key === "password") {
    return checkPasswordFormatError(content, language);
  } else if (key === "confirmPassword") {
    const password = inputObj?.password.content;
    return checkConfirmPasswordFormatError(content, language, password);
  } else if (key === "phoneRegionCode") {
    return checkPhoneRegionCodeFormatError(content, language);
  } else if (key === "phoneNumber") {
    const phoneRegionCode = inputObj?.phoneRegionCode.content;
    return checkPhoneNumberFormatError(content, language, phoneRegionCode);
  }
  return "unexpected error when check format error";
};

const checkUsernameFormatError = (username: string, language: Language) => {
  if (username.length < USERNAME_LENGTH_MIN || username.length > USERNAME_LENGTH_MAX) {
    return T.AUTH_USERNAME_LENGTH[language];
  }
  if (username.includes(" ")) {
    return T.AUTH_USERNAME_CONTAIN_CHARACTER[language];
  }
  return false;
};

const checkPasswordFormatError = (password: string, language: Language) => {
  if (password.length < PASSWORD_LENGTH_MIN || password.length > PASSWORD_LENGTH_MAX) {
    return T.AUTH_PASSWORD_LENGTH[language];
  }
  if (password.includes(" ")) {
    return T.AUTH_PASSWORD_CONTAIN_CHARACTER[language];
  }
  return false;
};

const checkConfirmPasswordFormatError = (confirmPassword: string, language: Language, password: any) => {
  if (confirmPassword !== password) {
    return T.AUTH_CONFIRM_PASSWORD_NOT_MATCH[language];
  }
  return false;
};

const checkPhoneRegionCodeFormatError = (phoneRegionCode: string, langauge: Language) => {
  if (phoneRegionCode.length === 0) {
    return T.AUTH_PHONE_REGION_CODE_CAN_NOT_EMPTY[langauge];
  }
  return false;
};

const checkPhoneNumberFormatError = (phoneNumber: string, langauge: Language, phoneRegioncode: string) => {
  if (phoneRegioncode === "852" && phoneNumber.length !== 8) {
    return T.AUTH_PHONE_NUMBER_LENGTH[langauge];
  }
  return false;
}

export const GoogleAuth = {
  async init() {
    await GoogleSignIn.initAsync({
      clientId: "549401078361-i71620ipt8nljerc5r40lq2u2dmp4mlb.apps.googleusercontent.com",
    });
  },
  async login() {
    try {
      await GoogleSignIn.askForPlayServicesAsync();
      const {type, user} = await GoogleSignIn.signInAsync();
      if (type === "success") {
        console.log("success");
        console.log(user);
      }
    } catch (err) {
      console.log(err);
    }
  },
  async logout() {
    await GoogleSignIn.signOutAsync();
  },
};

export const FacebookAuth = {
  async login() {
    try {
      await Facebook.initializeAsync({
        appId: '<APP_ID>',
      });
      const result: any = await Facebook.logInWithReadPermissionsAsync({
        permissions: ['public_profile'],
      });
      console.log(result);
      const {type, token} = result;
      if (type === 'success') {
        // Get the user's name using Facebook's Graph API
        const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
        console.log(response);
      } else {
        // type === 'cancel'
      }
    } catch ({ message }) {
      alert(`Facebook Login Error: ${message}`);
    }
  },
  async logOut() {

  },
};
