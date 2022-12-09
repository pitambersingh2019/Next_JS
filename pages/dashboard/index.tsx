import { Dashboard, EmployeeDashboard } from '_organisms';
import { serverDashboard } from '_utils';

// the employee dashboard, where they can see their knowledge score, prompts to complete surveys, the option to send praise to a colleague & submit feedback, & also see a list of discounts availble to them (this is controlled on a company-by-company basis, so only visible to employees of a company who have this feature) 
const EmployeeLanding = ({ endpoint, host }: IDashboard) => (
  <Dashboard endpoint={endpoint}
    host={host}
    title="Dashboard">
    <EmployeeDashboard />
  </Dashboard>
);

// call the serverDashboard() util to grab the env variables on the server & return to the Dashboard component via props
export const getServerSideProps = async () => serverDashboard();

export default EmployeeLanding;
