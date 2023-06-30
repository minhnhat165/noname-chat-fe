import { CallIncoming } from '@/components/call/call-incoming';
import { Sidebar } from '@/components/layout/sidebar';
import { SidebarNavigate } from '@/components/layout/sidebar-navigate';

export interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <CallIncoming />
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1">{children}</div>
      </div>
    </>
  );
};

export default Layout;
