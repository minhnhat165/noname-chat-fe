import { CallIncoming } from '@/components/call/call-incoming';
import { Sidebar } from '@/components/layout/sidebar';

export interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <CallIncoming />
      <div className="flex h-screen">
        <aside className="hidden md:block ">
          <Sidebar />
        </aside>
        <div className="flex-1">{children}</div>
      </div>
    </>
  );
};

export default Layout;
