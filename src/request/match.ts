import { instance } from "./config";
import { MATCH_METHOD_NUM, MATCH_STATUS_NUM } from "../constant/constant";

export const createMatch = async (toUserId: string, method: MATCH_METHOD_NUM) => {
  return await instance.post("/match", {toUserId, method});
};

export const updateMatch = async (id: string, status: MATCH_STATUS_NUM) => {
  return await instance.put(`/match/${id}`, {status});
};
