import { useState } from 'react';

// similar to the LazyContext, used to manually refresh components via the key prop
const useRefresh = () => {

  const [refetch, setRefetch] = useState<number>(0);
  const [refresh, setRefresh] = useState<number>(1);

  const bumpRefetch = (): void => setRefetch(refetch + 1);

  const bumpRefresh = (): void => setRefresh(refresh + 1);

  return {
    refresh,
    refetch,
    bumpRefresh,
    bumpRefetch
  };

};

export default useRefresh;
