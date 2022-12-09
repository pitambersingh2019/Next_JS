import { useContext, useEffect, useState } from 'react';
import { Button, Card } from '_atoms';
import SurveyOverview from './SurveyOverview';
import { FilterContext, LoadingContext, ReportingContext } from '_context';
import { useFetch, useRefresh } from '_hooks';
import styles from './SurveysOverview.module.scss';

// configure table head, specifying the string to display as well as the sorting metric & method
const tableControls: IControl[] = [
  {
    text: 'Name',
    metric: 'name',
    method: 'order'
  },
  {
    text: 'Response rate',
    metric: 'responseRate',
    method: 'order'
  },
  {
    text: 'Status',
    metric: 'status',
    method: 'order'
  },
  {
    text: 'Actions'
  }
];

// values for this can be anything as the keys are just used to order the object (using Object.assign)
const tableOrder: ISurveyListingOrder = {
  name: null,
  responseRate: null,
  status: null
};

const SurveysOverview = () => {

  const { reporting } = useContext(ReportingContext);
  const { env, error, postData } = useFetch();
  const { refresh, bumpRefresh } = useRefresh();
  const { dates } = useContext(FilterContext);
  const { isFetched, setIsFetched } = useContext(LoadingContext);
  const [list, setList] = useState<ISurveyListing[] | null>(null);

  useEffect(() => {

    // this gets called whenever the dates or reporting context values change; or when a manual refresh is triggered 
    if (env) {

      // format data to be posted to the API, ensuring we overwrite any previously selected topic (from the learning dashboard)
      const data = { 
        ...reporting, 
        dates, 
        companyValue: null,
        topic: null 
      };
  
      postData('/standard/summary', data).then(response => {
  
        if (response?.list) {
          
          // store the API response locally, which will get automatically injected into the child components to ensure the UI is always up to date with the applied dates & filters
          setList(response.list);
  
          if (!isFetched) setIsFetched(true);
  
        } 
  
      });

    }

  }, [env, refresh, dates, reporting]);

  return (
    <Card heading="Surveys"
      icon="survey"
      loading={!list && !error}
      error={!!error}
      classes={`${styles.root} card--dashboard card--table dashboard-single dashboard-single--wide`}>
      {list && (
        <SurveyOverview surveyType="Surveys"
          table={{
            heading: 'List of surveys',
            section: 'Surveys',
            list,
            controls: tableControls,
            order: tableOrder,
            isPercent: false
          }}
          emitRefresh={bumpRefresh}>
          <Button target="/admin/surveys/create"
            text="Create a new survey"
            prominence="primary" />
        </SurveyOverview>
      )}
    </Card>
  );

};

export default SurveysOverview;
