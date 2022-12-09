import { Page, IPage } from '_organisms';
import { isCompany, serverMarketing } from '_utils';

// a page with a URL which is defined in Umbraco - the square brackets signify a dynamic route param. The resolved value for this can be accessed with asPath (client-side) or resolvedUrl (server-side) 
const Route = ({ response, endpoint, global, host }: IPage) => (
  <Page response={response}
    endpoint={endpoint}
    global={global}
    host={host} />
);

// this is where the data gets fetched server-side. getServerSideProps() is fetched at request time, to fetch at build time you'd replace this with getStaticProps(). Whatever is returned by these two methods is passed as props to the component above 
export const getServerSideProps = async ({ req, res, resolvedUrl }: IPageContext) => {

  // redirect to non-admin route if company subdomain is present
  if (isCompany(req)) {

    const host = process.env.HOST;

    return res?.redirect(`http://www.${host}${host?.includes('local') ? ':3020' : ''}${resolvedUrl}`);

  }

  // fetch & return the relevant data for our page, extracted away into the serverMarketing() util as this is used by a few page files on the marketing site
  return serverMarketing(resolvedUrl, res);

};

export default Route;
