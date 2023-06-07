'use client';
import { useSearchParams } from 'next/navigation';

type Props = {};

const RedirectPage = (props: Props) => {
  const searchParams = useSearchParams();
  const token = searchParams?.get('token');
  if (!token) {
  }

  return <div>RedirectPage</div>;
};

export default RedirectPage;
