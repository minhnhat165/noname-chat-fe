import { Role } from '@/types/user';
import { notFound } from 'next/navigation';
import { useUserStore } from '@/stores/user';

export interface LayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: LayoutProps) {
  const { role } = useUserStore.getState().data!;
  if (role !== Role.ADMIN) {
    notFound();
  }

  return (
    <div className="flex h-screen w-full">
      <div className="flex-1 bg-slate-200">{children}</div>
    </div>
  );
}
