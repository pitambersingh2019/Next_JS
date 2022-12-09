// count the number of slashes in a string, used to determine what level of the URL we are at
const hasSubRoute = (route: string): boolean => (route.match(/\//g) || []).length > 1;

export default hasSubRoute;
