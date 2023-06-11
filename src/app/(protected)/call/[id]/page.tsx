import { CallPage } from '@/components/call/call-page';

export interface CallPageProps {
  params: {
    id: string;
  };
  searchParams: {
    call_id: string;
  };
}

const Page = async ({ params, searchParams }: CallPageProps) => {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <CallPage />
    </div>
  );
};

export default Page;
