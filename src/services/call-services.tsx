import { ListParams, ListResponse } from '@/types/api';

import { Message } from '@/types/message';
import { User } from '@/types/user';
import { axios } from '@/lib';

const BASE_URL = 'calls';
export const callApi = {
  getAll: (params: Partial<ListParams>): Promise<ListResponse<User>> => {
    return axios.get(BASE_URL, { params });
  },
  getHistory: (): Promise<ListResponse<Message>> => {
    const url = `${BASE_URL}/history`;
    return axios.get(url);
  },
};
