import React, {FC, useEffect, useRef, useState} from "react";
import { Image, Text, View, NativeModules, LayoutAnimation, KeyboardAvoidingView } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { NormalInput, PhoneInput } from "../../component/input";
import { ButtonText, LineTextLine, Reminder, SubTitle } from "../../component/text";
import { ButtonTouchable, ImageTouchable, SimpleTouchable } from "../../component/touchable";
import { ContainerView, RowView } from "../../component/view";
import { InputObj, InputObjKey, AuthProps, ContextObj, PageProps, R, User } from "../../type/common";
import { ContextConsumer } from "../../utils/context";
import imageLoader from "../../utils/imageLoader";
import { T } from "../../utils/translate";
import { GoogleAuth, checkAuthFormatError } from "../../utils/auth";
import { AUTH_SCREEN, STATUS_TYPE, STORE_KEY } from "../../constant/constant";
import { checkIfRequestError, checkIsIOS, getCurrentRouteName, getLastScreenNavigationParam, getPhone, setStoreData } from "../../utils/utilFunction";
import { checkHaveFormatError, getAuthContent, getAuthFormObjList, makeRequestByAuthScreen, requestAddNotificationToken } from "./helper";
import { setAxiosAuthorization, setAxiosLanguage } from "../../request/config";
import { LoginResponse, requestToken, verifyPhone } from "../../request/auth";
import { TITLE_IMAGE_HEIGHT } from "../../utils/size";
import { Form, FormObj } from "../../component/form";

const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

export const Auth: FC<AuthProps> = ({navigation}) => {

  useEffect(() => {
    // GoogleAuth.init();
  }, []);

  const usernameInputRef = useRef();
  const passwordInputRef = useRef();
  const confirmPasswordInputRef = useRef();
  const phoneNumberInputRef = useRef();

  const getContent = (contextObj: ContextObj) => {
    const {user, theme, changeStatusModal, setUser, loginAction} = contextObj;
    const {language} = user;

    const currentRouteName = getCurrentRouteName(navigation) as AUTH_SCREEN;

    console.log(`current route: ${currentRouteName}`)

    const useContent = getAuthContent(currentRouteName, language);
    const {titleImageSource, titleWidth, buttonText,
      footerText, footerButtonText, footerButtonRoute, isHideSocial,
      isHideFooter, viewMarginTop} = useContent;

    const formObjList: FormObj[] = getAuthFormObjList(currentRouteName, language, usernameInputRef,
      passwordInputRef, confirmPasswordInputRef, phoneNumberInputRef);

    const onPressButton = async (inputObj: InputObj) => {

      changeStatusModal({statusType: STATUS_TYPE.LOADING});
      const result = await makeRequestByAuthScreen(currentRouteName, inputObj);
      if (checkIfRequestError(result)) {
        console.log("is error");
        changeStatusModal({statusType: STATUS_TYPE.ERROR, message: result?.data?.message});
        return;
      } else {
        console.log("skip");
        changeStatusModal({statusType: STATUS_TYPE.SUCCESS, message: result?.data?.message});
        // changeStatusModal(STATUS_TYPE.CLOSE);
      }

      console.log(`current route: ${currentRouteName}`);

      if (currentRouteName === AUTH_SCREEN.LOGIN) {
        const data = result.data.data as LoginResponse;
        const {user, token} = data;
        setAxiosAuthorization(token);
        await setStoreData(STORE_KEY.ACCESS_TOKEN, token);
        console.log("request otken");
        const useUser = await requestAddNotificationToken(user);
        console.log(useUser);
        setAxiosLanguage(useUser.language);
        await loginAction(useUser);
      } else {
        const param = getLastScreenNavigationParam(currentRouteName);
        param.phone = getPhone(inputObj?.phoneRegionCode?.content, inputObj?.phoneNumber?.content);
        if (currentRouteName === AUTH_SCREEN.SIGN_UP) {
          param.username = inputObj?.username?.content;
          param.password = inputObj?.password?.content;
        }
        navigation.navigate(AUTH_SCREEN.VERIFY_PHONE, param); 
      }
    };

    const onPressFooterButton = () => {
      navigation.navigate(footerButtonRoute as string);
    };

    const bottomMarginBottom = (checkIsIOS()) ? hp(4) : hp(2);

    return (
      <ContainerView>
        <ContainerView style={{marginTop: viewMarginTop}}>
          {currentRouteName === AUTH_SCREEN.FORGET_PASSWORD &&
            <Image source={imageLoader.text_forget} style={{width: TITLE_IMAGE_HEIGHT * 5, height: TITLE_IMAGE_HEIGHT, marginBottom: hp(2), marginTop: hp(2)}} />
          }
          <Image source={titleImageSource} style={{width: titleWidth, height: TITLE_IMAGE_HEIGHT, marginBottom: hp(6)}} />

          {currentRouteName === AUTH_SCREEN.FORGET_PASSWORD &&
            <>
              <Image source={imageLoader.lock} style={{width: hp(12) * 0.76, height: hp(12), marginBottom: hp(2), marginTop: hp(2)}} />
              <Reminder style={{marginBottom: hp(2)}}>{"Please enter username and phone to verify"}</Reminder>
            </>
          }

          <Form formObjList={formObjList} submitFunction={onPressButton} buttonText={buttonText}
            buttonStyle={{marginTop: hp(2)}} />

          {currentRouteName === AUTH_SCREEN.LOGIN && 
            <SubTitle style={{color: theme.subText, marginTop: hp(1)}}
              onPress={() => navigation.navigate(AUTH_SCREEN.FORGET_PASSWORD)}>
              {T.FORGET_PASSWORD[language]}
            </SubTitle>
          }
        </ContainerView>

        {!isHideSocial &&
          <>
            <LineTextLine text={T.LOGIN_WITH[language]} extraStyle={{marginBottom: hp(3), marginTop: hp(8)}} />
            <ImageTouchable extraStyle={{marginBottom: hp(2)}} imageSource={imageLoader.google} text={T.CONTINUE_WITH_GOOGLE[language]} />
            <ImageTouchable extraStyle={{marginBottom: hp(6)}} imageSource={imageLoader.facebook} text={T.CONTINUE_WITH_FACEBOOK[language]} />
          </>}
        {!isHideFooter && <KeyboardAvoidingView behavior={"height"}>
          <SubTitle>{footerText}</SubTitle>
          <ButtonTouchable activeOpacity={0.5} style={{marginBottom: bottomMarginBottom, marginTop: hp(1), backgroundColor: theme.subText}}
            onPress={() => onPressFooterButton()}>
            <ButtonText>{footerButtonText}</ButtonText>
          </ButtonTouchable>
        </KeyboardAvoidingView>}

      </ContainerView>
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
