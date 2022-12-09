import { Dashboard, TeamList } from '_organisms';
import { serverDashboard } from '_utils';

// the page which lists  all employee is the company. The admin user has the ability to filter the list or delete team members
const TeamMemberListing = ({ endpoint, host }: IPage) => (
  <Dashboard endpoint={endpoint}
    host={host}
    title="Team">
    <TeamList />
  </Dashboard>
);

// call the serverDashboard() util to grab the env variables on the server & return to the Dashboard component via props
export const getServerSideProps = async () => serverDashboard();

export default TeamMemberListing;
