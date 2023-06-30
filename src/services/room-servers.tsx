import { CursorPaginationParams, CursorPaginationResponse, SingleResponse } from '@/types/api';

import { Room } from '@/types/room';
import { axios } from '@/lib';

const BASE_URL = 'rooms';
export const roomApi = {
  getRoom: (id: string): Promise<SingleResponse<Room>> => {
    const url = `${BASE_URL}/${id}`;
    return axios.get(url);
  },
  getRooms: (
    params: CursorPaginationParams & {
      type?: 'all' | 'direct' | 'group';
    },
  ): Promise<CursorPaginationResponse<Room>> => {
    return axios.get(BASE_URL, { params });
  },
};
