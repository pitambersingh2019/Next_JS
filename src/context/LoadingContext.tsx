import { createContext } from 'react';

const LoadingContext = createContext({
  isFetched: false,
  isLoading: false,
  setIsFetched: (_: boolean) => {},
  setIsLoading: (_: boolean) => {}
});

export default LoadingContext;
