import React, { Component, FC } from "react";
import { Image, Text, View } from "react-native";
import styled from "styled-components/native";
import { BORDER_RADIUS, EXTRA_BORDER_RADIUS } from "../utils/size";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";

export const SmallImage = styled.Image.attrs(props => {
  return {
    size: "1em",
    // backgroundColor: (props as any).backgroundColor || props.theme.background,
  }
})`
  flex: 1;
  width: 100;
`;

export const PlainAvatar = styled.Image.attrs(props => {
  return {
    // backgroundColor: (props as any).backgroundColor || props.theme.background,
  }
})`
  width: ${hp(8)};
  height: ${hp(8)};
  border-radius: ${EXTRA_BORDER_RADIUS};
  border-width: ${2};
  border-color: ${props => props.theme.border};
`;