import React, {Children, FC, useEffect, useRef, useState} from "react";
import { Image, Text, View } from "react-native";
import Modal from "react-native-modal";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { MODAL_HANDLE_TYPE, STATUS_TYPE } from "../constant/constant";
import { ContextObj } from "../type/common";
import { ContextConsumer } from "../utils/context";
import imageLoader from "../utils/imageLoader";
import { checkIsIOS, checkIsWeb } from "../utils/utilFunction";
import { ContainerView, ModalScrollView, RowView, ModalView } from "./view";
import LottieView from "lottie-react-native";
import { ButtonTouchable, PlainTouchable, RoundTouchable } from "./touchable";
import SmoothPicker from "react-native-smooth-picker";
import { T } from "../utils/translate";
import { ButtonText, Title } from "./text";
import * as Location from 'expo-location';
import { BORDER_RADIUS } from "../utils/size";
import { LinearGradient } from 'expo-linear-gradient';

export type SelectContent = {
  value: any,
  text: string,
  description?: any,
}

export type SelectModalProps = {
  isVisible: boolean,
  onPressEvent: any,
  closeModal: any,
  initialValue: any,
  selectContentList: SelectContent[],
};

export type StatusModalProps = {
  isVisible?: boolean,
  statusType?: STATUS_TYPE,
  closeModal?: any,
  title?: string,
  message?: string,
  handleType?: MODAL_HANDLE_TYPE,
};

