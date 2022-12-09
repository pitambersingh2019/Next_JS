import { useContext, useEffect, useState } from 'react';
import { Button, Card } from '_atoms';
import SurveyOverview from './SurveyOverview';
import { FilterContext, LoadingContext, ReportingContext } from '_context';
import { useFetch, useRefresh } from '_hooks';
import { sortTrends } from '_utils';
import styles from './LearningOverview.module.scss';

// configure table head, specifying the string to display as well as the sorting metric & method
const tableControls: IControl[] = [
  {
    text: 'Name',
    metric: 'name',
    method: 'order'
  },
  {
    text: 'Topic',
    metric: 'topic',
    method: 'order'
  },
  {
    text: 'Average mark',
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
  topic: null,
  averageScore: null,
  responseRate: null,
  status: null
};

// the learning survey dashboard; housing the graph, topic trend table, listing table & reporting filters 
const LearningOverview = () => {

  const { reporting } = useContext(ReportingContext);
  const { env, error, errorMessage, postData } = useFetch();
  const { refresh, bumpRefresh } = useRefresh();
  const { dates } = useContext(FilterContext);
  const { isFetched, setIsFetched } = useContext(LoadingContext);
  const [summary, setSummary] = useState<ISummary | null>(null);
  const [graph, setGraph] = useState<IBarChart | null>(null);
  const [trends, setTrends] = useState<ITrend[]>([]);
  const [list, setList] = useState<ISurveyListing[]>([]);

  useEffect(() => {

    // this gets called whenever the dates or reporting context values change; or when a manual refresh is triggered 
    if (env) {

      // format data to be posted to the API, ensuring we overwrite any previously selected company value (from the happiness dashboard)
      const data = { 
        ...reporting, 
        dates, 
        companyValue: null 
      };

      postData('/training/summary', data).then(response => {

        if (response?.list) {

          // store the API response locally, which will get automatically injected into the child components to ensure the UI is always up to date with the applied dates & filters
          const { graph, list, trends } = response;
          
          setSummary(response);
          setTrends(sortTrends(trends));
          setGraph(graph);
          setList(list);

          if (!isFetched) setIsFetched(true);

        }

      });

    }

  }, [env, refresh, dates, reporting]);

  return (
    <Card heading="Learning"
      icon="learning"
      loading={!summary && !error}
      error={!!error}
      errorMessage={errorMessage}
      classes={`${styles.root} card--dashboard card--table dashboard-single dashboard-single--wide`}>
      {summary && graph && trends && list && (
        <SurveyOverview surveyType="Learning"
          chart={{
            heading: 'Knowledge score',
            score: summary.averageScore,
            graph
          }}
          topics={{
            heading: 'Topic performance trends',
            trends
          }}
          table={{
            heading: 'List of learning',
            section: 'Learning',
            list,
            controls: tableControls,
            order: tableOrder,
            isPercent: true
          }}
          emitRefresh={bumpRefresh}>
          <Button target="/admin/learning/create"
            text="Create new learning"
            prominence="primary" />
          <Button target="/admin/learning/topics"
            text="Manage topics" />
        </SurveyOverview>
      )}
    </Card>
  );

};

export default LearningOverview;
