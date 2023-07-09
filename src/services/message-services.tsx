import { axios } from '@/lib';
import { Message, MessageCreate } from '@/types/message';
import { SingleResponse } from '@/types/api';

const BASE_URL = 'messages';
export const messageApi = {
  createMessage: (data: MessageCreate): Promise<Message> => {
    const url = `${BASE_URL}`;
    return axios.post(url, data);
  },
  getMessages: (
    roomId: string,
    params: { cursor: string; limit: number },
  ): Promise<{ data: Message[]; nextCursor: number }> => {
    const url = `${BASE_URL}/${roomId}`;
    return axios.get(url, { params });
  },
  deleteMessage: (id: String): Promise<String> => {
    const url = `${BASE_URL}/${id}`;
    return axios.delete(url);
  },
};
