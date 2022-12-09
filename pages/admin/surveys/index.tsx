import { Dashboard, SurveysOverview } from '_organisms';
import { serverDashboard } from '_utils';

const StandardSurveysDashboard = ({ endpoint, host }: IPage) => (
  <Dashboard endpoint={endpoint}
    host={host}
    title="Surveys">
    <SurveysOverview />
  </Dashboard>
);

// call the serverDashboard() util to grab the env variables on the server & return to the Dashboard component via props
export const getServerSideProps = async () => serverDashboard();

export default StandardSurveysDashboard;
