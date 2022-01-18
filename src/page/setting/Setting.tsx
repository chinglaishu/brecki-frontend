import React, {FC, useState} from "react";
import { Image, Switch, Text, View } from "react-native";
import { Title } from "../../component/text";
import { ContainerView, ThreePartRow } from "../../component/view";
import { ContextObj, PageProps, StackPageProps } from "../../type/common";
import { ContextConsumer } from "../../utils/context";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { BORDER_RADIUS } from "../../utils/size";
import imageLoader from "../../utils/imageLoader";
import { T } from "../../utils/translate";
import { SCREEN } from "../../constant/constant";
import { PlainTouchable } from "../../component/touchable";

export const Setting: FC<StackPageProps> = ({navigation}) => {
  const borderBottomWidth = 1;
  const imageSize = hp(3);

  const [notification, setNotification] = useState(true);
  const [isLightTheme, setIsLightTheme] = useState(false);

  const getContent = (contextObj: ContextObj) => {
    const {theme, user, setUseNavigation} = contextObj;
    const {language} = user;

    const doNavigation = (screen: SCREEN) => {
      return;
      setUseNavigation({navigation: navigation});
      navigation.navigate(screen);
    };

    const getText = (text: string) => {
      return (
        <Text style={{fontSize: hp(1.8)}}>{text}</Text>
      );
    };

    const getNavigateRow = (image: any, text: string, screen: SCREEN, borderBottomWidth: number) => {
      return (
        <PlainTouchable activeOpacity={0.6} onPress={() => doNavigation(screen)}>
          <ThreePartRow height={hp(8)} extraStyle={{padding: wp(2), borderBottomWidth,
              marginBottom: hp(1), borderColor: theme.border, paddingRight: wp(5)}} 
            Left={<Image source={image} style={{width: imageSize * 0.9, height: imageSize * 0.9, marginRight: imageSize * 0.1}} />}
            Body={getText(text)}
            Right={false && <PlainTouchable activeOpacity={0.6} onPress={() => doNavigation(screen)}>
              <Image source={imageLoader.next} style={{width: imageSize, height: imageSize}} />
            </PlainTouchable>}
          />
        </PlainTouchable>
      );
    };

    const getToggleRow = (image: any, text: string, value: boolean, setValue: any, borderBottomWidth: number) => {
      return (
        <ThreePartRow height={hp(8)} extraStyle={{padding: wp(2), paddingRight: wp(5), borderBottomWidth, borderColor: theme.border,
          marginBottom: hp(1)}}
          Left={<Image source={image} style={{width: imageSize, height: imageSize}} />}
          Body={getText(text)}
          Right={<Switch trackColor={{ false: theme.empty, true: theme.secondary}}
            value={value} onValueChange={(value: boolean) => setValue(value)} />}
        />
      );
    };

    return (
      <ContainerView style={{justifyContent: "flex-start", paddingTop: hp(1)}}>
        {getNavigateRow(imageLoader.account, T.SETTING_ACCOUNT[language], SCREEN.ACCOUNT, borderBottomWidth)}
        {getToggleRow(imageLoader.notification, T.SETTING_NOTIFICATION[language], notification, setNotification, borderBottomWidth)}
        {getToggleRow(imageLoader.moon, T.SETTING_THEME[language], isLightTheme, setIsLightTheme, borderBottomWidth)}
      </ContainerView>
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
