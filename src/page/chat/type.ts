

export type MessageNotificationData = {
  messageType: ChatMessageType,
  matchId: string,
};

export type Message = {
  type: string,
  text: string,
  timestamp: number,
  user: {
    _id: string,
    id: string,
  },
};

export type MessageData = {
  id?: string,
  _id?: string,
  matchId: string,
  messageUser?: MessageUser,
  lastMessage?: Message,
  unreadNum: number,
};

export type MessageUser = {
  id: string,
  isTyping: boolean,
  lastSeen: number;
};

export type MessageUserStatus = {
  id: string,
  state: "online" | "offline",
  last_changed: Date,
};

export type ChatMessageType = "text" | "voice" | "image" | "paint";

