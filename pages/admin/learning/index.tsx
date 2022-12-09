import { Dashboard, LearningOverview } from '_organisms';
import { serverDashboard } from '_utils';

// the learning survey dashboard, where an admin user sees an overview of filterable data about company learning surveys
const LearningSurveysDashboard = ({ endpoint, host }: IPage) => (
  <Dashboard endpoint={endpoint}
    host={host}
    title="Learning">
    <LearningOverview />
  </Dashboard>
);

// call the serverDashboard() util to grab the env variables on the server & return to the Dashboard component via props
export const getServerSideProps = async () => serverDashboard();

export default LearningSurveysDashboard;
