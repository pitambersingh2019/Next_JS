import { Dashboard, TeamAdd } from '_organisms';
import { serverDashboard } from '_utils';

// the employee creation page
const CreateTeamMembers = ({ endpoint, host }: IPage) => (
  <Dashboard endpoint={endpoint}
    host={host}
    title="Add team member">
    <TeamAdd />
  </Dashboard>
);

// call the serverDashboard() util to grab the env variables on the server & return to the Dashboard component via props
export const getServerSideProps = async () => serverDashboard();

export default CreateTeamMembers;
