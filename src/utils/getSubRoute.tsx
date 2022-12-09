import hasSubRoute from './hasSubRoute';

// used to get the first level of a URL
const getSubRoute = (route: string): string => {

  // by default this will be the URL
  let subRoute = route;

  // if there is more than one level, we need to get the first one
  if (hasSubRoute(route)) subRoute = `/${route.split('/')[2]}`;

  return subRoute;

};

export default getSubRoute;
