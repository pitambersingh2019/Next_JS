import { Dashboard, HappinessOverview } from '_organisms';
import { serverDashboard } from '_utils';

// the happiness survey dashboard, where an admin user sees an overview of filterable data about company happiness surveys
const HappinessSurveysDashboard = ({ endpoint, host }: IPage) => (
  <Dashboard endpoint={endpoint}
    host={host}
    title="Happiness">
    <HappinessOverview />
  </Dashboard>
);

// call the serverDashboard() util to grab the env variables on the server & return to the Dashboard component via props
export const getServerSideProps = async () => serverDashboard();

export default HappinessSurveysDashboard;
