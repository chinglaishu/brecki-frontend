import { R, SystemOrManualMatch } from "../type/common";
import { instance } from "./config";

export const requestManualMatchs = async (withPerference: boolean): R<SystemOrManualMatch> => {
  return await instance.get(`/manual-match/request?withPerference=${withPerference}`);
};

export const getSelfManualMatch = async (): R<SystemOrManualMatch> => {
  return await instance.get(`/manual-match/self`);
};

export const manualCreateMatch = async (toUserId: string): R<SystemOrManualMatch> => {
  return await instance.post(`/manual-match/create-match/${toUserId}`);
};
