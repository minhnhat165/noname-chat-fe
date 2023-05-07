import SidebarRight from '@/components/SidebarRight';

export interface LayoutProps {
  children: React.ReactNode;
  params: {
    id: string;
  };
}

export const getUserGithub = async (id: string) => {
  const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
  const data = await response.json();
  return data;
};

const Layout = async ({ children, params }: LayoutProps) => {
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
