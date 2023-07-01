import { CursorPaginationParams, CursorPaginationResponse, SingleResponse } from '@/types/api';

import { Room } from '@/types/room';
import { User } from '@/types/user';
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
  findParticipantsByUserId: (q: string): Promise<SingleResponse<User[]>> => {
    return axios.get(`${BASE_URL}/participants`, { params: { q } });
  },
  checkRoom: (id: string): Promise<SingleResponse<Room>> => {
    const url = `${BASE_URL}/${id}/checkroom`;
    return axios.get(url);
  },
};
