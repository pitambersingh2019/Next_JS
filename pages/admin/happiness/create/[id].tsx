import { useRouter } from 'next/router';
import { Dashboard, SurveyCreate } from '_organisms';
import { serverDashboard } from '_utils';

// the creation page for an existing draft happiness survey (which only exists after it's been created initially in the sibling index.tsx file). The dynamic route param is the survey ID, which is passed in as props, along with survey type & answer type props which allow the SurveyCreate component to handle all survey types 
const NewHappinessSurvey = ({ endpoint, host }: IPage) => {

  // grab the survey ID from the URL to be passed to the component 
  const router = useRouter();
  const { id } = router.query;

  return (
    <Dashboard endpoint={endpoint}
      host={host}
      title="Edit a happiness survey">
      {id && (
        <SurveyCreate surveyId={id}
          surveyType="Happiness" 
          answerTypes={[1, 5, 6]} />
      )}
    </Dashboard>
  );

};

// call the serverDashboard() util to grab the env variables on the server & return to the Dashboard component via props
export const getServerSideProps = async () => serverDashboard();

export default NewHappinessSurvey;
