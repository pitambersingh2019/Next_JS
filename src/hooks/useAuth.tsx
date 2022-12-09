import { useContext } from 'react';
import { useRouter } from 'next/router';
import { EnvContext, LoadingContext } from '_context';
import { redirect } from '_utils';

// used to extract common authentication methods & logic away from components
const useAuth = () => {

  const router = useRouter();
  const { asPath, query } = router;
  const { returnUrl, route } = query;
  const isLogin = route === 'login';
  const { host } = useContext(EnvContext);
  const { setIsLoading } = useContext(LoadingContext);

  // handle log out, either manually via nav item or automatically due to expired session. For the latter, the APIs return a 401 which then calls this method via the useFetch hook
  const logOut = (returnPath = `/login?returnUrl=${asPath}`): string => {

    // configure URL to take the user to after log out
    const target = `http://www.${host}${host.includes('local') && !host.includes('prosperex.local') ? ':3020' : ''}${!returnUrl && !isLogin ? returnPath : ''}${isLogin ? '/login?unAuth=true' : ''}`;

    // show loading bar
    setIsLoading(true);

    // remove cookie
    document.cookie = 'ProsperEX_Auth=; domain=.prosperex.com.au; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;';

    // take user to login screen
    redirect(target);

    // return URL for testing purposes
    return target;

  };

  return {
    logOut
  };

};

export default useAuth;