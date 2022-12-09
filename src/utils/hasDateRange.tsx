// used to work out which pages should show the date range filters
const hasDateRange = (route: string): boolean => {

  const dateRangeRoutes = ['/admin/', '/admin/learning/', '/admin/happiness/', '/admin/surveys/'];
  const teamMemberRoute = '/admin/team/';
  const individualMemberPage = route.split('/');
  const isIndividualMemberPage = Number(individualMemberPage[3]);
  
  return dateRangeRoutes.includes(route) || route.includes(teamMemberRoute) && isIndividualMemberPage !== 0 && !isNaN(isIndividualMemberPage);
  
};
  
export default hasDateRange;
  