export const SelectModal: FC<SelectModalProps> = ({isVisible, onPressEvent, closeModal, initialValue, selectContentList}) => {
  if (checkIsWeb()) {return null; }

  const [currentValue, setCurrentValue] = useState(initialValue);

  useEffect(() => {
    setCurrentValue(initialValue);
  }, [initialValue, isVisible]);

  const onPressButton = () => {
    onPressEvent(currentValue);
    closeModal();
  }

  const getContent = (contextObj: ContextObj) => {
    const {theme, user} = contextObj;
    const {language} = user;

    const getItem = (selectContent: SelectContent, currentValue: any, index: number) => {
      const {text, value, description} = selectContent;
      const borderColor = (value === currentValue) ? theme.opacitySecondary : "#00000000";
      const color = (value === currentValue) ? theme.secondary : theme.subText;
      const fontSize = (value === currentValue) ? hp(2.4) : hp(2);
      const paddingTop = index === 0 ? 0 : hp(1.5);
      return (
        <PlainTouchable activeOpacity={0.6} onPress={() => setCurrentValue(value)}
          style={{borderColor, borderTopWidth: 2, borderBottomWidth: 2, paddingVertical: hp(0.5)}}>
          <RowView style={{}}>
            <Text style={{color, fontSize}}>{text}</Text>
            <Text style={{color, fontSize}}>{description}</Text>
          </RowView>
        </PlainTouchable>
      )
    };

    return (
      <Modal isVisible={isVisible || false} style={{margin: 0, justifyContent: "center", alignItems: "center"}}
        onBackButtonPress={() => closeModal()}
        onBackdropPress={() => closeModal()}
        animationIn="fadeInUp" animationOut="fadeOutDown"
        backdropTransitionOutTiming={0}
        animationInTiming={500}
        animationOutTiming={500}
        hideModalContentWhileAnimating={true}
        deviceHeight={hp(100)} deviceWidth={wp(100)}
        backdropOpacity={0.6}>
        <ModalView style={{width: wp(50), maxHeight: hp(30)}}>
          <ModalScrollView contentContainerStyle={{paddingVertical: hp(1)}}>
            {selectContentList.map((selectContent, index: number) => {
              return getItem(selectContent, currentValue, index);
            })}
          </ModalScrollView>
        </ModalView>
        <ButtonTouchable style={{marginTop: hp(1.5), elevation: 0, shadowOpacity: 0}} activeOpacity={0.6}
          onPress={() => onPressButton()}>
          <ButtonText>
            {T.CONFIRM[language]}
          </ButtonText>
        </ButtonTouchable>
      </Modal>
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

export const StatusModal: FC<StatusModalProps> = ({title, message, isVisible, closeModal, statusType, handleType}) => {
  if (checkIsWeb()) {return null; }

  const doCloseModal = (isCheckType: boolean) => {
    if (isCheckType && statusType === STATUS_TYPE.LOADING) {
      return;
    } else {
      closeModal();
    }
  }

  useEffect(() => {
    console.log(`isVi:${isVisible}, handle typ: ${handleType}`)
    if (!isVisible) {return; }
    if (handleType === MODAL_HANDLE_TYPE.SHORT_CLOSE || handleType === MODAL_HANDLE_TYPE.LONG_CLOSE) {
      console.log("set time out");
      setTimeout(() => doCloseModal(false), handleType * 1000);
    }
  }, [isVisible, handleType]);

  const getLottieSource = (statusType?: STATUS_TYPE) => {
    if (statusType === "loading") {return imageLoader.lottie_loading; }
    if (statusType === "success") {return imageLoader.lottie_success_drawing; }
    if (statusType === "info") {return imageLoader.lottie_info; }
    return imageLoader.lottie_fail_drawing;
  }

  const lottieViewRef = useRef(null);
  const lottieSource = getLottieSource(statusType);

  const isLoading = statusType === "loading";

  const width = isLoading ? wp(50) : wp(75);

  const getContent = (contextObj: ContextObj) => {
    const {theme} = contextObj;
    return (
      <Modal isVisible={isVisible || false} style={{margin: 0, justifyContent: "center", alignItems: "center"}}
        onBackButtonPress={() => doCloseModal(true)}
        onBackdropPress={() => doCloseModal(true)}
        animationIn="fadeInUp" animationOut="fadeOutDown"
        animationInTiming={500}
        animationOutTiming={500}
        backdropTransitionOutTiming={0}
        hideModalContentWhileAnimating={true}
        deviceHeight={hp(100)} deviceWidth={wp(100)}
        backdropOpacity={0.4}>
        <ModalView style={{padding: wp(0), width, backgroundColor: theme.secondary,
          borderWidth: 4, borderColor: theme.onPrimary}}>
          <LottieView
            ref={lottieViewRef}
            style={{
              width: wp(40),
              height: wp(40),
            }}
            source={lottieSource}
            autoPlay
            loop={statusType === "loading" || statusType === "info"}
          />
          {!isLoading && <LinearGradient colors={["#00000000", "#00000060", "#00000000"]} style={{width: "95%", flexDirection: "row", justifyContent: "center", paddingVertical: hp(0.5)}}
            start={[0, 1]} end={[1, 0]}>
            <Title style={{color: theme.onSecondary, fontSize: hp(2.5)}}>{title}</Title>
          </LinearGradient>}
          {!isLoading && <Text style={{paddingHorizontal: wp(5), fontSize: hp(2), color: theme.onSecondary,
            marginVertical: hp(3), textAlign: "center"}}>{message}</Text>}
        </ModalView>
      </Modal>
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

type NormalModalProps = {
  isVisible: boolean,
  children: any,
};

export const NormalModal: FC<NormalModalProps> = ({isVisible, children}) => {
  if (checkIsWeb()) {return null; }

  const [updateFlag, setUpdateFlag] = useState(true);

  useEffect(() => {
    if (isVisible && updateFlag && checkIsIOS()) {
      setTimeout(() => setUpdateFlag(false), 1000);
    }
  }, [isVisible]);

  const getContent = (contextObj: ContextObj) => {
    const {theme, user} = contextObj;
    const {language} = user;
    
    const useIsVisible = !updateFlag && isVisible;
    
    return (
      <Modal isVisible={useIsVisible || false} style={{margin: 0, justifyContent: "center", alignItems: "center"}}
        animationIn="fadeIn" animationOut="fadeOut"
        backdropTransitionOutTiming={0}
        animationInTiming={0}
        animationOutTiming={500}
        hideModalContentWhileAnimating={true}
        deviceHeight={hp(100)} deviceWidth={wp(100)}
        backdropOpacity={0.6}>
        {children}
      </Modal>
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
