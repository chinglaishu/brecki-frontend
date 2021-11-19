import { instance } from "./config";
import axios from "axios";
import { R, User } from "../type/common";

export const getUserSelf = async (): R<User> => {
  return await instance.get("/user/self");
};
