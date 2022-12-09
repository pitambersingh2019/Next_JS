import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useFetch } from '_hooks';
import { Card } from '_atoms';
import styles from './PraiseSummary.module.scss';

interface IProps {
  classes?: string;
}

// used to show praise stats on the manager dashboard 
const PraiseSummary = ({ classes }: IProps) => {

  const { env, error, fetchData } = useFetch();
  const [weeklyPraises, setWeeklyPraises] = useState<number | null>(null);
  const [employeePraises, setEmployeePraises] = useState<number | null>(null);

  useEffect(() => {

    if (env) {

      fetchData('/praise/summary').then(response => {

        if (typeof response?.weeklyPraises === 'number' && typeof response?.employeePraises === 'number') {

          const { weeklyPraises, employeePraises } = response;
          
          setWeeklyPraises(weeklyPraises);
          setEmployeePraises(employeePraises);

        }

      });

    }

  }, [env]);

  return (
    <Card heading="Praise activity"
      icon="praise"
      loading={weeklyPraises === null && employeePraises === null}
      error={!!error}
      classes={`${styles.root}${classes ? ' ' + classes : ''}`}>
      <div className="statistics">
        <figure className="statistic">
          <h3 className="h1">{ weeklyPraises }</h3>
          <small>Praise{weeklyPraises !== 1 ? 's' : ''} given this week</small>
        </figure>
        <figure className="statistic">
          <h3 className="h1">{ employeePraises }</h3>
          <small>Praise{employeePraises !== 1 ? 's' : ''} given by employees this month</small>
        </figure>
      </div>
      <div className="card__actions">
        <Link href="/admin/praise">
          <a className="widget-link">Praise employees</a>
        </Link>
      </div>
    </Card>
  );

};

export default PraiseSummary;
