import { useRouter } from 'next/router';
import { Dashboard, EmployeeSurvey } from '_organisms';
import { serverDashboard } from '_utils';

// a standard survey page, where an employee answers & submits the various questions on an individual survey. The dynamic route param is the survey ID, which is passed in as props, along with survey type prop which allows the EmployeeSurvey component to handle all survey types 
const CompleteStandardSurvey = ({ endpoint, host }: IPage) => {

  // grab the survey ID from the URL to be passed to the component 
  const router = useRouter();
  const { id } = router.query;

  return (
    <Dashboard endpoint={endpoint}
      host={host}
      title="Employee survey">
      {id && (
        <EmployeeSurvey surveyId={id}
          surveyType="Surveys" />
      )}
    </Dashboard>
  );

};

// call the serverDashboard() util to grab the env variables on the server & return to the Dashboard component via props
export const getServerSideProps = async () => serverDashboard();

export default CompleteStandardSurvey;
