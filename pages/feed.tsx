import { ActivityFeed, Dashboard } from '_organisms';
import { serverDashboard } from '_utils';

interface IProps {
  endpoint: string;
  host: string;
  company: string;
}

// the employee activity feed page
const Feed = ({ endpoint, host }: IProps) => ( 
  <Dashboard endpoint={endpoint}
    host={host}
    title="Feed">
    <ActivityFeed />
  </Dashboard>
);

// call the serverDashboard() util to grab the env variables on the server & return to the Dashboard component via props
export const getServerSideProps = async () => serverDashboard();

export default Feed;
