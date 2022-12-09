import { Dashboard, PartnersList } from '_organisms';
import { serverDashboard } from '_utils';

// rewards available to employees are listed here
const Rewards = ({ endpoint, host }: IPage) => (
  <Dashboard endpoint={endpoint}
    host={host}
    title="Rewards">
    <PartnersList />
  </Dashboard>
);

// call the serverDashboard() util to grab the env variables on the server & return to the Dashboard component via props
export const getServerSideProps = async () => serverDashboard();

export default Rewards;
