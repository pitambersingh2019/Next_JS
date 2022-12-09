import { Dashboard, SurveyCreate } from '_organisms';
import { serverDashboard } from '_utils';

// the initial creation page for a happiness survey. Survey type & answer type props allow the SurveyCreate component to handle all survey types 
const DraftStandardSurvey = ({ endpoint, host }: IPage) => (
  <Dashboard endpoint={endpoint}
    host={host}
    title="Create a survey">
    <SurveyCreate surveyType="Surveys" 
      answerTypes={[1, 2, 3, 4, 5, 6]} />
  </Dashboard>
);

// call the serverDashboard() util to grab the env variables on the server & return to the Dashboard component via props
export const getServerSideProps = async () => serverDashboard();

export default DraftStandardSurvey;
