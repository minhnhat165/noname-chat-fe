'use client';

import { Badge, Button, Popconfirm, Table, Tag } from 'antd';
import { LockOutlined, UnlockOutlined } from '@ant-design/icons';
import { Role, User, UserStatus } from '@/types/user';

import { Avatar } from '../common/avatar';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { userApi } from '@/services/user-services';
import { users } from '@/stores/data-test';

export interface UserTableProps {}

export const UserTable = (props: UserTableProps) => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useQuery({
    queryKey: ['users', page],
    queryFn: () =>
      userApi.getAll({
        page: page,
        limit: 10,
      }),
    keepPreviousData: true,
  });

  return (
    <>
      <Table
        rowKey={(record) => record._id as string}
        loading={isLoading}
        pagination={{
          pageSize: data?.per_page,
          position: ['bottomRight'],
          total: data?.total,
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
          render={(_, { status }: User) => {
            return (
              <Popconfirm
                title={`Are you sure to ${
                  status === UserStatus.ACTIVE ? 'lock' : 'unlock'
                } this user?`}
                okText="Yes"
                cancelText="No"
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
