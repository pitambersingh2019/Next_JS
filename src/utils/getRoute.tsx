// similar to the getEndpoint() & getLabel() utils, this allowed us to change the URL path in one place if the client wanted to change the name of a survey type. It also allowed components like SurveyCreate & SurveyResults to remain DRY
const getRoute = (section: string): string => {

  let route = '';

  switch (true) {

    case section === 'Happiness':
      route = 'happiness';
      break;
      
    case (section === 'Survey' || section === 'Surveys'):
      route = 'surveys';
      break;

    case section === 'Learning':
      route = 'learning';      
      break;

    default:
      break;

  }

  return route;

};

export default getRoute;