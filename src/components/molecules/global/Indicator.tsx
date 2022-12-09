import { useContext, useEffect } from 'react';
import { Router } from 'next/router';
import { LoadingContext } from '_context';

interface IProps {
  children: JSX.Element;
}

// generic warpper component that shows & hides the loading bar whenever a client-size redirect happens
const Indicator = ({ children }: IProps) => {

  const { setIsLoading } = useContext(LoadingContext);

  useEffect(() => {

    setIsLoading(false);

    Router.events.on('routeChangeStart', () => setIsLoading(true));
    Router.events.on('routeChangeComplete', () => setIsLoading(false));

    // garbage disposal to unsubscribe & boost performance 
    return () => {

      Router.events.off('routeChangeStart', () => setIsLoading(false));
      Router.events.off('routeChangeComplete', () => setIsLoading(false));

    };

  }, []);

  return children;

};

export default Indicator;
