import { Room } from '@/types/room';

export const rooms: Room[] = [
  {
    id: 1,
    name: 'Room 1',
    description: 'Room 1 description',
    isGroup: false,
    users: [
      {
        id: '1',
        avatar:
          'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80',
        name: 'User 1',
        email: '',
        username: '',
      },
      {
        id: '2',
        avatar:
          'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80',
        name: 'User 2',
        email: '',
        username: '',
      },
    ],
    lastMessage: {
      id: 1,
      read: false,
      content: 'Last message',
      createdAt: '2021-10-10T00:00:00.000Z',
      user: {
        id: '1',
        avatar:
          'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80',
        name: 'User 1',
        email: '',
        username: '',
      },
    },
  },
  {
    id: 2,
    name: 'Room 1',
    description: 'Room 1 description',
    isGroup: false,
    users: [
      {
        id: '1',
        avatar:
          'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80',
        name: 'User 1',
        email: '',
        username: '',
      },
      {
        id: '2',
        name: 'User 2',
        email: '',
        username: '',
      },
    ],
    lastMessage: {
      id: 3,
      read: false,
      content: 'Last message lkajsfdlkjas lkajsdfla laksjfd;lkasjdf;laksjdflaksjdflaksjfd;la',
      createdAt: '2021-10-10T00:00:00.000Z',
      user: {
        id: '1',
        avatar:
          'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
        name: 'User 1',
        email: '',
        username: '',
      },
    },
  },
];
