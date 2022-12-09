import { useRouter } from 'next/router';
import { FeedbackItem } from '_molecules';
import { Dashboard } from '_organisms';
import { serverDashboard } from '_utils';

// individual feedback item page, which uses a dynamic route param to fetch the feddback data from the API (if it exists) 
const IndividualFeedback = ({ endpoint, host }: IPage) => {

  const router = useRouter();
  const { id } = router.query;

  return (
    <Dashboard endpoint={endpoint}
      host={host}
      title="Feedback">
      {id && <FeedbackItem id={id} />}
    </Dashboard>
  );

};

// call the serverDashboard() util to grab the env variables on the server & return to the Dashboard component via props
export const getServerSideProps = async () => serverDashboard();

export default IndividualFeedback;
