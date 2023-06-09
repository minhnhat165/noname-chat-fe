import { axios } from '@/lib';
import { ListParams, ListResponse } from '@/types/api';
import { User } from '@/types/user';

export const userApi = {
  getAll: (params: Partial<ListParams>): Promise<ListResponse<User>> => {
    const url = '/users';
    return axios.get(url, { params });
  },
};
