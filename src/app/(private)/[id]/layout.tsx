import { SidebarRight } from '@/components/layout/sidebar-right';

export interface LayoutProps {
  children: React.ReactNode;
}

const Layout = async ({ children }: LayoutProps) => {
  return (
    <div className="flex h-screen w-full">
      <main className="flex-1"> {children}</main>
      <aside className="hidden xl:block">
        <SidebarRight />
      </aside>
    </div>
  );
};

export default Layout;
