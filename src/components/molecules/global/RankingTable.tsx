import { useContext, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { Direction } from '_vectors';
import { ReportingContext } from '_context';
import { getRoute } from '_utils';
import styles from './RankingTable.module.scss';

interface ICell {
  surveyType: SurveyType;
  content: IRanking;
}

interface IProps {
  surveyType: SurveyType;
  headings: string[];
  top?: IRanking[];
  bottom?: IRanking[];
  classes?: string;
  children?: ReactNode;
}

// each individual table cell, extracted here as there could be an uneven number in each table column 
const Cell = ({ surveyType, content }: ICell) => {

  const router = useRouter();
  const { reporting, saveReporting } = useContext(ReportingContext);
  const { text, metric } = content;

  // if the cell item is also a reporting filter, we can apply that filter & take the user to the relevant survey dashboard
  const handleClick = (text: string, metric: string): void => {

    // save filter into reporting context
    saveReporting({ ...reporting, [metric]: text });

    // navigate to the survey section
    router.push(`/admin/${getRoute(surveyType)}`);

  };

  return (
    <td className="text--medium">
      {metric ? (
        <button className={`${styles.button} text--medium`}
          onClick={() => handleClick(text, metric)}>
          { text }
        </button>
      ) : <span className={styles.text}>{ text }</span>}
    </td>
  );

};

// used to display top x & bottom x number of items in the Admin Dashboard (e.g. employee superstars, top company values or bottom teams)
const RankingTable = ({ surveyType, headings, top, bottom, classes, children }: IProps) => (
  <table className={`${styles.root}${classes ? ' ' + classes : ''}`}>
    <thead>
      <tr>
        {headings.map((heading, i) => (
          <th key={`${heading}-${i}`}
            className="text--small">
            <div className={`${styles.change} ${i < 1 ? styles.improve : styles.decline}`}>
              <Direction />
              { heading }
            </div>
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {children ? children : top?.map((item, i) => (
        <tr key={`${item.text}-${i}`}>
          <Cell surveyType={surveyType}
            content={item} />
          {bottom && bottom[i] && (
            <Cell surveyType={surveyType}
              content={bottom[i]} />
          )}
        </tr>
      ))}
    </tbody>
  </table>
);

export default RankingTable;
