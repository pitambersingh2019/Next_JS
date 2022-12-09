import getRoute from './getRoute';

// used to get the endpoint string, as the client kept changing their mind what the different survey types were called, e.g. 'training' became 'learning' & 'happiness trackers' became 'happiness surveys'. This ensured we didn't have to keep changing the code. It also allowed components like SurveyCreate & SurveyResults to remain DRY
const getEndpoint = (section: string): string => {

  let endpoint: string = getRoute(section);

  switch (true) {

    case endpoint === 'learning':
      endpoint = 'training';
      break;

    case endpoint === 'surveys':
      endpoint = 'standard';
      break;

    default:
      break;

  }

  return endpoint;

};

export default getEndpoint;
