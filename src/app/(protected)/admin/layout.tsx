import { SidebarMenu } from '@/components/layout/sidebar-menu';
import { redirect } from 'next/navigation';
import { useUserStore } from '@/stores/user';

export interface LayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: LayoutProps) {
  const { role } = useUserStore((state) => state.data!);
  if (role !== 'admin') {
    redirect('/');
  }

  return (
    <div className="flex h-screen">
      <aside className="h-full w-[300px]">
        <SidebarMenu />
      </aside>
      <div className="flex-1 bg-slate-200"> {children}</div>
    </div>
  );
}
