import { instance } from "./config";
import {ACCOUNT_TYPE_NUM} from "../constant/constant";
import {R, User} from "../type/common";

export type SocialAuthResponse = {
  token: string,
};
export const socialAuth = async (token: string, accountTypeNum: ACCOUNT_TYPE_NUM): R<SocialAuthResponse> => {
  return await instance.post("/auth/social-auth", {token, accountTypeNum});
};

export const requestToken = async (phone: string, isSignup: boolean): R<Boolean> => {
  return await instance.post("/auth/token/request", {phone, isSignup});
};

export const verifyPhone = async (phone: string, code: string): R<User> => {
  return await instance.post("/auth/phone/verify", {phone, code});
};

export const verifySMSOnly = async (phone: string, code: string): R<Boolean> => {
  return await instance.post("/auth/token/verify-only", {phone, code});
};

export type LoginResponse = {
  user: User,
  token: string,
  refreshToken: string,
};

export const signup = async (username: string, password: string, phone: string): R<LoginResponse> => {
  return await instance.post("/auth/signup", {username, password, phone});
}

export const login = async (username: string, password: string): R<LoginResponse> => {
  return await instance.post("/auth/login", {username, password});
};

export const forgetPasswordTokenRequest = async (username: string, phone: string): R<Boolean> => {
  return await instance.post("/auth/forget-password-token/request", {username, phone});
};

export const forgetPassword = async (username: string, phone: string, code: string, newPassword: string): R<Boolean> => {
  return await instance.post("/auth/forget-password", {username, phone, code, newPassword});
};

export const resetPassword = async (oldPassword: string, newPassword: string): R<Boolean> => {
  return await instance.post("/auth/reset-password", {oldPassword, newPassword});
};

export type RefreshTokenResponse = {
  token: string,
  refreshToken: string,
};
export const refreshTokenRequest = async (refreshToken: string): R<RefreshTokenResponse> => {
  return await instance.post("/auth/refresh-token", {refreshToken});
};
