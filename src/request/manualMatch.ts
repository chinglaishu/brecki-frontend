import { R, SystemOrManualMatch } from "../type/common";
import { instance } from "./config";

export const requestManualMatchs = async (withPerference: boolean): R<SystemOrManualMatch> => {
  return await instance.get(`/manual-match/request?withPerference=${withPerference}`);
};

export const getSelfManualMatch = async (): R<SystemOrManualMatch> => {
  return await instance.get(`/manual-match/self`);
};

export const likeManualMatchUser = async (toUserId: string): R<SystemOrManualMatch> => {
  return await instance.post(`/manual-match/like-user/${toUserId}`);
};

export const crossManualMatchUser = async (toUserId: string): R<SystemOrManualMatch> => {
  return await instance.post(`/manual-match/cross-user/${toUserId}`);
};

