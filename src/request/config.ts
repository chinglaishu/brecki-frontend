import axios from "axios";
import { AUTHORIZATION_HEADER, LANGUAGE_HEADER, STORE_KEY } from "../constant/constant";
import { BASE_URL } from "../constant/config";
import { Language } from "../type/common";
import { getStoreData, removeStoreData, setStoreData } from "../utils/utilFunction";
import { refreshTokenRequest } from "./auth";

export const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Headers': 'X-Requested-With',
  },
});

export const setAxiosHeader = (header: string, value: string) => {
  instance.defaults.headers.common[header] = value;
};

export const setAxiosAuthorization = (token: string) => {
  setAxiosHeader(AUTHORIZATION_HEADER, token);
};

export const setAxiosLanguage = (language: Language) => {
  setAxiosHeader(LANGUAGE_HEADER, language);
};

export const getAxiosHeader = (key: string) => {
  const value = instance.defaults.headers.common[key];
  return value;
};

let refreshingToken = false;
let pendingRequests: {
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}[] = [];
const processPending = (error: Error | null, token: string | null) => {
  pendingRequests.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  pendingRequests = [];
};

instance.interceptors.response.use(
  (response) => response,
  async (error) => {

    const lang = getAxiosHeader(LANGUAGE_HEADER);
    // if ((error.code === undefined && error.message === 'Network Error') || error.code === 'ECONNABORTED') {
    //   throw new Error(lang === 'zht' ? '請檢查你的網絡連線' : 'Please check your network connection');
    // }

    const { response } = error;

    if (response?.status === 403 && response?.data?.message === 'Forbidden resource' && response?.data?.info === 'F') {
      const request = error.config;
      const refreshToken = await getStoreData(STORE_KEY.REFRESH_TOKEN);
      if (refreshToken && !request._retry) {
        if (!refreshingToken) {
          request._retry = true;
          refreshingToken = true;
          try {
            const result = await refreshTokenRequest(refreshToken);
            const newRefreshToken = result.data.data.refreshToken;
            const newToken = result.data.data.token;

            await setStoreData(STORE_KEY.ACCESS_TOKEN, newToken);
            await setStoreData(STORE_KEY.REFRESH_TOKEN, newRefreshToken);
            setAxiosAuthorization(newToken);
            refreshingToken = false;
            // Retry all pending requests
            processPending(null, newToken);
            request.headers.Authorization = newToken;
            return instance(request);
          } catch (err) {
            removeStoreData(STORE_KEY.ACCESS_TOKEN);
            removeStoreData(STORE_KEY.REFRESH_TOKEN);
            setAxiosAuthorization("");
            refreshingToken = false;
            // Reject all pending requests
            processPending(err as Error, null);
          }
        } else {
          // If another API call triggered refresh token, put into queue and retry after refreshing
          return new Promise((resolve, reject) => {
            pendingRequests.push({ resolve, reject });
          })
            .then((token) => {
              request.headers.Authorization = token;
              return instance(request);
            })
            .catch((err) => Promise.reject(err));
        }
      }
      // throw new Error(lang === 'zht' ? '請重新登入。' : 'Please login again.');
    }

    if (error.response?.data?.message) {
      // throw new Error(error.response.data.message);
    }
    // throw error;
  },
);
