import React, {FC, useRef, useState} from "react";
import { Image, Text, View } from "react-native";
import Modal from "react-native-modal";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { STATUS_TYPE } from "../constant/constant";
import { ContextObj } from "../type/common";
import { ContextConsumer } from "../utils/context";
import imageLoader from "../utils/imageLoader";
import { checkIsWeb } from "../utils/utilFunction";
import { ContainerView } from "./view";
import LottieView from "lottie-react-native";

export type NormalModalProps = {
  isVisible: boolean,
  onPressEvent: any,
  setIsModalVisible: any,
};

export type StatusModalProps = {
  isVisible: boolean,
  statusType: STATUS_TYPE,
  closeModal?: any,
  title: string,
  message?: string,
};

export const NormalModal: FC<NormalModalProps> = ({isVisible, onPressEvent, setIsModalVisible}) => {
  if (checkIsWeb()) {return null; }

  return (
    <Modal isVisible={isVisible || false} style={{margin: 0}}
      onBackButtonPress={() => setIsModalVisible(false)}
      animationIn="fadeIn" backdropTransitionOutTiming={0}
      deviceHeight={hp(100)} deviceWidth={wp(100)}>
      <ContainerView>
        <Text>123</Text>
      </ContainerView>
    </Modal>
  );
};

export const StatusModal: FC<StatusModalProps> = ({title, message, isVisible, closeModal, statusType}) => {
  if (checkIsWeb()) {return null; }

  const lottieViewRef = useRef(null);
  const lottieSource = (statusType === "loading") ? imageLoader.lottie_loading
    : (statusType === "success") ? imageLoader.lottie_success : imageLoader.lottie_fail;

  const getContent = (contextObj: ContextObj) => {
    const {theme} = contextObj;
    return (
      <Modal isVisible={isVisible || false} style={{margin: 0, justifyContent: "center", alignItems: "center"}}
        onBackButtonPress={() => closeModal()}
        onBackdropPress={() => closeModal()}
        animationIn="slideInUp" backdropTransitionOutTiming={0}
        deviceHeight={hp(100)} deviceWidth={wp(100)}
        backdropOpacity={0.3}>
        <View style={{backgroundColor: "#00000070", width: wp(40), minHeight: hp(30)}}>
          <LottieView 
            ref={lottieViewRef}
            style={{
              width: 50,
              height: 50,
            }}
            source={lottieSource}
            autoPlay
          />
          <Text>{title}</Text>
          <Text>{message}</Text>
        </View>
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
