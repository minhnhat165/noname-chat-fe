export interface LayoutProps {
  children: React.ReactNode;
}

const Layout = async ({ children }: LayoutProps) => {
  return (
    <div className="flex h-screen w-full ">
      <main className="flex-1 bg-slate-200">{children}</main>
    </div>
  );
};

export default Layout;
