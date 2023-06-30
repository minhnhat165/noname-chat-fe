import { SidebarNavigate } from '@/components/layout/sidebar-navigate';

export interface NavigateLayout {
  children: React.ReactNode;
}

const NavigateLayout = async ({ children }: NavigateLayout) => {
  return (
    <div className="flex">
      <SidebarNavigate />
      <div className="flex-1"> {children}</div>
    </div>
  );
};

export default NavigateLayout;
