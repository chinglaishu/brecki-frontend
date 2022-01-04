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
  const imageSize = hp(6);

  const [notification, setNotification] = useState(false);
  const [isLightTheme, setIsLightTheme] = useState(false);

  const getContent = (contextObj: ContextObj) => {
    const {theme, user, setUseNavigation} = contextObj;
    const {language} = user;

    const doNavigation = (screen: SCREEN) => {
      setUseNavigation({navigation: navigation, backScreen: SCREEN.SETTING});
      navigation.navigate(screen);
    };

    const getNavigateRow = (image: any, text: string, screen: SCREEN, borderBottomWidth: number) => {
      return (
        <ThreePartRow height={hp(10)} extraStyle={{padding: wp(2), paddingRight: wp(1), borderBottomWidth, marginBottom: hp(1), borderColor: theme.border}} 
          Left={<Image source={image} style={{width: imageSize, height: imageSize}} />}
          Body={<Text>{text}</Text>}
          Right={<PlainTouchable activeOpacity={0.6} onPress={() => doNavigation(screen)}>
            <Image source={imageLoader.mic} style={{width: imageSize, height: imageSize}} />
          </PlainTouchable>}
        />
      );
    };

    const getToggleRow = (image: any, text: string, value: boolean, setValue: any, borderBottomWidth: number) => {
      return (
        <ThreePartRow height={hp(10)} extraStyle={{padding: wp(2), paddingRight: wp(1), borderBottomWidth, borderColor: theme.border,
          marginBottom: hp(1)}}
          Left={<Image source={image} style={{width: imageSize, height: imageSize}} />}
          Body={<Text>{text}</Text>}
          Right={<Switch trackColor={{ false: theme.empty, true: theme.secondary}}
            value={value} onValueChange={(value: boolean) => setValue(value)} />}
        />
      );
    };

    return (
      <ContainerView>
        {getNavigateRow(imageLoader.username, T.SETTING_ACCOUNT[language], SCREEN.ACCOUNT, borderBottomWidth)}
        {getToggleRow(imageLoader.camera, T.SETTING_NOTIFICATION[language], notification, setNotification, borderBottomWidth)}
        {getToggleRow(imageLoader.mic, T.SETTING_THEME[language], isLightTheme, setIsLightTheme, borderBottomWidth)}

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
