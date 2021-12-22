import { instance } from "./config";
import { MATCH_METHOD_NUM, MATCH_STATUS_NUM } from "../constant/constant";
import { R } from "../type/common";
import { Match } from "../page/likeZone/type";

export const createMatch = async (toUserId: string, method: MATCH_METHOD_NUM) => {
  return await instance.post("/match", {toUserId, method});
};

export const updateMatch = async (id: string, status: MATCH_STATUS_NUM) => {
  return await instance.put(`/match/${id}`, {status});
};

export const acceptMatch = async (id: string): R<Match> => {
  return await instance.post(`/match/accept-match/${id}`);
};

export const rejectMatch = async (id: string): R<Match> => {
  return await instance.post(`/match/reject-match/${id}`);
};

export const blockMatch = async (id: string): R<Match> => {
  return await instance.post(`/match/block-match/${id}`);
};

export const unBlockMatch = async (id: string): R<Match> => {
  return await instance.post(`/match/unblock-match/${id}`);
};

export const quitMatch = async (id: string): R<Match> => {
  return await instance.post(`/match/quit-match/${id}`);
};
