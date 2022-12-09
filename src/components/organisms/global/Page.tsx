import { useContext, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { Favicon, Indicator, Layout, Meta, Providers } from '_molecules';
import Hero from './../marketing/Hero';
import type { IProps as IHero } from './../marketing/Hero';
import { EnvContext, LazyContext } from '_context';
import { delay, fetcher, lazyload } from '_utils';
import { useComponent } from '_hooks';

interface IPageData {
  meta: IMeta;
  hero: IHero;
  components: IComponent[];
}

interface IPageResponse {
  json: IPageData;
  status: number;
}

export interface IProps {
  endpoint: string;
  response: IPageResponse;
  global: IGlobalResponse;
  host: string;
}

interface IMatched {
  component: IComponent;
}

const Component = ({ component }: IMatched) => {

  const { id, content } = component;
  const Component = useComponent(id);
  
  return Component 
    ? <Component content={content} />
    : null;

};

const Page = ({ response, endpoint, global, host }: IProps) => {

  const { data } = useSWR(endpoint, fetcher, { initialData: response });
  const { asPath } = useRouter();
  const { saveEnv, saveHost } = useContext(EnvContext);
  const { refresh } = useContext(LazyContext);

  const { meta, hero, components } = data?.json;
  const isHome = asPath === '/';

  useEffect(() => {

    delay(300).then(() => lazyload());

  }, [asPath, refresh]);

  useEffect(() => {

    // endpoint is passed in from parent component (page file), these env values are only available server-side so we pass them in via the serverMarketing util
    if (endpoint) saveEnv(endpoint.substring(0, endpoint.indexOf('/api') + 4));

    // host is also passed in from parent component (page file) for the same reason
    if (host) saveHost(host);

  }, [endpoint, host]);

  return (
    <Indicator>
      <>
        <Head>
          <Meta meta={meta} />
          <Favicon />
        </Head>
        <Providers>
          <Layout global={global}
            theme={isHome ? 'admin' : 'employee'}
            isHome={isHome}>
            {hero && <Hero content={hero} />}
            {components?.map((component: IComponent, i: number) => {

              const { id } = component;

              return (
                <Component key={`${id}-${i}`} 
                  component={component} />
              );

            })}
          </Layout>
        </Providers>
      </>
    </Indicator>
  );

};

export default Page;
