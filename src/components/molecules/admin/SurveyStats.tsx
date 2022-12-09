import styles from './SurveyStats.module.scss';

interface IProps {
  survey: ISurveyResults;
  surveyType: SurveyType;
  hasUnsentMembers: boolean;
  emitOpenResend: () => void;
  emitOpenRespondees: () => void;
}

// used to show a header containing survey stats & action buttons. Events emitted to be handled in the parent component (SurveyResults)
const SurveyStats = ({ survey, surveyType, hasUnsentMembers, emitOpenResend, emitOpenRespondees }: IProps) => {

  const { averageScore, haveResponded, recipientsAnswered, recipientTotal, responseRate, topicName, isAnonymous } = survey;
  const countText = `${recipientsAnswered} of ${recipientTotal}`;

  return (
    <article className={styles.root}>
      <ul>
        {!!topicName && (
          <li>
            <h2 className="text--small">Topic</h2>
            <span className="text--medium">{ topicName }</span>
          </li>
        )}
        {!!averageScore && (
          <li>
            <h2 className="text--small">Average mark</h2>
            <span className="text--medium">{ Math.round(averageScore) }%</span>
          </li>
        )}
        <li>
          <h2 className="text--small">Responses</h2>
          <span className="text--medium">{ countText }</span>
        </li>
        {(surveyType === 'Happiness' || surveyType === 'Surveys') && (
          <li>
            <h2 className="text--small">Anonymous responses</h2>
            <span className="text--medium">{isAnonymous ? 'Yes' : 'No'}</span>
          </li>
        )}
        {!!responseRate && (
          <li>
            <h2 className="text--small">Completion rate</h2>
            <span className="text--medium">{ Math.round(responseRate) }%</span>
          </li>
        )}
        {hasUnsentMembers && (
          <li className={styles.resend}>
            <h2 className="text--small">Missing recipients</h2>
            <button className="widget-link text--medium"
              onClick={emitOpenResend}>
              Send to other team members
            </button>
          </li>
        )}
      </ul>
    </article>
  );

};

export default SurveyStats;
