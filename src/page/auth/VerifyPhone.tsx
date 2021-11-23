import React, {FC, useEffect, useRef, useState} from "react";
import { Image, KeyboardAvoidingView, StyleSheet, Text, View } from "react-native";
import { ButtonText, SubTitle, Reminder } from "../../component/text";
import { ContainerView } from "../../component/view";
import { AuthProps, ContextObj, PageProps } from "../../type/common";
import { ContextConsumer } from "../../utils/context";
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell } from 'react-native-confirmation-code-field';
import { AUTH_SCREEN, LAST_SCREEN_PARAM_KEY, MODAL_HANDLE_TYPE, SMS_CODE_DIGIT, STATUS_TYPE } from "../../constant/constant";
import { getCodeFieldStyle } from "./style";
import { ButtonTouchable } from "../../component/touchable";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { T } from "../../utils/translate";
import { TITLE_IMAGE_HEIGHT } from "../../utils/size";
import imageLoader from "../../utils/imageLoader";
import { checkIfRequestError, getLastScreenNavigationParam, getParamFromNavigation } from "../../utils/utilFunction";
import { requestToken, signup, verifyPhone, verifySMSOnly } from "../../request/auth";
import { RM } from "../../utils/requestMessage";
import { loginAction } from "./helper";

export const VerifyPhone: FC<AuthProps> = ({navigation}) => {
  const [codeFieldValue, setCodeFieldValue] = useState("");
  const codeFieldRef = useBlurOnFulfill({ value: codeFieldValue, cellCount: SMS_CODE_DIGIT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: codeFieldValue,
    setValue: setCodeFieldValue,
  });

  const [resendCountDown, setResendCountDown] = useState(0);

  const countDown = () => {
    if (resendCountDown > 0) {
      setResendCountDown(resendCountDown - 1);
    }
  }

  useEffect(() => {
    setTimeout(() => countDown(), 1000);
  }, [resendCountDown]);

  useEffect(() => {
    // console.log("set timer")
    // const countDownInterval = setInterval(() => countDown(), 1000);

    // return () => {
    //   clearInterval(countDownInterval);
    // }
  }, []);

  const getContent = (contextObj: ContextObj) => {
    const {user, theme, changeStatusModal, setUser} = contextObj;
    const {language} = user;
    const codeFieldStyle = getCodeFieldStyle(theme);

    const phone = getParamFromNavigation(navigation, "phone");
    const username = getParamFromNavigation(navigation, "username");
    const password = getParamFromNavigation(navigation, "password");
    const lastScreen: AUTH_SCREEN = getParamFromNavigation(navigation, LAST_SCREEN_PARAM_KEY);

    const isSignup = (lastScreen === AUTH_SCREEN.SIGN_UP);

    const onPressButton = async () => {

      changeStatusModal({statusType: STATUS_TYPE.LOADING});

      const result = (isSignup)
        ? await signup(username, password, phone, codeFieldValue)
        : await verifySMSOnly(phone, codeFieldValue);

      if (checkIfRequestError(result)) {
        changeStatusModal({statusType: STATUS_TYPE.ERROR, message: result?.data?.message});
        return;
      } else {
        const message = (lastScreen === AUTH_SCREEN.SIGN_UP) ? RM.SIGNUP_SUCCESS[language] : RM.VERIFICATION_SUCCESS[language];
        changeStatusModal({statusType: STATUS_TYPE.SUCCESS, message, handleType: MODAL_HANDLE_TYPE.SHORT_CLOSE});
      }

      if (lastScreen === AUTH_SCREEN.SIGN_UP) {
        await loginAction(result.data.data as any, setUser);
      } else {
        const param = getLastScreenNavigationParam(lastScreen);
        param.phone = phone;
        param.code = codeFieldValue;
        navigation.navigate(AUTH_SCREEN.RESET_PASSWORD, param);
      }
    };

    const onPressResendButton = async () => {
      const result = await requestToken(phone, false);
      if (checkIfRequestError(result)) {
        changeStatusModal({statusType: STATUS_TYPE.ERROR, message: result?.data?.message});
        return;
      }
      setResendCountDown(30);
    };

    const onPressFooterButton = () => {
      navigation.navigate(AUTH_SCREEN.LOGIN);
    };

    const resendCountDownText = (resendCountDown > 0) ? ` (${String(resendCountDown)})` : "";
    return (
      <ContainerView>
        <ContainerView>
          <Image source={imageLoader.text_verification} style={{width: TITLE_IMAGE_HEIGHT * 9.5, height: TITLE_IMAGE_HEIGHT,
            marginBottom: hp(6), marginTop: hp(2)}} />
          <Reminder style={{paddingHorizontal: wp(15), marginBottom: hp(12)}}>
            {T.VERIFICATION_REMIND[language]}
          </Reminder>
          <CodeField
            ref={codeFieldRef}
            {...props}
            value={codeFieldValue}
            onChangeText={setCodeFieldValue}
            cellCount={SMS_CODE_DIGIT}
            rootStyle={codeFieldStyle.codeFieldRoot}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            renderCell={({ index, symbol, isFocused }) => (
              <View
                onLayout={getCellOnLayoutHandler(index)}
                key={index}
                style={[codeFieldStyle.cellRoot, isFocused && codeFieldStyle.focusCell]}>
                <Text style={codeFieldStyle.cellText}>
                  {symbol || (isFocused ? <Cursor /> : null)}
                </Text>
              </View>
            )} 
          />
          <ButtonTouchable activeOpacity={0.5} style={{marginBottom: hp(2), marginTop: hp(8)}}
            onPress={() => onPressButton()}>
            <ButtonText>{T.CONFIRM[language]}</ButtonText>
          </ButtonTouchable>

          <ButtonTouchable disabled={resendCountDown > 0} activeOpacity={0.5} style={{marginBottom: hp(2), backgroundColor: theme.subText}}
            onPress={() => onPressResendButton()}>
            <ButtonText>{`${T.RESEND[language]}${resendCountDownText}`}</ButtonText>
          </ButtonTouchable>
        </ContainerView>

        <View>
          <SubTitle>{T.GO_LOGIN[language]}</SubTitle>
          <ButtonTouchable activeOpacity={0.5} style={{marginBottom: hp(2), marginTop: hp(1), backgroundColor: theme.subText}}
            onPress={() => onPressFooterButton()}>
            <ButtonText>{T.LOGIN[language]}</ButtonText>
          </ButtonTouchable>
        </View>
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
