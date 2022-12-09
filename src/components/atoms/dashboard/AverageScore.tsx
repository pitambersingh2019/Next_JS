import Tooltip from './../elements/Tooltip';
import { getScoreColour } from '_utils';
import styles from './AverageScore.module.scss';

interface IAverageScore extends IScore {
  visible: string;
  hidden: string;
  classes?: string;
}

const AverageScore = ({ number, percent = true, visible, hidden, classes }: IAverageScore) => (
  <figure className={`${styles.root}${classes ? ' ' + classes : ''}`}>
    <small>
      <Tooltip visible={visible}
        hidden={hidden} />
      {' '}is:
    </small>
    <h3 className={`average-blob--${getScoreColour(number, percent)} h3`}>{ number }{percent && '%'}</h3>
  </figure>
);

export default AverageScore;
