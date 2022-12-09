import { createContext } from 'react';

const LazyContext = createContext({
  refresh: 0,
  bumpRefresh: () => {}
});

export default LazyContext;
