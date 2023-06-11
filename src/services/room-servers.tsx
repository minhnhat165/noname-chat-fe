import { Room } from '@/types/room';
import { axios } from '@/lib';
import { singleResponse } from '@/types/api';

const BASE_URL = 'rooms';
export const roomApi = {
  getRoom: (id: string): Promise<singleResponse<Room>> => {
    const url = `${BASE_URL}/${id}`;
    return axios.get(url);
  },
};
