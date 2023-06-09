import * as cookie from 'cookie';
import * as setCookie from 'set-cookie-parser';

import axios from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';

const instance = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add a request interceptor
instance.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

// Add a response interceptor
instance.interceptors.response.use(
  function (response) {
    return response.data;
  },
  function (error) {
    return Promise.reject(error);
  },
);

createAuthRefreshInterceptor(instance, (failedRequest) =>
  // 1. First try request fails - refresh the token.
  instance.get('/api/refresh-token').then((resp: any) => {
    // 1a. Clear old helper cookie used in 'authorize.ts' higher order function.
    if (instance.defaults.headers.setCookie) {
      delete instance.defaults.headers.setCookie;
    }
    const { accessToken } = resp.data;
    // 2. Set up new access token
    const bearer = `Bearer ${accessToken}`;
    instance.defaults.headers.Authorization = bearer;

    // 3. Set up new refresh token as cookie
    const responseCookie = setCookie.parse(resp.headers['set-cookie'])[0]; // 3a. Parse the cookie from the response.
    instance.defaults.headers.setCookie = resp.headers['set-cookie']; // 3b. Set helper cookie for 'authorize.ts' Higher order Function.
    instance.defaults.headers.cookie = cookie.serialize(responseCookie.name, responseCookie.value);
    // 4. Set up access token of the failed request.
    failedRequest.response.config.headers.Authorization = bearer;

    // 5. Retry the request with new setup!
    return Promise.resolve();
  }),
);

export { instance as axios };
