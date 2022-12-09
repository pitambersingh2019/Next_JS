import { Dashboard, HappinessValues } from '_organisms';
import { serverDashboard } from '_utils';

// the company value admin page, where an admin user can add, edit & remove company values
const ManageCompanyValues = ({ endpoint, host }: IPage) => (
  <Dashboard endpoint={endpoint}
    host={host}
    title="Happiness company values">
    <HappinessValues />
  </Dashboard>
);

// call the serverDashboard() util to grab the env variables on the server & return to the Dashboard component via props
export const getServerSideProps = async () => serverDashboard();

export default ManageCompanyValues;
