import { useContext, useEffect, useState } from 'react';
import { FilterContext } from '_context';
import BarChart from './BarChart';
import SurveyList from './SurveyList';
import { useFetch, useRefresh } from '_hooks';
import styles from './TeamMetric.module.scss';

interface IProps {
  memberId?: string | string[];
}

// define table header & sorting methods
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
    text: 'Mark',
    metric: 'mark',
    method: 'order'
  },
  {
    text: 'Average mark',
    metric: 'averageScore',
    method: 'order'
  }
];

// define order of table cells
const tableOrder: ISurveyListingOrder = {
  name: null,
  topic: null,
  mark: null,
  averageScore: null
};

// used to display an employee's learning score, graph & table listing of their completed learning surveys 
const TeamLearning = ({ memberId }: IProps) => {

  const { env, postData } = useFetch();
  const { dates } = useContext(FilterContext);
  const { refresh, bumpRefresh } = useRefresh();
  const [summary, setSummary] = useState<ISummary | null>(null);
  const [graph, setGraph] = useState<IBarChart | null>(null);
  const [list, setList] = useState<ISurveyListing[] | null>(null);

  useEffect(() => {

    // fetch the learning data for that employee over the selected time range 
    if (env && memberId) {

      const data = { dates }; 

      postData(`/training/summary/${memberId}`, data).then(response => {

        if (response?.graph && response?.list) {

          const { graph, list } = response;

          setSummary(response);
          setGraph(graph);
          setList(list);

        }

      });

    }

  }, [env, dates, refresh]);

  return (
    summary && graph && list && (
      list.length > 0 ? (
        <>
          <div className={styles.graph}>
            <h3 className="h4">Learning score</h3>
            <BarChart score={summary.averageScore}
              graph={graph} />
          </div>
          <SurveyList section="Learning"
            surveys={list}
            controls={tableControls}
            order={tableOrder}
            isPercent={true}
            memberId={memberId}
            emitRefresh={bumpRefresh} />
        </>
      ) : <p className="padded">This employee hasn't completed any learning surveys</p>
    )
  );

};

export default TeamLearning;
