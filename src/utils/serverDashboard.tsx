// as pages on the dashboard side use client-side fetching, we only need the environment variables from the getServerSideProps() in the dashboard pages. This is extracted here to keep those files reyt DRY
const serverDashboard = async () => {

  // return the data in the props object
  return {
    props: {
      endpoint: process.env.API_URL,
      host: process.env.HOST
    }
  };

};

export default serverDashboard;
