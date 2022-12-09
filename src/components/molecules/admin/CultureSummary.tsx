import { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { Card } from '_atoms';
import { FilterContext } from '_context';
import RankingTable from './../global/RankingTable';
import { useFetch } from '_hooks';
import { getScoreColour, mapRanking } from '_utils';
import { Direction } from '_vectors';
import styles from './CultureSummary.module.scss';

interface IEmployee {
  id: number;
  name: string;
}

interface ICell {
  employee: IEmployee;
}

interface IProps {
  classes?: string;
}

// common code extracted here to keep things nice 'n DRY
const Cell = ({ employee }: ICell) => {
  
  const { id, name } = employee;

  return (
    <td className="text--medium">
      <Link href={`/admin/team/${id}`}>
        <a>
          { name }
        </a>
      </Link>
    </td>
  );
  
};

// this is the first component on the admin dashboard, showing the company 'engagement score' as well as optionally showing any top & bottom teams or employees 
const CultureOverview = ({ classes }: IProps) => {

  const { env, error, success, postData } = useFetch();
  const { dates } = useContext(FilterContext);
  const [average, setAverage] = useState<number>(0);
  const [teamsTop, setTeamsTop] = useState<string[]>([]);
  const [teamsBottom, setTeamsBottom] = useState<string[]>([]);
  const [employeesTop, setEmployeesTop] = useState<IEmployee[]>([]);
  const [employeesBottom, setEmployeesBottom] = useState<IEmployee[]>([]);
  const [trend, setTrend] = useState<number>(0);
  const colour = getScoreColour(average, false);
  const isSame = trend === 0;
  const isImprovement = trend > 0;
  const hasTeams = teamsTop.length > 0 && teamsBottom.length > 0;
  const hasEmployees = employeesTop.length > 0 && employeesBottom.length > 0;

  useEffect(() => {

    // when the env (on first load) or dates (when the calendar filter is used) changes, we need to refresh our data 
    if (env) {

      const data = { dates };

      postData('/culture/overview', data).then(response => {

        if (typeof response?.averageScore === 'number') {

          const { averageScore, trend, teams, employees } = response;
          const { top: topTeams, bottom: bottomTeams } = teams;
          const { top: topEmployees, bottom: bottomEmployees } = employees;

          setAverage(Math.round(averageScore));
          setTrend(trend);
          setTeamsTop(topTeams);
          setTeamsBottom(bottomTeams);
          // a client amend came in to limit the number of employees to four, was decided to do in the FE to avoid reworking a load of BE code
          setEmployeesTop(topEmployees.slice(0, 4));
          setEmployeesBottom(bottomEmployees.slice(0, 4));

        }
  
      });
  
    }
  
  }, [env, dates]);

  return (
    <Card heading="Culture overview"
      icon="culture"
      loading={!success && !error}
      error={!!error}
      classes={`${styles.root}${success && !error && hasTeams && hasEmployees ? ' ' + styles.divider : ''}${classes ? ' ' + classes : ''} card--table`}>
      <div className={styles.score}>
        <h3 className={`average-blob--${colour} h3`}>{ average }</h3>
        <h4>Engagement score
          {!isSame ? (
            <span className={isImprovement ? styles.improve : styles.decline}>
              <Direction />
              {trend}{isImprovement ? ' improvement' : ' reduction'} over this period
            </span>
          ) : (
            <span className="dash"> No change over this period</span>
          )}
        </h4>
      </div>
      {hasTeams && (
        <RankingTable surveyType="Culture"
          headings={[`Top team${teamsTop.length !== 1 ? 's' : ''}`, `Bottom team${teamsBottom.length !== 1 ? 's' : ''}`]}
          top={mapRanking(teamsTop)}
          bottom={mapRanking(teamsBottom)} />
      )}
      {hasEmployees && (
        <RankingTable surveyType="Culture"
          headings={['Most engaged', 'Least engaged']}>
          {employeesTop?.map((item, i) => (
            <tr key={`${item.id}-${i}`}>
              <Cell employee={item} />
              {employeesBottom[i] && <Cell employee={employeesBottom[i]} />}
            </tr>
          ))}
        </RankingTable>
      )}
    </Card>
  );

};

export default CultureOverview;
