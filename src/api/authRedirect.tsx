import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { isAuth } from '~/api/isAuth';

const useAuthRedirect = () => {
  const router = useRouter();
  useEffect(() => {
    const checkAuth = async () => {
      const isAuthenticated =isAuth();
      if (!isAuthenticated&&router.pathname!=='/login'&&router.pathname!=='/register') {
        router.push('/login');
      }
      if (isAuthenticated&&router.pathname!=='/') {
        router.push('/');
      }
    };
    checkAuth().then();
  }, [router]);
};

export default useAuthRedirect;
