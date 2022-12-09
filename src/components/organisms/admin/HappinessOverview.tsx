import { useContext, useEffect, useState } from 'react';
import { Button, Card } from '_atoms';
import SurveyOverview from './SurveyOverview';
import { FilterContext, LoadingContext, ReportingContext } from '_context';
import { useFetch, useRefresh } from '_hooks';
import styles from './HappinessOverview.module.scss';

// configure table head, specifying the string to display as well as the sorting metric & method
const tableControls: IControl[] = [
  {
    text: 'Name',
    metric: 'name',
    method: 'order'
  },
  {
    text: 'Average happiness',
    metric: 'averageScore',
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
  averageScore: null,
  responseRate: null,
  status: null
};

// the happiness survey dashboard; housing the graph, listing table & reporting filters 
const HappinessOverview = () => {

  const { reporting } = useContext(ReportingContext);
  const { env, error, errorMessage, postData } = useFetch();
  const { refresh, bumpRefresh } = useRefresh();
  const { dates } = useContext(FilterContext);
  const { isFetched, setIsFetched } = useContext(LoadingContext);
  const [summary, setSummary] = useState<ISummary | null>(null);
  const [graph, setGraph] = useState<IBarChart | null>(null);
  const [list, setList] = useState<ISurveyListing[]>([]);

  useEffect(() => {

    // this gets called whenever the dates or reporting context values change; or when a manual refresh is triggered 
    if (env) {

      // format data to be posted to the API, ensuring we overwrite any previously selected topic (from the learning dashboard)
      const data = { 
        ...reporting, 
        dates, 
        topic: null 
      };

      postData('/happiness/summary', data).then(response => {

        if (response?.summary) {
          
          // store the API response locally, which will get automatically injected into the child components to ensure the UI is always up to date with the applied dates & filters
          const { summary, list } = response;

          setSummary(summary);
          setGraph(summary.graph);
          setList(list);

          if (!isFetched) setIsFetched(true);

        }

      });
    
    }

  }, [env, refresh, dates, reporting]);

  return (
    <Card heading="Happiness"
      icon="happiness"
      loading={!summary && !error}
      error={!!error}
      errorMessage={errorMessage}
      classes={`${styles.root} card--dashboard card--table dashboard-single dashboard-single--wide`}>
      {summary && graph && list && (
        <SurveyOverview surveyType="Happiness"
          chart={{
            heading: 'Happiness score',
            score: summary.averageScore,
            graph
          }}
          table={{
            heading: 'List of happiness surveys',
            section: 'Happiness',
            list,
            controls: tableControls,
            order: tableOrder,
            isPercent: false
          }}
          emitRefresh={bumpRefresh}>
          <Button target="/admin/happiness/create" 
            text="Create a new happiness survey" 
            prominence="primary" />
          <Button target="/admin/happiness/values" 
            text="Manage company values" /> 
        </SurveyOverview>
      )}
    </Card>
  );

};

export default HappinessOverview;
