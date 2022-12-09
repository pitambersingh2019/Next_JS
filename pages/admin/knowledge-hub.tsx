import { Dashboard, WhitepapersList } from '_organisms';
import { serverDashboard } from '_utils';

// a page which lists any uploaded whitepapers 
const KnowledgeHub = ({ endpoint, host }: IPage) => (
  <Dashboard endpoint={endpoint}
    host={host}
    title="Whitepapers">
    <WhitepapersList />
  </Dashboard>
);

// call the serverDashboard() util to grab the env variables on the server & return to the Dashboard component via props
export const getServerSideProps = async () => serverDashboard();

export default KnowledgeHub;
