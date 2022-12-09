import { Dashboard } from '_organisms';
import { EmployeeProfile } from '_organisms';
import { serverDashboard } from '_utils';

interface IProps {
  endpoint: string;
  host: string;
  company: string;
}

// the employee profile page
const Profile = ({ endpoint, host }: IProps) => (
  <Dashboard endpoint={endpoint}
    host={host}
    title="Profile">
    <EmployeeProfile />
  </Dashboard>
);

// call the serverDashboard() util to grab the env variables on the server & return to the Dashboard component via props
export const getServerSideProps = async () => serverDashboard();

export default Profile;
