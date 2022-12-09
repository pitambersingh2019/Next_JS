import SortableTable from './../global/SortableTable';
import { Direction } from '_vectors';
import styles from './LearningTrends.module.scss';

interface IProps {
  trends: ITrend[];
}

// configure table head, specifying the string to display as well
const controls: IControl[] = [
  {
    text: 'Topic'
  },
  {
    text: 'Change'
  },
  {
    text: 'Score'
  }
];

// used to show a table of learning topics on the learning dashboard, along with trends (improvement or decline) in the current date range
const LearningTrends = ({ trends }: IProps) => {

  const numOfTrends = trends.length;
  
  return (
    <div className={styles.root}>
      {numOfTrends > 0 ? (
        <SortableTable controls={controls}>
          <tbody>
            {trends.map(({ topicId, topicName, change, averageScore }, i) => {

              const isSame = change === 0;
              const isImprovement = change > 0;
              const hasArrow = !isSame && (i === 0 || i === numOfTrends - 1);

              return (
                <tr key={`${topicId}-${i}`}>
                  <td className={`${hasArrow ? styles.arrow : ''}${!isSame && isImprovement ? ' ' + styles.improve : ''}${!isSame && !isImprovement ? ' ' + styles.decline : ''} text--medium`}>
                    {hasArrow && <Direction />}
                    { topicName }
                  </td>
                  <td className="text--small">{isImprovement && '+'}{ change }%</td>
                  <td className="text--small">{ Math.round(averageScore) }%</td>
                </tr>
              );
              
            })}
          </tbody>
        </SortableTable>
      ) : <p className="dash">No topics to display</p>}
    </div>
  );

};

export default LearningTrends;
