import { instance } from "./config";
import { MATCH_METHOD_NUM, MATCH_STATUS_NUM } from "../constant/constant";
import { R } from "../type/common";
import { Match } from "../page/likeZone/type";
import { ChatMessageType } from "../page/chat/type";

export const blockMatch = async (id: string): R<Match> => {
  return await instance.post(`/match/block-match/${id}`);
};

export const unBlockMatch = async (id: string): R<Match> => {
  return await instance.post(`/match/unblock-match/${id}`);
};

export const quitMatch = async (id: string): R<Match> => {
  return await instance.post(`/match/quit-match/${id}`);
};

export const getAllMatchs = async (userId: string): R<Match[]> => {
  return await instance.get(`/match/get/all?filter={"userIds":["${userId}"]}`);
};

export const getMatchById = async (matchId: string): R<Match> => {
  return await instance.get(`/match/${matchId}`);
};

export const addChatDataRecord = async (matchId: string, type: ChatMessageType, length?: number) => {
  return await instance.post(`/match/add-chat-data-record/${matchId}`, {type, length});
};
