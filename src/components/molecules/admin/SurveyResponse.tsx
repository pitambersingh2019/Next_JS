import { ReactNode, useEffect, useState } from 'react';
import { Correct, Incorrect } from '_vectors';
import { delay } from '_utils';
import styles from './SurveyResponse.module.scss';

interface IGraph {
  totalAnswered?: number;
  noneResponded: boolean;
  hasCorrect?: boolean;
}

interface IProps {
  response: ISurveyResponse;
  noneResponded?: boolean;
  isSummary?: boolean;
  isMarked?: boolean;
  classes?: string;
  children?: ReactNode;
}

// used to display a horizontal bar chart, e.g. to show things like how many users chose each option for a mutliple choice question 
const Graph = ({ totalAnswered = 0, noneResponded = false, hasCorrect = false }: IGraph) => {
  
  const [animate, setAnimate] = useState<boolean>(false);
  const percentage = `${totalAnswered}%`;

  useEffect(() => {

    // delay slightly before firing animations 
    delay(100).then(() => setAnimate(true));

  }, []);

  return (
    <figure className={`${styles.chart}${noneResponded ? ' ' + styles.immediate : ''}${animate ? ' ' + styles.animate : ''}`}>
      {hasCorrect && <span className={`${styles.percent} text--small`}>{ percentage }</span>}
      <div className={styles.bar} 
        style={{ ['--width' as string]: percentage }}>
        <span className={`${styles.percent} text--small`}>{ percentage }</span>
      </div>
    </figure>
  );

};

// used in various places (incl. SurveyResults & EmployeeSurvey) to show responses to a survey. Handles all the various question types, rendering an optional bar chart if there are statistics to display 
const SurveyResponse = ({ response, noneResponded = false, isSummary = false, isMarked = true, classes, children }: IProps) => {

  const { question, type, answers } = response;

  // get the class names for the list item, extracted here as was very hard to read inline 
  const getClassNames = (correct: boolean | undefined, userAnswered: boolean | undefined): string => {

    let classNames = '';

    if (isMarked && correct || !isMarked && userAnswered) classNames += ` ${styles.incorrect}`;

    if (isMarked && !correct) classNames += ` ${styles.incorrect}`;

    if (correct && !isSummary && !userAnswered) classNames += ` ${styles.missed}`;

    if (userAnswered) classNames += ` ${styles.answered}`;

    if (isSummary) classNames += ` ${styles.charts}`;

    return classNames;

  };

  return (
    <article className={`${styles.root}${classes ? ' ' + classes : ''}`}>
      <h3 className="text--body">{ question }</h3>
      {answers.length > 0 && (
        <ul className={`${styles.answers}${type === 6 && !isSummary ? ' ' + styles.horizontal : ''}`}>
          {type === 1 && (
            <>
              {answers.map(({ text, correct, userAnswered, totalAnswered }, i) => (
                <li key={`${text?.split(' ')[0]}-${i}`}
                  className={getClassNames(correct, userAnswered)}>
                  <div className={styles.answer}>
                    {isSummary ? (
                      <>
                        {correct && <Correct />}
                        {!correct && <span className={styles.option}>Option</span>}
                      </>
                    ) : (
                      isMarked ? (
                        <>
                          {correct && <Correct />}
                          {!correct && userAnswered && <Incorrect />}
                          {!correct && !userAnswered && <span className={styles.option}>Option</span>}
                        </>
                      ) : (
                        <>
                          {userAnswered && <Correct />}
                          {!userAnswered && <span className={styles.option}>Option</span>}
                        </>
                      )
                    )}
                    <span className="text--small">{ text }</span>
                  </div>
                  {isSummary && (
                    <Graph totalAnswered={totalAnswered}
                      noneResponded={noneResponded}
                      hasCorrect={correct} />
                  )}
                </li>
              ))}
            </>
          )}
          {(type === 2 || type === 3) && (
            <>
              {answers.map(({ text }, i) => (
                <li key={`${text?.split(' ')[0]}-${i}`}
                  className={`${styles.text} text--small`}>{ text }
                </li>
              ))}
            </>
          )}
          {type === 4 && (
            <>
              {answers.map(({ text, totalAnswered, userAnswered }, i) => (
                <li key={`${text}-${i}`}
                  className={isSummary ? styles.charts : undefined}>
                  <div className={styles.answer}>
                    <span className={`${styles.check}${userAnswered ? ' ' + styles.checked : ''}`}>Checkbox</span>
                    <span className="text--small">{ text }</span>
                  </div>
                  {isSummary && (
                    <Graph totalAnswered={totalAnswered}
                      noneResponded={noneResponded} />
                  )}
                </li>
              ))}
            </>
          )}
          {type === 5 && (
            <>
              {answers.map(({ totalAnswered, userAnswered, label }, i) => (
                <li key={`${totalAnswered}-${i}`}
                  className={isSummary ? ' ' + styles.charts : ''}>
                  <div className={styles.answer}>
                    <span className={`${styles.option}${userAnswered ? ' ' + styles.chosen : ''}`}>Option</span>
                    <span className="text--small">{ i + 1 }{label ? ' - ' + label : ''}</span>
                  </div>
                  {isSummary && (
                    <Graph totalAnswered={totalAnswered}
                      noneResponded={noneResponded} />
                  )}
                </li>
              ))}
            </>
          )}
          {type === 6 && (
            <>
              {answers.map(({ totalAnswered, userAnswered }, i) => (
                <li key={`${totalAnswered}-${i}`}
                  className={`${styles.emoji}${isSummary ? ' ' + styles.charts : ''}`}>
                  <div className={`${styles.answer}${!isSummary && !userAnswered ? ' ' + styles.unselected : ''}`}>
                    <span>Emoji</span>
                  </div>
                  {isSummary && (
                    <Graph totalAnswered={totalAnswered}
                      noneResponded={noneResponded} />
                  )}
                </li>
              ))}
            </>
          )}
        </ul>
      )}
      { children && children }
    </article>
  );

};

export default SurveyResponse;
