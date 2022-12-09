// filters out surveys with a 'status' string of 'Draft' from an array of surveys
const filterDraftSurveys = (list: ISurveyListing[]): ISurveyListing[] => list.filter(({ status }: ISurveyListing) => status !== 'Draft');

export default filterDraftSurveys;
