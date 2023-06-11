// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import type { NextApiRequest, NextApiResponse } from 'next';

import Cookies from 'cookies';
import httpProxy from 'http-proxy';

export const config = {
  api: {
    bodyParser: false,
  },
};

const proxy = httpProxy.createProxyServer();

export default function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  return new Promise(() => {
    const cookies = new Cookies(req, res);
    const accessToken = cookies.get('token');
    console.log(accessToken);
    if (accessToken) {
      req.headers.Authorization = `Bearer ${accessToken}`;
    }

    req.headers.cookie = '';

    proxy.web(req, res, {
      target: process.env.SERVER_API_URL,
      changeOrigin: true,
      selfHandleResponse: false,
    });
  });
}
