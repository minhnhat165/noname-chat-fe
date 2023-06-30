import { UserTable } from '@/components/user';

export interface AdminUserPageProps {}

const AdminUserPage = (props: AdminUserPageProps) => {
  return (
    <div>
      <UserTable />
    </div>
  );
};

export default AdminUserPage;
