import { useEffect, useRef } from 'react';

// very simple hook that leverages a ref to be able to tell whether a component has been mounted to the DOM 
const useMounted = (): { current: boolean } => {
  
  const componentIsMounted = useRef(true);

  useEffect(() => {

    return () => { componentIsMounted.current = false; };
  
  }, []);

  return componentIsMounted;

};

export default useMounted;