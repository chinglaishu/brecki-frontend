import React, {FC, useEffect, useState} from "react";
import { Text, View, LayoutAnimation, NativeModules } from "react-native";
import { ButtonText, SlideText, SlideTitle, Title } from "../../component/text";
import { ContainerView, SlideTitleContainer } from "../../component/view";
import { ContextObj, Language, MultiLanguage, PageProps } from "../../type/common";
import { ContextConsumer } from "../../utils/context";
import Carousel from 'react-native-snap-carousel';
import { Slide } from "./Slide";
import imageLoader from "../../utils/imageLoader";
import { SCREEN } from "../../constant/constant";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { BORDER_RADIUS, EXTRA_BORDER_RADIUS } from "../../utils/size";
import { ButtonTouchable, RoundTouchable } from "../../component/touchable";
import { T } from "../../utils/translate";

const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

export type UseSlide = {
  screen: SCREEN,
  slideImage: any,
  titleMultiLang: MultiLanguage,
  descriptionOneMultiLang: MultiLanguage,
  descriptionTwoMultiLang: MultiLanguage,
};

const useSlides: UseSlide[] = [
  {
    screen: SCREEN.QUESTION,
    slideImage: imageLoader.slide_question,
    titleMultiLang: T.SCREEN_QUESTION,
    descriptionOneMultiLang: T.SCREEN_QUESTION_DESCRIPTION_1,
    descriptionTwoMultiLang: T.SCREEN_QUESTION_DESCRIPTION_2,
  },
  {
    screen: SCREEN.SYSTEM_LIKE_ZONE,
    slideImage: imageLoader.slide_likezone,
    titleMultiLang: T.SCREEN_LIKE_ZONE,
    descriptionOneMultiLang: T.SCREEN_LIKE_ZONE_DESCRIPTION_1,
    descriptionTwoMultiLang: T.SCREEN_LIKE_ZONE_DESCRIPTION_2,
  },
  {
    screen: SCREEN.CHAT_LIST,
    slideImage: imageLoader.slide_chat,
    titleMultiLang: T.SCREEN_CHAT,
    descriptionOneMultiLang: T.SCREEN_CHAT_DESCRIPTION_1,
    descriptionTwoMultiLang: T.SCREEN_CHAT_DESCRIPTION_2,
  },
];

export const Home: FC<PageProps> = ({navigation}) => {

  const [slideIndex, setSlideIndex] = useState(0);

  // useEffect(() => {
  //   changeSlideIndex(0);
  // }, []);

  const changeSlideIndex = (index: number) => {
    if (Math.abs(slideIndex - index) > 1) {
      // seems have animation may break layout
      setSlideIndex(index);
    } else {
      // LayoutAnimation.spring();
      setSlideIndex(index);
    }
  };

  const getContent = (contextObj: ContextObj) => {
    const {theme, user} = contextObj;
    const {language} = user;

    const onPressSlide = () => {
      const useSlide = useSlides[slideIndex];
      const {screen} = useSlide;
      navigation.navigate(screen, {userId: user.id});
    };

    const useSlide = useSlides[slideIndex];
    const {titleMultiLang, descriptionOneMultiLang, descriptionTwoMultiLang, screen} = useSlide;
    // const useColor = (screen === SCREEN.QUESTION) ? theme.primary : theme.secondary;
    const useColor = theme.secondary;
    return (
      <ContainerView>
        <Slide useSlides={useSlides} slideIndex={slideIndex} setSlideIndex={changeSlideIndex}
          onPressEvent={onPressSlide} />
        <ContainerView style={{marginTop: -hp(15), backgroundColor: useColor,
          borderTopLeftRadius: EXTRA_BORDER_RADIUS, borderTopRightRadius: EXTRA_BORDER_RADIUS,
          width: wp(90), justifyContent: "flex-start"}}>
          <SlideTitleContainer style={{position: "absolute", top: -hp(1.75), borderColor: useColor}}>
            <SlideTitle style={{color: useColor}}>{titleMultiLang[language]}</SlideTitle>
          </SlideTitleContainer>
          <SlideText style={{marginTop: hp(5.5)}}>
            {descriptionOneMultiLang[language]}
          </SlideText>
          <Text style={{color: theme.onSecondary, fontSize: hp(2), marginTop: hp(0.5), opacity: 0.5}}>
            {descriptionTwoMultiLang[language]}
          </Text>
        </ContainerView>
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
