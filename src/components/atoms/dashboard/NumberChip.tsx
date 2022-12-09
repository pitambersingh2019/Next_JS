import { getScoreColour } from '_utils';
import styles from './NumberChip.module.scss';

const NumberChip = ({ number, percent = true }: IScore) => <span className={`${styles.root} average--${getScoreColour(number, percent)}`}>{ number }{percent && '%'}</span>;

export default NumberChip;
