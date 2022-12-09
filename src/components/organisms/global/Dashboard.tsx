import { ReactNode, useContext, useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Favicon, Indicator, Providers, PraiseBanner } from '_molecules';
import { Admin, Branded, Filter } from '_navigation';
import { EnvContext, LoadingContext, SpaceContext } from '_context';
import { useFetch } from '_hooks';
import { delay, hasDateRange, lazyload } from '_utils';

interface IProps {
  endpoint?: string;
  host?: string;
  title: string;
  children?: ReactNode;
}

const adminClass = 'admin';
const employeeClass = 'employee';

// used as the root component for both employee & admin dashboards (equivalent on marketing side is Page component)
const Dashboard = ({ endpoint, host, title, children }: IProps) => {

  const router = useRouter();
  const { asPath } = router;
  const { error, fetchData } = useFetch();
  const { env, saveEnv, saveHost } = useContext(EnvContext);
  const { space, hasSpaceData, saveSpace } = useContext(SpaceContext);
  const { user, branding } = space;
  const { primaryColour } = branding;
  const { isFetched, setIsFetched } = useContext(LoadingContext);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const useDateRange = hasDateRange(asPath);

  useEffect(() => {

    // work out whether we're on the admin or employee side
    const adminUser = asPath.startsWith('/admin');

    // set local state to easily toggle admin-specific components
    if (adminUser) setIsAdmin(true);

    // remove both classes from body
    document.body.classList.remove(employeeClass, adminClass);

    // add target class to body (dark mode for admin, light mode for employee), CSS transition handles animation
    adminUser
      ? document.body.classList.add(adminClass)
      : document.body.classList.add(employeeClass);

  }, [asPath]);

  useEffect(() => {

    // endpoint is passed in from parent component (page file), these env values are only available server-side so we pass them in via the serverDashboard util
    if (endpoint) saveEnv(endpoint.substring(0, endpoint.indexOf('/api') + 4));

    // host is also passed in from parent component (page file) for the same reason
    if (host) saveHost(host);

  }, [endpoint, host]);

  useEffect(() => {

    if (env) {

      // get space data - identified by the cookie set during login (which the API can read because we use credentials: include in the fetchData headers in the useFetch hook)
      fetchData('/space').then(response => {

        if (response?.id) {

          const { notifications } = response.user;

          // if we don't have space data yet, save it into the SpaceContext to be used globally across the app
          if (!hasSpaceData) saveSpace(response);

          // if there are new notifications to show, make sure we update that value in the SpaceContext. Everywhere that's subscribed (e.g. header & nav) will show the badge automatically
          if (hasSpaceData && (notifications !== user.notifications)) saveSpace({ ...space, user: { ...user, notifications } });
          
          // hide the loader if it's currently shown 
          if (!isFetched) setIsFetched(true);
        
        }

      });

    }

  }, [env, asPath]);

  useEffect(() => {

    // make sure client-side redirects & updates to space data trigger images to be lazyloaded (e.g. if the user updated their avatar, we'd want to immediatey load the new one into the header)
    delay(300).then(() => lazyload());

  }, [asPath, space]);

  return (
    <Indicator>
      <>
        <Head>
          <title>{ title }{!title.includes('Prosper EX') ? ' | Prosper EX' : ''}</title>
          <Favicon />
        </Head>
        <Providers>
          <header style={primaryColour ? { ['--brand' as string]: primaryColour } : undefined}>
            <Branded />
            <PraiseBanner />
            {isAdmin && useDateRange && <Filter />}
          </header>
          <main className={`dashboard inner spinner${(!hasSpaceData && !error) ? ' spinning' : ''}`}
            role="main">
            {isAdmin && <Admin />}
            <div className="dashboard__wrapper">
              { children }
            </div>
          </main>
        </Providers>
      </>
    </Indicator>
  );

};

export default Dashboard;
