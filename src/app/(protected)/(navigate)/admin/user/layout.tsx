export interface AdminUserLayoutProps {
  children: React.ReactNode;
}

const AdminUserLayout = ({ children }: AdminUserLayoutProps) => {
  return <div className="h-screen p-10">{children}</div>;
};

export default AdminUserLayout;
