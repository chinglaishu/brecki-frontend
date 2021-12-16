import React, {FC, useCallback, useRef, useState} from "react";
import { Image, Text, View } from "react-native";
import { Title } from "../../component/text";
import { ContainerView } from "../../component/view";
import { ContextObj, PageProps } from "../../type/common";
import { ContextConsumer } from "../../utils/context";
import Carousel from 'react-native-snap-carousel';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { BORDER_RADIUS, COMMON_ELEVATION, EXTRA_BORDER_RADIUS, EXTRA_ELEVATION } from "../../utils/size";
import imageLoader from "../../utils/imageLoader";
import { UseSlide } from "./Home";
import { PlainTouchable } from "../../component/touchable";

type SlideProps = {
  useSlides: UseSlide[],
  slideIndex: number,
  setSlideIndex: (index: number) => any,
  onPressEvent: any,
};

export const Slide: FC<SlideProps> = ({useSlides, slideIndex, setSlideIndex, onPressEvent}) => {
  const ref = useRef(null);

  const onPressSlide = (index: number) => {
    if (slideIndex === index) {
      onPressEvent();
    } else {
      setSlideIndex(index);
    }
  };

  const getSlideImage = ({item, index}: {item: UseSlide, index: number}) => {
    return (
      <PlainTouchable
        style={{
          height: hp(60),
          marginTop: hp(5),
        }}
        activeOpacity={0.7}
        onPress={() => onPressSlide(index)}
      >
        <View style={{elevation: COMMON_ELEVATION, borderRadius: EXTRA_BORDER_RADIUS, opacity: 0.99}}>
          <Image source={item.slideImage} style={{height: hp(60), width: wp(80), borderRadius: EXTRA_BORDER_RADIUS}} />
        </View>
      </PlainTouchable>
    );
  };

  const getContent = (contextObj: ContextObj) => {
    return (
      <Carousel
        layout="default"
        ref={ref}
        data={useSlides}
        sliderWidth={wp(100)}
        itemWidth={wp(80)}
        renderItem={getSlideImage}
        onSnapToItem={(index) => {
          setSlideIndex(index)
        }}
        shouldOptimizeUpdates={true}
        inactiveSlideOpacity={0.6}
        enableMomentum={true}
        scrollEndDragDebounceValue={200}
      />
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
