import { ReactNode, useEffect, useState } from 'react';
import LoadingContext from './LoadingContext';

interface IProps {
	children: ReactNode;
}

const className = 'loading';

// used to keep track of global loading state (in order to do things like show & hide a loading bar)
const LoadingProvider = ({ children }: IProps) => {

  const [isFetched, setIsFetched] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {

    // toggle class on body which toggles loading bar visibility
    isLoading
      ? document.body.classList.add(className)
      : document.body.classList.remove(className);

  }, [isLoading]);

  return (
    <LoadingContext.Provider value={{ isFetched, isLoading, setIsFetched, setIsLoading }}>
      { children }
    </LoadingContext.Provider>
  );

};

export default LoadingProvider;
