import axios from "axios";
import { Cookies } from "react-cookie";
import { ReIssueRequestDto } from "./request/auth";
import { ReIssueResponseDto } from "./response/auth";

const cookies = new Cookies();
const BASE_URL_V1 = process.env.REACT_APP_API_URL1;
const BASE_URL_V2 = process.env.REACT_APP_API_URL2;
const RE_ISSUE_URL = '/auth/re-issue';

// v1 인스턴스 생성
export const apiV1 = axios.create({
    baseURL: BASE_URL_V1,
    timeout: 10000,
});

// v2 인스턴스 생성
export const apiV2 = axios.create({
    baseURL: BASE_URL_V2,
    timeout: 10000,
});

// 공통 인터셉터 설정
const setupInterceptors = (instance: any) => {
    instance.interceptors.request.use(
        (config: any) => {
            const accessToken = cookies.get('accessToken');
            if (accessToken) {
                config.headers['Authorization'] = `Bearer ${accessToken}`;
            }
            return config;
        },
        (error: any) => Promise.reject(error)
    );

    instance.interceptors.response.use(
        (response: any) => response,
        async (error: any) => {
            const originalRequest = error.config;
            if (error.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;

                try {
                    const refreshToken = cookies.get('refreshToken');
                    const accessToken = cookies.get('accessToken');

                    if (!refreshToken) {
                        throw new Error("No refresh token available");
                    }

                    const reIssueRequestDto: ReIssueRequestDto = {
                        accessToken,
                        refreshToken,
                    };

                    const response = await axios.post<ReIssueResponseDto>(
                        `${BASE_URL_V1}${RE_ISSUE_URL}`, // 혹은 BASE_URL_V2
                        reIssueRequestDto
                    );

                    const { accessToken: newAccessToken, refreshToken: newRefreshToken , accessTokenExpiresIn} = response.data;

                    cookies.set('accessToken', newAccessToken, { path: '/', maxAge: accessTokenExpiresIn / 1000 });
                    cookies.set('refreshToken', newRefreshToken, { path: '/' });

                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

                    return instance(originalRequest);
                } catch (reIssueError) {
                    cookies.remove('accessToken', { path: '/' });
                    cookies.remove('refreshToken', { path: '/' });
                    return Promise.reject(reIssueError);
                }
            }
            return Promise.reject(error);
        }
    );
};

// 인스턴스에 공통 인터셉터 적용
setupInterceptors(apiV1);
setupInterceptors(apiV2);

export default apiV1; // 기본적으로 v1을 사용할 수 있도록 설정