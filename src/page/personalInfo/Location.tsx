import React, {Children, FC, useEffect, useRef, useState} from "react";
import { Image, KeyboardAvoidingView, Text, View, NativeModules, LayoutAnimation } from "react-native";
import Modal from "react-native-modal";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { ContextObj, PersonalInfoLocation } from "../../type/common";
import { ContextConsumer } from "../../utils/context";
import imageLoader from "../../utils/imageLoader";
import { checkIsWeb } from "../../utils/utilFunction";
import { ContainerView, ModalScrollView, RowView, ModalView, PlainRowView, RoundInputContainer } from "../../component/view";
import LottieView from "lottie-react-native";
import { ButtonTouchable, PlainTouchable, RoundTouchable, SimpleTouchable } from "../../component/touchable";
import SmoothPicker from "react-native-smooth-picker";
import { T } from "../../utils/translate";
import { ButtonText } from "../../component/text";
import * as Location from 'expo-location';
import { RoundInput } from "../../component/input";
import { FormatedLocationData, getByLatLngAndFilter, searchByNameAndFilter } from "./helper";
import { NormalSpinner } from "../../component/spinner";
import { getByPlaceId } from "../../request/googleLocation";

const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

export type LocationModalProps = {
  isVisible: boolean,
  onPressEvent: any,
  closeModal: any,
  initialValue: any,
};

export type LocationProps = {
  value: any,
  text: any,
  onPressEvent: any,
  extraStyle: any,
  textStyle: any,
};

export const LocationModal: FC<LocationModalProps> = ({isVisible, onPressEvent, closeModal, initialValue}) => {
  if (checkIsWeb()) {return null; }

  const [searchValue, setSearchValue] = useState("");
  // currentValue = placeId
  const [currentValue, setCurrentValue] = useState(initialValue);
  const [locationList, setLocationList] = useState([] as FormatedLocationData[]);
  const [isLoading, setIsLoading] = useState(false);

  const changeLocationList = (useLocationList: FormatedLocationData[]) => {
    // LayoutAnimation.linear();
    setLocationList(useLocationList);
  };

  const refreshSearch = async () => {
    setIsLoading(true);
    const useLocationList = await searchByNameAndFilter(searchValue);
    changeLocationList(useLocationList);
    setIsLoading(false);
  };

  const changeSearchValue = (value: any) => {
    setIsLoading(true);
    setSearchValue(value);
  }

  useEffect(() => {
    refreshSearch();
  }, [searchValue]);

  useEffect(() => {
    setSearchValue("");
    setCurrentValue(initialValue);
    setLocationList([]);
  }, [initialValue, isVisible]);

  const useCurrentLocation = async () => {
    try {
      setIsLoading(true);
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log("error, no location");
        return;
      }
      let location = await Location.getCurrentPositionAsync({accuracy: 1});
      const {coords} = location;
      const {latitude, longitude} = coords;
      const useLocationList = await getByLatLngAndFilter(latitude, longitude);
      changeLocationList(useLocationList);
      setIsLoading(false);
    } catch (err) {
      console.log("error");
      console.log(err);
    }
  };



  const onPressButton = async () => {
    // format location data
    if (!currentValue) {return; }
    const getZHResult = await getByPlaceId(currentValue, "zh-tw");
    const getENResult = await getByPlaceId(currentValue, "en");
    const location: PersonalInfoLocation = {
      placeId: currentValue,
      name: {
        en: getENResult?.data?.result?.formatted_address,
        zh: getZHResult?.data?.result?.formatted_address,
      },
    };
    onPressEvent(location);
    closeModal();
  }

  const getContent = (contextObj: ContextObj) => {
    const {theme, user} = contextObj;
    const {language} = user;

    const getItem = (location: FormatedLocationData, currentValue: any, index: number) => {

      const {placeId, name} = location;
      const borderColor = (placeId === currentValue) ? theme.opacitySecondary : theme.subText;
      const color = (placeId === currentValue) ? theme.secondary : theme.subText;
      const fontSize = (placeId === currentValue) ? hp(2.25) : hp(2);
      const marginTop = hp(1.5);
      return (
        <PlainTouchable activeOpacity={0.6} onPress={() => setCurrentValue(placeId)} style={{marginTop, paddingHorizontal: wp(4)}}>
          <RowView style={{borderColor, borderBottomWidth: 2, justifyContent: "flex-start"}}>
            <Text style={{color, fontSize}}>{name}</Text>
          </RowView>
        </PlainTouchable>
      );
    };

    const getCurrentLocationRow = () => {
      const borderColor = theme.subText;
      const color = theme.onSecondary;
      const fontSize = hp(2.1);
      const marginTop = hp(1.5);
      return (
        <RoundTouchable activeOpacity={0.6} onPress={() => useCurrentLocation()} style={{marginTop, marginHorizontal: wp(2)}}>
          <RowView style={{}}>
            <Image source={imageLoader.location} style={{width: hp(2.1), height: hp(2.1), marginRight: wp(1)}} />
            <Text style={{color, fontSize}}>{T.USE_CURRENT_LOCATION[language]}</Text>
          </RowView>
        </RoundTouchable>
      );
    };

    const getNoResult = () => {
      const color = theme.subText;
      const fontSize = hp(2);
      const marginTop = hp(1.5);
      if (isLoading) {return null; }
      return (
        <RowView style={{marginTop, paddingHorizontal: wp(4)}}>
          <RowView style={{justifyContent: "flex-start"}}>
            <Text style={{color, fontSize}}>{T.NO_RESULT[language]}</Text>
          </RowView>
        </RowView>
      );
    }

    const isShowNoResult = !isLoading && (locationList.length === 0 && searchValue !== "" && searchValue) || isLoading;
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
        <View style={{width: wp(60), maxHeight: hp(40)}}>
          <ModalScrollView contentContainerStyle={{paddingVertical: hp(2)}}>
            <RoundInputContainer style={{marginHorizontal: wp(2)}}>
              <RoundInput style={{color: theme.secondary, paddingHorizontal: wp(5), flex: 1}}
                onChange={(e: any) => changeSearchValue(e.nativeEvent.text)}
                placeholder={T.SEARCH_LOCATION[language]} underlineColorAndroid={"transparent"} />
              <Image source={imageLoader.search} style={{width: hp(2.25), height: hp(2.25)}} />
            </RoundInputContainer>
            {getCurrentLocationRow()}
            {isLoading &&
              <NormalSpinner />
            }
            {isShowNoResult && getNoResult()}
            {locationList.map((location, index: number) => {
              return getItem(location, currentValue, index);
            })}
          </ModalScrollView>
        </View>
        <ButtonTouchable style={{marginTop: hp(1.5), elevation: 0}} activeOpacity={0.6}
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
