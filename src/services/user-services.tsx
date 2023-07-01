import { ListParams, ListResponse, SingleResponse } from '@/types/api';

import { User } from '@/types/user';
import { axios } from '@/lib';

export const userApi = {
  getAll: (params: Partial<ListParams>): Promise<ListResponse<User>> => {
    const url = '/users';
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
  getMemberInfo: (id: string): Promise<User> => {
    const url = `/users/${id}`;
    return axios.get(url);
  },
};
