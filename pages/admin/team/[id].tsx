import { useRouter } from 'next/router';
import { Dashboard, TeamProfile } from '_organisms';
import { serverDashboard } from '_utils';

// the profile page for a team member, where an admin user can edit their data & view their praise & survey responses. The dynamic route param is the employee ID, which is passed in as props
const TeamMemberProfile = ({ endpoint, host }: IPage) => {

  // grab the employee ID from the URL to be passed to the component
  const router = useRouter();
  const { id } = router.query;

  return (
    <Dashboard endpoint={endpoint}
      host={host}
      title="Team member">
      {id && <TeamProfile memberId={id} />}
    </Dashboard>
  );

};

// call the serverDashboard() util to grab the env variables on the server & return to the Dashboard component via props
export const getServerSideProps = async () => serverDashboard();

export default TeamMemberProfile;
