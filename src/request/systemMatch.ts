import { R, SystemOrManualMatch } from "../type/common";
import { instance } from "./config";

export const requestSystemMatchs = async (withPerference: boolean): R<SystemOrManualMatch> => {
  return await instance.get(`/system-match/request?withPerference=${withPerference}`);
};

export const getSelfSystemMatch = async (): R<SystemOrManualMatch> => {
  return await instance.get(`/system-match/self`);
};

export const systemCreateMatch = async (toUserId: string): R<SystemOrManualMatch> => {
  return await instance.post(`/system-match/create-match/${toUserId}`);
};

export const crossSystemMatchUser = async (toUserId: string): R<SystemOrManualMatch> => {
  return await instance.post(`/system-match/cross-user/${toUserId}`);
};
