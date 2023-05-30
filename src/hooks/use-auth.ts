import { cookies } from 'next/headers';
import { useUserStore } from '@/stores/user';

export const useAuth = () => {
  const user = useUserStore((state) => state.data);

  const isLogged = () => {
    return !!cookies().get('access_token');
  };

  return { isLogged, user };
};
