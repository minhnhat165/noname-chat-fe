export interface ProfileLayoutProps {
    children: React.ReactNode;
}

const ProfileLayout = ({ children }: ProfileLayoutProps) => {
    return <div>{children}</div>;
};

export default ProfileLayout;
