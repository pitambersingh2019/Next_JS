import { useEffect, useState } from 'react';
import { debounce } from '_utils';

interface IWindowSize {
  vw?: number;
  vh?: number;
}

interface IHook {
  hasWindow: boolean;
  windowSize: IWindowSize;
}

// used to check if we're client-side, as well as keep track of the viewport size
const useWindow = (): IHook => {

  const [windowSize, setWindowSize] = useState<IWindowSize>({
    vw: undefined,
    vh: undefined
  });

  // window doesn't exist on the server 
  const hasWindow = typeof window !== 'undefined';

  useEffect(() => {

    // only execute all the code below in client side
    if (hasWindow) {

      // debounce resize function (means that it waits until x milliseconds after the last function call)
      const handleResize = debounce((): void => {

        setWindowSize({
          vw: window.innerWidth,
          vh: window.innerHeight
        });

      }, 100);
    
      // call the resize function when the window is resized
      window.addEventListener('resize', handleResize);
      // call the resize function when the window changes from landscape to portrait (or vice versa)
      window.addEventListener('orientationchange', handleResize);
     
      handleResize();
    
      return () => {
        
        // remove the listeners when the component unmounts (essentially garbage collection - good for performance) 
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('orientationchange', handleResize);

      };

    }

  }, []);

  return { 
    hasWindow,
    windowSize
  };

};

export default useWindow;
