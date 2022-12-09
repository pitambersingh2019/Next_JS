import { Dashboard, ManagerDashboard } from '_organisms';
import { serverDashboard } from '_utils';

// the admin dashboard, where they can see an overview of culture, different survey types & relevant rankings or scores, praise & feedback
const AdminLanding = ({ endpoint, host }: IPage) => (
  <Dashboard endpoint={endpoint}
    host={host}
    title="Admin dashboard">
    <ManagerDashboard />
  </Dashboard>
);

// call the serverDashboard() util to grab the env variables on the server & return to the Dashboard component via props
export const getServerSideProps = async () => serverDashboard();

export default AdminLanding;
