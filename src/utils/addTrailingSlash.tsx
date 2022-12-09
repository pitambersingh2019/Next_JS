// adds a slash character to end of a string
const addTrailingSlash = (path: string): string => path.endsWith('/') ? path : `${path}/`;

export default addTrailingSlash;
