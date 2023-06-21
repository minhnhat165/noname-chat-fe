import { ListParams, ListResponse, SingleResponse } from '@/types/api';

import { User } from '@/types/user';
import { axios } from '@/lib';

const BASE_URL = '/admin';
export const adminApi = {
  getUsers: (params: Partial<ListParams>): Promise<ListResponse<User>> => {
    const url = `${BASE_URL}/users`;
    return axios.get(url, { params });
  },
  search: (q: string): Promise<ListResponse<User>> => {
    const url = '/users/search';
    return axios.get(url, { params: { q } });
  },

  update: (data: Partial<User>): Promise<SingleResponse<User>> => {
    const url = `/users`;
    return axios.patch(url, data);
  },

  lock: (id: string): Promise<SingleResponse<User>> => {
    const url = `${BASE_URL}/users/${id}/lock`;
    return axios.patch(url);
  },

  unlock: (id: string): Promise<SingleResponse<User>> => {
    const url = `${BASE_URL}/users/${id}/unlock`;
    return axios.patch(url);
  },
};
