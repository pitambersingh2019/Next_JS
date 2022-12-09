// take user to a new page via a good old fashioned window.location (this would avoid Next client-side redirect)
const redirect = (target: string) => window.location.href = target;

export default redirect;
