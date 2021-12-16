import React, {FC, useState} from "react";
import { Image, Text, Touchable, View, NativeModules, LayoutAnimation, Platform } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { ButtonLikeTextInput } from "../../component/input";
import { Select } from "../../component/select";
import { ButtonText, LineTextLine, Title } from "../../component/text";
import { ButtonTouchable, ProfileImageTouchable } from "../../component/touchable";
import { ContainerView, RowView } from "../../component/view";
import { SEX_NUM_REF, STATUS_TYPE } from "../../constant/constant";
import { updatePersonalInfo, uploadProfilePicOne, uploadProfilePicTwo } from "../../request/user";
import { ContextObj, PageProps, PersonalInfo, PERSONAL_INFO_KEY, SetUserFunction, User } from "../../type/common";
import { ContextConsumer } from "../../utils/context";
import imageLoader from "../../utils/imageLoader";
import { RM } from "../../utils/requestMessage";
import { BORDER_RADIUS } from "../../utils/size";
import { T } from "../../utils/translate";
import { checkIfRequestError } from "../../utils/utilFunction";

const { UIManager } = NativeModules;

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
}
export type ProfilePicProps = {
  getValue: (user: User, key: PERSONAL_INFO_KEY) => any,
  onChangeInfoData: (key: PERSONAL_INFO_KEY, value: any, extraData: any) => any,
};

export const ProfilePic: FC<ProfilePicProps> = ({getValue, onChangeInfoData}) => {
  
  const [isSwipe, setIsSwipe] = useState(false);

  const changeIsSwipe = () => {
    LayoutAnimation.spring();
    setIsSwipe(!isSwipe);
  }

  const paddingTop = hp(10);
  const profileImageOffset = hp(2.5);

  const getPos = (isFront: boolean) => {
    return {
      position: (isFront) ? "static" : "absolute",
      left: (isFront) ? 0 : wp(25) + profileImageOffset,
      top: (isFront) ? 0 : paddingTop - profileImageOffset,
      zIndex: (isFront) ? 1 : -1,
    };
  };

  const getContent = (contextObj: ContextObj) => {
    const {theme, user, changeStatusModal, setUser} = contextObj;
    const {language} = user;

    const setProfilePicOne = async (base64: string, fileType: string) => {
      changeStatusModal({statusType: STATUS_TYPE.LOADING});
      const result = await uploadProfilePicOne(base64, fileType);
      if (checkIfRequestError(result)) {
        changeStatusModal({statusType: STATUS_TYPE.ERROR, message: RM.REQUEST_FAIL[language]});
        return;
      } else {
        changeStatusModal({statusType: STATUS_TYPE.SUCCESS});
      }
      onChangeInfoData("profilePicOneUrl", result.data.data, {profilePicOneFileType: fileType});
    };
  
    const setProfilePicTwo = async (base64: string, fileType: string) => {
      changeStatusModal({statusType: STATUS_TYPE.LOADING});
      const result = await uploadProfilePicTwo(base64, fileType);
      if (checkIfRequestError(result)) {
        changeStatusModal({statusType: STATUS_TYPE.ERROR, message: RM.REQUEST_FAIL[language]});
        return;
      } else {
        changeStatusModal({statusType: STATUS_TYPE.SUCCESS});
      }
      onChangeInfoData("profilePicTwoUrl", result.data.data, {profilePicTwoFileType: fileType});
    };

    const useImage = (isSwipe) ? imageLoader.face_white : imageLoader.happy_white;
    const text = (isSwipe) ? T.REAL_FACE[language] : T.ANY_IMAGE[language];

    const size = hp(2);
    const sizeTwo = hp(1.8);

    const aIsFront = !isSwipe;

    const posA = getPos(aIsFront);
    const posB = getPos(!aIsFront);

    const profilePicOne = getValue(user, "profilePicOneUrl");
    const profilePicTwo = getValue(user, "profilePicTwoUrl");

    return (
      <>
        <ProfileImageTouchable imageSource={profilePicOne}
          isFront={aIsFront} extraStyle={{...posA}} swipeFunction={changeIsSwipe}
          isProfilePicOne={true} setProfilePic={(base64: string, fileType: string) => setProfilePicOne(base64, fileType)} />
        <ProfileImageTouchable imageSource={profilePicTwo} 
          extraStyle={{...posB}} isFront={!aIsFront} swipeFunction={changeIsSwipe}
          isProfilePicOne={false} setProfilePic={(base64: string, fileType: string) => setProfilePicTwo(base64, fileType)} />

        <TouchableOpacity activeOpacity={0.5} onPress={() => changeIsSwipe()}>
          <RowView style={{marginTop: hp(0.5), opacity: 0.8}}>
            <Image source={useImage} style={{width: size, height: size, marginRight: wp(1)}} />
            <Text style={{fontSize: size, color: theme.onPrimary}}>
              {text}
            </Text>
            <Image source={imageLoader.change_white} style={{width: sizeTwo, height: sizeTwo, marginLeft: wp(1)}} />
          </RowView>
        </TouchableOpacity>
      </>
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
