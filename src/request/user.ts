import { instance } from "./config";
import axios from "axios";
import { PersonalInfo, ProfilePicTwoUrl, R, User } from "../type/common";
import { IMAGE_S3_DIRECTORY } from "../constant/constant";

export const getUserSelf = async (): R<User> => {
  return await instance.get("/user/self");
};

export const updatePersonalInfo = async (id: string, personalInfo: PersonalInfo): R<User> => {
  return await instance.put(`/user/${id}`, {personalInfo});
};

export const uploadProfilePicOne = async (base64: string, fileType: string): R<string> => {
  return await instance.post(`/user/upload/profile-pic-one`, {base64, fileType});
};

export const uploadImage = async (base64: string, fileType: string, directory: IMAGE_S3_DIRECTORY): R<string> => {
  return await instance.post(`/user/upload/profile-pic-one`, {base64, fileType, directory});
};

export const uploadProfilePicTwo = async (base64: string, fileType: string): R<ProfilePicTwoUrl> => {
  return await instance.post(`/user/upload/profile-pic-two`, {base64, fileType});
};

export const getRandomUserForReview = async (): R<User> => {
  return await instance.get("user/question-review/random-user");
};

export const addNotificationToken = async (token: string): R<User> => {
  return await instance.post(`user/add-notification-token/${token}`);
}

export const removeNotificationToken = async (token: string): R<User> => {
  return await instance.post(`user/remove-notification-token/${token}`);
}
