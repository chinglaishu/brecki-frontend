import React, {Children, FC, useEffect, useRef, useState} from "react";
import LottieView from "lottie-react-native";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import imageLoader from "../utils/imageLoader";
import { ContainerView, RowView } from "./view";
import { View } from "react-native";

export const NormalSpinner = () => {
  return (
    <View style={{alignItems: "center", justifyContent: "center"}}>
      <LottieView
        style={{
          width: wp(20),
          height: wp(20),
        }}
        source={imageLoader.lottie_loading}
        autoPlay
        loop={true}
      />
    </View>
  );
};
