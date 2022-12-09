import { Dashboard, PraiseEmployee } from '_organisms';
import { serverDashboard } from '_utils';

// the page where an admin user can send praise to one or several employees & teams
const PraiseEmployees = ({ endpoint, host }: IPage) => (
  <Dashboard endpoint={endpoint}
    host={host}
    title="Praise">
    <PraiseEmployee />
  </Dashboard>
);

// call the serverDashboard() util to grab the env variables on the server & return to the Dashboard component via props
export const getServerSideProps = async () => serverDashboard();

export default PraiseEmployees;
