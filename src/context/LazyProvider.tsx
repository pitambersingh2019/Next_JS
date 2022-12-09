import { ReactNode, useState } from 'react';
import LazyContext from './LazyContext';

interface IProps {
	children: ReactNode;
}

const LazyProvider = ({ children }: IProps) => {

  const [refresh, setRefresh] = useState<number>(0);

  // a way of manually refreshing components with the key prop 
  const bumpRefresh = () => setRefresh(refresh + 1);

  return (
    <LazyContext.Provider value={{ refresh, bumpRefresh }}>
      { children }
    </LazyContext.Provider>
  );

};

export default LazyProvider;
