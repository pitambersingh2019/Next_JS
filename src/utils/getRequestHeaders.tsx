// used to get the relevant headers for the fetch requests, for things like file upload (e.g. for the user avatar) we there's a different config
const getRequestHeaders = (omitType = false): Headers => {

  const headers = new Headers();

  headers.append('Access-Token', '55ad9958-b729-4834-9de5-86eedab28g6t');

  if (!omitType) headers.append('Content-Type', 'application/json');

  return headers;

};

export default getRequestHeaders;
