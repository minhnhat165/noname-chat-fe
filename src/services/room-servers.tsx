import { CursorPaginationParams, CursorPaginationResponse, SingleResponse } from '@/types/api';
import { Room, RoomDto } from '@/types/room';

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
  findParticipantsByUserIdNotInRoom: ({id, q}:{id:string,q: string}): Promise<SingleResponse<User[]>> => {
    return axios.get(`${BASE_URL}/${id}/participants`, { params: { q } });
  },
  checkRoom: (id: string): Promise<SingleResponse<Room>> => {
    const url = `${BASE_URL}/${id}/checkroom`;
    return axios.get(url);
  },
  deleteRoom: (id: string): Promise<SingleResponse<Room>> => {
    return axios.delete(`${BASE_URL}/${id}`);
  },
  createRoom: (data: Partial<RoomDto>): Promise<SingleResponse<Room>> => axios.post(`${BASE_URL}`, data),
  updateRoom: (data: Partial<RoomDto>) => axios.patch(`${BASE_URL}/${data?._id}`, data),
  outGroup: (id: string = '') => axios.patch(`${BASE_URL}/${id}/out`),
  deleteMember: (data: any) => axios.patch(`${BASE_URL}/${data?.id}/members/remove`, data),
  addMember: (data: any) => axios.patch(`${BASE_URL}/${data?.id}/members/add`, data),
};
