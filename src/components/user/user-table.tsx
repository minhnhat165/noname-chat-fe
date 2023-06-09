'use client';

import { Badge, Button, Popconfirm, Table, Tag } from 'antd';
import { LockOutlined, UnlockOutlined } from '@ant-design/icons';

import { Avatar } from '../common/avatar';
import { User } from '@/types/user';
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
        rowKey={(record) => record.id as string}
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
        <Table.Column title="Id" dataIndex="id" key="id" />
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
            return <Tag color={role === 'admin' ? 'yellow' : 'blue'}>{role}</Tag>;
          }}
        />
        <Table.Column
          title="Status"
          dataIndex="status"
          key="status"
          align="center"
          render={(_, { status }: User) => {
            return <Badge status={status === 'active' ? 'success' : 'error'} text={status} />;
          }}
        />
        <Table.Column
          title="Action"
          key="action"
          align="center"
          render={(_, { status }: User) => {
            return (
              <Popconfirm
                title={`Are you sure to ${status === 'active' ? 'lock' : 'unlock'} this user?`}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  type="text"
                  shape="circle"
                  danger
                  icon={status === 'active' ? <LockOutlined /> : <UnlockOutlined />}
                />
              </Popconfirm>
            );
          }}
        />
      </Table>
    </>
  );
};
