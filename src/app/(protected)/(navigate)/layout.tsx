import { SidebarNavigate } from '@/components/layout/sidebar-navigate';

export interface NavigateLayout {
  children: React.ReactNode;
}

const NavigateLayout = async ({ children }: NavigateLayout) => {
  return (
    <div className="flex">
      <SidebarNavigate />
      {children}
    </div>
  );
};

export default NavigateLayout;
