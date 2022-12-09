import { Fragment, ReactNode, useContext, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { BarChart, SurveyList, LearningTrends, ReportingFilters } from '_molecules';
import { ReportingContext } from '_context';
import { useFetch, useRefresh } from '_hooks';
import { getLabel, globals } from '_utils';
import styles from './SurveyOverview.module.scss';

interface IActive {
  metric: string;
  value: string;
}

interface ISection {
  heading: string;
}

interface IChart extends ISection {
  score: number;
  graph: IBarChart;
}

interface ITopics extends ISection {
  trends: ITrend[];
}

interface ITable extends ISection {
  section: SurveyType;
  list: ISurveyListing[];
  controls: IControl[];
  order: ISurveyListingOrder;
  isPercent: boolean;
}

interface IProps {
  surveyType: SurveyType;
  chart?: IChart;
  topics?: ITopics;
  table: ITable;
  children: ReactNode;
  emitRefresh: () => void;
}

// used to structure the survey type dashboards & extract repeated code from HappinessOverview, LearningOverview & SurveysOverview
const SurveyOverview = ({ surveyType, chart, topics, table, children, emitRefresh }: IProps) => {

  const { env, fetchData } = useFetch();
  const { reporting, saveReporting } = useContext(ReportingContext);
  const { refresh, bumpRefresh } = useRefresh();
  const [activeFilters, setActiveFilters] = useState<IActive[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [companyValues, setCompanyValues] = useState<ICompanyValue[]>([]);
  const [learningTopics, setLearningTopics] = useState<ITopic[]>([]);
  const { heading, section, list, controls, order, isPercent } = table;
  const isLearning = surveyType === 'Learning';

  // remove a currently spplied reporting filter (which appear in a conditionally-rendered linear nav)
  const removeFilter = (metric: string): IActive[] => {

    // get a copy of the currently applied filters
    let reportingFilters = { ...reporting };
    // create new array containing only active filters
    let remainingFilters = activeFilters.filter(item => item.metric !== metric);

    if (metric === 'all') {

      // the user has tried to clear all filters
      remainingFilters = [];
      // reset to global defaults (null values) to overwrite those that are currently applied
      reportingFilters = globals.defaultReporting;

      // overwrite the reporting context with the default values, which will update for all places subscribed to the context
      saveReporting(reportingFilters);
    
    } else {

      // the user has chosen to remove a particular filter, so set that value back to null
      reportingFilters[metric] = null;

      // overwrite the reporting context with the updated values, which will update for all places subscribed to the context 
      saveReporting(reportingFilters);
    
    }

    // manually refresh the UI, which will ensure the modal is up to date 
    bumpRefresh();

    // return updated array for testing purposes 
    return remainingFilters;

  };

  useEffect(() => {

    // when the reporting filters change, we want to create an array of active filters to display in the active filter nav 
    const calcFilters = Object.entries(reporting).filter(([_, value]) => value !== null).map(([key, value]) => ({
      metric: key,
      value: key === 'topic' ? learningTopics.find(({ id }) => id === value)?.name ?? '' : value || ''
    }));

    // store these locally 
    setActiveFilters(calcFilters);

  }, [reporting]);

  useEffect(() => {

    // fetch company values to optionally pass into the ReportingFilters component (saves doing fetches in there unnecessarily)
    if (env && surveyType === 'Happiness') {

      fetchData('/company-values/all').then(response => {

        if (response?.length) setCompanyValues(response);

      });
    
    }

    // fetch learning topics to optionally pass into the ReportingFilters component (saves doing fetches in there unnecessarily)
    if (env && isLearning) {

      fetchData('/training-topics/all').then(response => {

        if (response?.length) setLearningTopics(response);

      });
    
    }
  
  }, [env]);

  return (
    <>
      <div className={styles.actions}>
        <button type="button"
          className={`${styles.reporting} widget-link text--small`}
          onClick={() => setModalOpen(true)}>
          Reporting filters
        </button>
        {activeFilters.length > 0 && (
          <button type="button"
            className={`${styles.reporting} widget-link text--small`}
            onClick={() => removeFilter('all')}>
            Clear filters
          </button>
        )}
      </div>
      {activeFilters.length > 0 && (
        <nav className={styles.filters}>
          <small>Reporting on:</small>
          <ul>
            {activeFilters?.map(({ metric, value }, i) => (
              <li key={`${metric}-${i}`}>
                <button className={`${styles.filter} widget-link text--small`}
                  onClick={() => removeFilter(metric)}>
                  { metric === 'employeeStartDate' ? 'Started ' + dayjs(value).format('D/M/YY') : value }{ metric === 'team' ? ' team' : '' }
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}
      {chart && (
        <div className={styles.overview}>
          <section className={styles.graph}>
            <h3 className="h4">{ chart.heading }</h3>
            <BarChart score={chart.score}
              graph={chart.graph} />
          </section>
          {topics && (
            <section className={styles.trends}>
              <h3 className="h4 card--table__subheader">{ topics.heading }</h3>
              <LearningTrends trends={topics.trends} />
            </section>
          )}
        </div>
      )}
      <section className={styles.list}>
        {list.length > 0 ? (
          <>
            <h3 className="h4 card--table__subheader">{ heading }</h3>
            <SurveyList section={section}
              surveys={list}
              controls={controls}
              order={order}
              isPercent={isPercent}
              emitRefresh={emitRefresh} />
          </>
        ) : <p className="create padded">There's no data to display. If you're currently using reporting filters, please choose a larger date range or fewer filters. Or, you can create a { getLabel(surveyType, true) }{isLearning ? ' or topic' : ''} below</p>}
      </section>
      <div className="actions padded">
        { children }
      </div>
      <Fragment key={refresh}>
        <ReportingFilters launch={modalOpen}
          companyValues={companyValues.length > 0 ? companyValues.map(({ name }) => name) : []}
          topics={learningTopics.length > 0 ? learningTopics.map(({ name, id }) => ({ text: name, value: id })) : []}
          emitClose={() => setModalOpen(false)} />
      </Fragment>
    </>
  );

};

export default SurveyOverview;
