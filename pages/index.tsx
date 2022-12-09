import { Page, IPage } from '_organisms';
import { isCompany, serverMarketing } from '_utils';

// the home page, modern day equivalent of the index.html file :)
const Home = ({ response, endpoint, global, host }: IPage) => (
  <Page response={response}
    endpoint={endpoint}
    global={global}
    host={host} />
);

// this is where the data gets fetched server-side. getServerSideProps() is fetched at request time, to fetch at build time you'd replace this with getStaticProps(). Whatever is returned by these two methods is passed as props to the component above 
export const getServerSideProps = async ({ req, res, resolvedUrl }: IPageContext) => {

  // redirect to dashboard if company subdomain is present
  if (isCompany(req)) {

    return {
      redirect: {
        destination: `/dashboard`,
        permanent: false
      }
    };

  }

  // fetch & return the relevant data for our page, extracted away into the serverMarketing() util as this is used by a few page files on the marketing site
  return serverMarketing(resolvedUrl, res);

};

export default Home;
