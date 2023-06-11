import { ListParams, ListResponse, SuccessResponse, singleResponse } from '@/types/api';

import { Call } from '@/types/call';
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
  getCall: (id: string): Promise<singleResponse<Call>> => {
    const url = `${BASE_URL}/${id}`;
    return axios.get(url);
  },
  createCall: (roomId: string): Promise<singleResponse<Call>> => {
    return axios.post(BASE_URL, {
      roomId: roomId,
    });
  },
  acceptCall: (id: string): Promise<SuccessResponse> => {
    const url = `${BASE_URL}/${id}/accept`;
    return axios.patch(url);
  },
  rejectCall: (id: string): Promise<SuccessResponse> => {
    const url = `${BASE_URL}/${id}/reject`;
    return axios.patch(url);
  },
  endCall: (id: string): Promise<SuccessResponse> => {
    const url = `${BASE_URL}/${id}/end`;
    return axios.patch(url);
  },
};
