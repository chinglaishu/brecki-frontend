import React, {Children, FC, useEffect, useRef, useState} from "react";
import { Image, Text, View } from "react-native";
import Modal from "react-native-modal";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { MODAL_HANDLE_TYPE, STATUS_TYPE } from "../constant/constant";
import { ContextObj } from "../type/common";
import { ContextConsumer } from "../utils/context";
import imageLoader from "../utils/imageLoader";
import { checkIsWeb } from "../utils/utilFunction";
import { ContainerView, ModalView, RowView } from "./view";
import LottieView from "lottie-react-native";

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
  }, [initialValue]);

  const getItem = (selectContent: SelectContent, currentValue: any) => {

    return (
      <RowView>
        <Text>{selectContent.text}</Text>
      </RowView>
    )
  };

  const getContent = (contextObj: ContextObj) => {
    const {theme} = contextObj;
    return (
      <Modal isVisible={isVisible || false} style={{margin: 0, justifyContent: "center", alignItems: "center"}}
        onBackButtonPress={() => closeModal()}
        onBackdropPress={() => closeModal()}
        animationIn="fadeInUp" animationOut="fadeOutDown"
        animationInTiming={1000}
        animationOutTiming={500}
        deviceHeight={hp(100)} deviceWidth={wp(100)}
        backdropOpacity={0.4}>
        <ModalView style={{padding: wp(2)}}>
          {selectContentList.map((selectContent) => {
            return getItem(selectContent, currentValue);
          })}
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

export const StatusModal: FC<StatusModalProps> = ({title, message, isVisible, closeModal, statusType, handleType}) => {
  if (checkIsWeb()) {return null; }

  useEffect(() => {
    if (!isVisible) {return; }
    if (handleType === MODAL_HANDLE_TYPE.SHORT_CLOSE || handleType === MODAL_HANDLE_TYPE.LONG_CLOSE) {
      setTimeout(() => closeModal(), handleType);
    }
  }, [isVisible, handleType]);

  const lottieViewRef = useRef(null);
  const lottieSource = (statusType === "loading") ? imageLoader.lottie_loading
    : (statusType === "success") ? imageLoader.lottie_success_drawing : imageLoader.lottie_fail_drawing;

  const getContent = (contextObj: ContextObj) => {
    const {theme} = contextObj;
    return (
      <Modal isVisible={isVisible || false} style={{margin: 0, justifyContent: "center", alignItems: "center"}}
        onBackButtonPress={() => closeModal()}
        onBackdropPress={() => closeModal()}
        animationIn="fadeInUp" animationOut="fadeOutDown"
        animationInTiming={1000}
        animationOutTiming={500}
        deviceHeight={hp(100)} deviceWidth={wp(100)}
        backdropOpacity={0.4}>
        <ModalView style={{padding: wp(2), maxWidth: wp(80)}}>
          <LottieView
            ref={lottieViewRef}
            style={{
              width: wp(40),
              height: wp(40),
            }}
            source={lottieSource}
            autoPlay
            loop={statusType === "loading"}
          />
          <Text>{title}</Text>
          <Text>{message}</Text>
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
