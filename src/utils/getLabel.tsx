// similar to the getEndpoint() util, this was used to get the correct visual label for the different survey types & meant we didn't have to change the code when the client changed their mind about the names of survey types. It also allowed components like SurveyCreate & SurveyResults to remain DRY
const getLabel = (surveyType: string, lowercase = false): string => {

  let label = '';

  switch (true) {

    case (surveyType === 'Happiness'):
      label = 'Happiness survey';
      break;

    case (surveyType === 'Surveys'):
      label = 'Survey';
      break;

    case (surveyType === 'Learning'):
      label = 'Learning';
      break;

    default:
      break;

  }

  if (lowercase) label = label.toLowerCase();

  return label;

};

export default getLabel;