'use client';

import { useCredentialStore } from '@/stores/credential';
import { useSearchParams } from 'next/navigation';

type Props = {};

const RedirectPage = (props: Props) => {
  const searchParams = useSearchParams();
  const { setCredential } = useCredentialStore();
  const token = searchParams?.get('token');
  if (token) {
    setCredential({ token });
  }

  return <div>RedirectPage</div>;
};

export default RedirectPage;
