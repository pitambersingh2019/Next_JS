import { Arrow } from '_vectors';
import styles from './NextPrev.module.scss';

interface IProps {
  disable: boolean;
  isPrev: boolean;
  emitClick: (prev: boolean) => void;
}

const NextPrev = ({ disable, isPrev, emitClick }: IProps) => (
  <button className={`${styles.root}${isPrev ? ' ' + styles.prev : ''}`}
    disabled={disable}
    type="button"
    onClick={() => emitClick(isPrev)} 
    aria-label={isPrev ? 'Previous' : 'Next'}>
    { isPrev ? 'Previous' : 'Next' }
    <Arrow />
  </button>
);

export default NextPrev;
