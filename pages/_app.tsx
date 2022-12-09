import type { AppProps /*, AppContext */ } from 'next/app';
import { EnvProvider, FilterProvider, LoadingProvider, ReportingProvider, SpaceProvider } from './../src/context';
import './../src/assets/styles/global.scss';

// this is the highest level file in a Next app, and it used to wrap the page files which then contain components. This is why the global styles are imported here, along with context providers for things that need to persist across pages (as opposed to within the same page)
const MyApp = ({ Component, pageProps }: AppProps) => (
  <EnvProvider>
    <FilterProvider>
      <LoadingProvider>
        <ReportingProvider>
          <SpaceProvider>
            <Component {...pageProps} />
          </SpaceProvider>
        </ReportingProvider>
      </LoadingProvider>
    </FilterProvider>
  </EnvProvider>
);

export default MyApp;
