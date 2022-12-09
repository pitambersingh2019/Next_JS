import { createContext } from 'react';

const EnvContext = createContext({
  env: '',
  saveEnv: (_: string) => {},
  host: '',
  saveHost: (_: string) => {}
});

export default EnvContext;
