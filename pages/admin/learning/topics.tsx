import { Dashboard, LearningTopics } from '_organisms';
import { serverDashboard } from '_utils';

// the learning topic admin page, where an admin user can add, edit & remove learning topics
const ManageLearningTopics = ({ endpoint, host }: IPage) => (
  <Dashboard endpoint={endpoint}
    host={host}
    title="Learning topics">
    <LearningTopics />
  </Dashboard>
);

// call the serverDashboard() util to grab the env variables on the server & return to the Dashboard component via props
export const getServerSideProps = async () => serverDashboard();

export default ManageLearningTopics;
