'use client';

import { Badge, Button, Popconfirm, Table, Tag } from 'antd';
import { LockOutlined, UnlockOutlined } from '@ant-design/icons';
import { Role, User, UserStatus } from '@/types/user';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { Avatar } from '../common/avatar';
import { ListResponse } from '@/types/api';
import { adminApi } from '@/services/admin-services';
import { queryKeys } from '@/constants';
import { useState } from 'react';
import { useToggleLockUser } from '@/hooks/user/use-toggle-lock-user';

export interface UserTableProps {}

export const UserTable = (props: UserTableProps) => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const { data, isLoading } = useQuery({
    queryKey: [queryKeys.ADMIN_USERS, page],
    queryFn: () =>
      adminApi.getUsers({
        page: page,
        limit: 10,
      }),
    keepPreviousData: true,
  });

  const pageInfo = data?.pageInfo;
  const users = data?.data || [];

  const { toggleLock } = useToggleLockUser({
    onSuccess(data) {
      console.log(data.data.status);
      queryClient.setQueryData<ListResponse<User>>([queryKeys.ADMIN_USERS, page], (oldData) => {
        const newData = oldData!.data.map((user) => {
          if (user._id === data.data._id) {
            return data.data;
          }
          return user;
        });
        console.log(newData);
        return {
          ...oldData!,
          data: newData,
        };
      });
    },
  });

  return (
    <>
      <Table
        rowKey={(record) => record._id as string}
        loading={isLoading}
        pagination={{
          pageSize: pageInfo?.limit,
          position: ['bottomRight'],
          total: pageInfo?.total,
          current: page,
          onChange: (page) => setPage(page),
        }}
        dataSource={users}
      >
        <Table.Column title="Id" dataIndex="_id" key="_id" />
        <Table.Column
          title="Name"
          dataIndex="username"
          key="username"
          render={(_, record: User) => {
            return (
              <div className="flex items-center gap-2">
                <Avatar size="small" src={record.avatar} />
                <span>{record.username}</span>
              </div>
            );
          }}
        />
        <Table.Column title="Email" dataIndex="email" key="email" />
        <Table.Column
          title="Role"
          dataIndex="role"
          key="role"
          align="center"
          render={(_, { role }: User) => {
            return <Tag color={role === Role.ADMIN ? 'yellow' : 'blue'}>{role}</Tag>;
          }}
        />
        <Table.Column
          title="Status"
          dataIndex="status"
          key="status"
          align="center"
          render={(_, { status }: User) => {
            return (
              <Badge status={status === UserStatus.ACTIVE ? 'success' : 'error'} text={status} />
            );
          }}
        />
        <Table.Column
          title="Action"
          key="action"
          align="center"
          render={(_, { status, _id }: User) => {
            return (
              <Popconfirm
                title={`Are you sure to ${
                  status === UserStatus.ACTIVE ? 'lock' : 'unlock'
                } this user?`}
                okText="Yes"
                cancelText="No"
                onConfirm={() => toggleLock(_id, status === UserStatus.BANNED)}
              >
                <Button
                  type="text"
                  shape="circle"
                  danger
                  icon={status === UserStatus.ACTIVE ? <LockOutlined /> : <UnlockOutlined />}
                />
              </Popconfirm>
            );
          }}
        />
      </Table>
    </>
  );
};
