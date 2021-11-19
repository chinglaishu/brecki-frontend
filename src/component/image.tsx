import React, { Component, FC } from "react";
import { Image, Text, View } from "react-native";
import styled from "styled-components/native";

export const SmallImage = styled.Image.attrs(props => {
  return {
    size: "1em",
    // backgroundColor: (props as any).backgroundColor || props.theme.background,
  }
})`
  flex: 1;
  width: 100;
`;

