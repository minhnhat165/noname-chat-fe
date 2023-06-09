import { SidebarMenu } from '@/components/layout/sidebar-menu';

export interface LayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: LayoutProps) {
  return (
    <div className="flex h-screen">
      <aside className="h-full w-[300px]">
        <SidebarMenu />
      </aside>
      <div className="flex-1 bg-slate-200"> {children}</div>
    </div>
  );
}
