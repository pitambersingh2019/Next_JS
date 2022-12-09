import { useRouter } from 'next/router';
import { Dashboard, SurveyResults } from '_organisms';
import { serverDashboard } from '_utils';

// the results page for a learning survey. The dynamic route param is the survey ID, which is passed in as props
const StandardSurveyResults = ({ endpoint, host }: IPage) => {

  // grab the survey ID from the URL to be passed to the component
  const router = useRouter();
  const { id } = router.query;

  return (
    <Dashboard endpoint={endpoint}
      host={host}
      title="Survey results">
      {id && (
        <SurveyResults surveyId={id}
          surveyType="Surveys" />
      )}
    </Dashboard>
  );

};

// call the serverDashboard() util to grab the env variables on the server & return to the Dashboard component via props
export const getServerSideProps = async () => serverDashboard();

export default StandardSurveyResults;
