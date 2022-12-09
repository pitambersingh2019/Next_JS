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
  }
];

// define order of table cells (less important here as we're only listing the name)
const tableOrder: IOrder = {
  name: null
};

// used to display an employee's happiness score, graph & table listing of their completed happiness surveys 
const TeamHappiness = ({ memberId }: IProps) => {

  const { env, postData } = useFetch();
  const { dates } = useContext(FilterContext);
  const { refresh, bumpRefresh } = useRefresh();
  const [summary, setSummary] = useState<ISummary | null>(null);
  const [graph, setGraph] = useState<IBarChart | null>(null);
  const [list, setList] = useState<ISurveyListing[] | null>(null);

  useEffect(() => {

    // fetch the happiness data for that employee over the selected time range 
    if (env && memberId) {

      const data = { dates }; 

      postData(`/happiness/summary/${memberId}`, data).then(response => {

        if (response?.summary && response?.list) {

          const { summary, list } = response;

          setSummary(summary);
          setGraph(summary.graph);
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
            <h3 className="h4">Happiness score</h3>
            <BarChart score={summary.averageScore}
              graph={graph} />
          </div>
          <SurveyList section="Happiness"
            surveys={list}
            controls={tableControls}
            order={tableOrder}
            isPercent={false}
            memberId={memberId}
            emitRefresh={bumpRefresh} />
        </>
      ) : <p className="padded">This employee hasn't completed any happiness surveys</p>
    )
  );

};

export default TeamHappiness;
