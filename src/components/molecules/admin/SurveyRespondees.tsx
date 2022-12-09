import dynamic from 'next/dynamic';
import styles from './SurveyParticipants.module.scss';

interface IProps {
  launch: boolean;
  haveResponded: string[];
  notResponded: string[];
  emitClose: () => void;
}

const Modal = dynamic(import('./../global/Modal'));

// used in SurveyResults to display a modal containing two lists of employee names - one for those who have responded to the survey, one for thos who haven't
const SurveyRespondees = ({ launch, haveResponded, notResponded, emitClose }: IProps) => (
  <Modal launch={launch}
    classes={`${styles.root} modal`}
    emitClose={emitClose}>
    <div className={styles.list}>
      <h2 className="h4">Responded</h2>
      <ul>
        {haveResponded.length ? haveResponded.map((person, i) => (
          <li key={`${person.split(' ')[0]}-${i}`}>
            { person }
          </li> 
        )) : <li>No responses yet</li>}
      </ul>
    </div>
    <div className={styles.list}>
      <h2 className="h4">Not responded</h2>
      <ul>
        {notResponded.length ? notResponded.map((person, i) => (
          <li key={`${person.split(' ')[0]}-${i}`}>
            { person }
          </li> 
        )) : <li>Everyone invited has responded</li>}
      </ul>
    </div>
  </Modal>
);

export default SurveyRespondees;
