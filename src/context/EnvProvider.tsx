import { ReactNode, useState } from 'react';
import EnvContext from './EnvContext';

interface IProps {
	children: ReactNode;
}

// save the environment & host variables (dotenv's process.env etc), these are only accessible server-side but we need them for the URL of API calls - so we pass it from getServerSideProps() to the Dashboard or Page component via props before storing here to be used globally
const EnvProvider = ({ children }: IProps) => {

  const [env, setEnv] = useState<string>('');
  const [host, setHost] = useState<string>('');

  const saveEnv = (endpoint: string) => setEnv(endpoint);

  const saveHost = (host: string) => setHost(host);

  return (
    <EnvContext.Provider value={{ env, saveEnv, host, saveHost }}>
      { children }
    </EnvContext.Provider>
  );

};

export default EnvProvider;
