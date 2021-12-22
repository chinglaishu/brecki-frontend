import { R, SystemOrManualMatch } from "../type/common";
import { instance } from "./config";

export const requestSystemMatchs = async (withPerference: boolean): R<SystemOrManualMatch> => {
  return await instance.get(`/system-match/request?withPerference=${withPerference}`);
};

export const getSelfSystemMatch = async (): R<SystemOrManualMatch> => {
  return await instance.get(`/system-match/self`);
};

export const likeSystemMatchUser = async (toUserId: string): R<SystemOrManualMatch> => {
  return await instance.post(`/system-match/like-user/${toUserId}`);
};

export const crossSystemMatchUser = async (toUserId: string): R<SystemOrManualMatch> => {
  return await instance.post(`/system-match/cross-user/${toUserId}`);
};
