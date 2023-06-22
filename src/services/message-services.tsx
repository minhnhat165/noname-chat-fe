import { axios } from '@/lib';
import { Message } from '@/types/message';
import { SingleResponse } from '@/types/api';

const BASE_URL = 'messages';
export const messageApi = {
  createMessage: (data: Partial<Message>): Promise<SingleResponse<Message>> => {
    const url = `${BASE_URL}`;
    return axios.post(url, data);
  },
  getMessages: (roomId: String): Promise<Message[]> => {
    const url = `${BASE_URL}/${roomId}`;
    return axios.get(url);
  },
};
