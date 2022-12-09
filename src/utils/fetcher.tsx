import getRequestHeaders from './getRequestHeaders';

// generic fetch function used by the SWR approach
const fetcher = async (
  input: RequestInfo
) => {

  const headers = getRequestHeaders();
  const res = await fetch(input, { mode: 'no-cors', headers });
  const json = await res.json();

  return {
    json,
    status: res.status
  };

};

export default fetcher;
