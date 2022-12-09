import AbortController from 'abort-controller';
import { useContext, useState } from 'react';
import { EnvContext, LoadingContext } from '_context';
import { getRequestHeaders } from '_utils';
import useAuth from './useAuth';

const defaultMessage = 'Oops... Something went wrong. Please try again';
const timeout = 600000;

// used to handle all fetching logic, which in the dashboard side of the project is used extensively. Common methods here massively reduce the code in each component, as they can simply grab the values & methods they need in a single line. Probably the most helpful hook in terms of thinking when & why you'd used a custom hook to extract common logic & methods to one place in order to avoid being repeated in several components
const useFetch = () => {

  const { logOut } = useAuth();
  const { env } = useContext(EnvContext);
  const { setIsLoading } = useContext(LoadingContext);
  const [error, setError] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>(defaultMessage);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  // handle errors from the API in a graceful way & inform the user what's going on
  const stateError = (errorCode = 0) => {

    setIsLoading(false);
    setSuccess(false);
    setError(errorCode);

    switch (true) {

      case errorCode === 408:
        setErrorMessage('Oops... The server took too long to respond. Please try again');
        break;

      case errorCode === 401:
        setErrorMessage('Oops... Your session has expired. Please log in again');
        break;

      default:
        setErrorMessage(defaultMessage);
        break;

    }

  };

  // revert the hook state ready for a fresh API call
  const stateRevert = () => {
    
    setIsLoading(true);
    setSuccess(false);
    setError(null);
    setErrorMessage(defaultMessage);

  };

  // errors are first passed here in order to add the custom timeout message by manually setting 408 when our AbortController gets hit
  const handleError = (e: Error) => {

    console.log(e);

    e.name === 'AbortError'
      ? stateError(408)
      : stateError(); 

  };

  // extract common API response logic - which otherwise would've been repeated in both fetchData() & postData() methods
  const handleResponse = async (response: Response) => {

    const { ok, status } = response;

    // hide the loader as we either have success or error
    setIsLoading(false);

    if (ok) {

      // format the response into JSON
      const responseData = await response.json();

      setSuccess(true);
      setError(null);

      return responseData;

    } else {

      // log the user out via the useAuth() hook if their session has expired
      if (status === 401) logOut();

      setSuccess(false);
      setError(status);

      return status;

    }

  };

  // used to fetch data on the client side. Many components in the dashboard use this to load things like employee praise or team member listings 
  const fetchData = async (endpoint: string, mock = false) => {

    // to allow us to handle timeouts, we create a new AbortController instance
    const controller = new AbortController();
    const { signal } = controller;

    // if we don't have the env variable let's abort mission
    if (!env.length) return false;

    // make sure everything is fresh & nothing hanging around from last time
    stateRevert();

    // make sure we abort the request after our predetermined timeout duration
    const delay = setTimeout(() => {

      controller.abort();

    }, timeout);

    try {
  
      // perform a simple global fetch() call to an endpoint, passing cookies via the credentials header & allowing us to use the mock postman server by passing a boolean as the second param
      const response = await fetch(`${mock ? 'https://61ee609c-1a29-4120-84e6-83d42512359f.mock.pstmn.io/api' : env}${endpoint}`, mock ? {} : {
        credentials: 'include',
        headers: getRequestHeaders(),
        signal
      });

      // by this point, we have a response so we can bin off our abort timeout
      clearTimeout(delay);

      // call the above method to handle the response logic 
      return handleResponse(response);

    } catch (e) {

      // make sure we catch any errors & handle accordingly
      handleError(e as Error);

    }

  };

  // used to post & mutate data on the client side. Many components in the dashboard use this for things like survey submissions or editing employee data
  const postData = async (endpoint: string, data: any, processed = false, mock = false) => {

    // to allow us to handle timeouts, we create a new AbortController instance
    const controller = new AbortController();
    const { signal } = controller;

    // if we don't have the env variable let's abort mission
    if (!env.length) return false;

    // make sure everything is fresh & nothing hanging around from last time 
    stateRevert();

    // make sure we abort the request after our predetermined timeout duration 
    const delay = setTimeout(() => {

      controller.abort();

    }, timeout);

    // configure the base headers 
    const baseHeaders = {
      method: 'POST',
      body: processed ? data : JSON.stringify(data),
      signal
    };

    try {

      // perform a simple global fetch() call to an endpoint, the mock server needs a slightly different setup so just uses the base headers but for staging & production calls we add some extra headers
      const response = await fetch(`${mock ? 'https://61ee609c-1a29-4120-84e6-83d42512359f.mock.pstmn.io/api' : env}${endpoint}`, mock ? baseHeaders : {
        ...baseHeaders,
        credentials: 'include',
        headers: getRequestHeaders(processed)
      });

      // by this point, we have a response so we can bin off our abort timeout
      clearTimeout(delay);

      // call the above method to handle the response logic 
      return handleResponse(response);

    } catch (e) {

      // make sure we catch any errors & handle accordingly
      handleError(e as Error);

    }

  };

  return {
    env,
    error,
    errorMessage,
    submitted,
    success,
    setSubmitted,
    fetchData,
    postData
  };

};

export default useFetch;
