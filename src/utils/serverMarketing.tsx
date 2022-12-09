import fetcher from './fetcher';

// pages on the marketing side use server-side data fetching, so this is where we grab the data to be passed into pages & components via props. Extracted here to avoid being repeated in the getServerSideProps() method in each page file 
const serverMarketing = async (resolvedUrl = '', res: { statusCode: number; } | undefined, staticPage = false) => {

  const endpoint = staticPage ? '' : `${process.env.API_URL}/pages${resolvedUrl}`;
  // grab the page data, each page has a unique endpoint based on its URL (string value returned from resolvedUrl)
  const response = staticPage ? { status: 200 } : await fetcher(endpoint);
  // fetch the global data (for things like header, footer etc)
  const global = await fetcher(`${process.env.API_URL}/global`);

  // ensure 404 etc is set if page not found
  if (res && res.statusCode) res.statusCode = response.status;

  // return the data in the props object
  return { 
    props: {
      endpoint,
      response,
      global,
      host: process.env.HOST
    } 
  };

};

export default serverMarketing;
