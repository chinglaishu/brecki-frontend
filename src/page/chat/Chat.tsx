import React, {FC, useEffect, useState} from "react";
import { View } from "react-native";
import { ContextObj, PageProps } from "../../type/common";
import { ContextConsumer } from "../../utils/context";
import fire from "../../utils/firebase";
import EmojiSelector, { Categories } from "react-native-emoji-selector";

export const Chat: FC<PageProps> = () => {
  const [messages, setMessages]: any[] = useState([]);

  // useEffect(() => {
  //   fire.refOn((newMessages: any) => {
  //     setMessages(messages.append(newMessages));
  //   });
  // }, []);

  const getContent = (contextObj: ContextObj) => {
    const {user} = contextObj;
    return (
      <View>

        {/* <EmojiSelector
          category={Categories.symbols}
          onEmojiSelected={emoji => console.log(emoji)}
        />; */}
      </View>
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
