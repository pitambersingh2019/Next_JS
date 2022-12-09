import dayjs from 'dayjs';
import { globals } from '_utils';
import styles from './Category.module.scss';

interface IProps {
  anonymous?: boolean;
  category?: string;
  date?: Date;
  classes?: string;
}

const { longDate } = globals;

const Category = ({ anonymous, category, date, classes }: IProps) => (
  <ul className={`${styles.root}${classes ? ' ' + classes : ''}`}>
    {category && <li className={`${styles.category} text--small`}>{ category }</li>}
    {anonymous && <li className={`${styles.anonymous} text--small`}>This survey is anonymous</li>}
    {date && <li className={`${styles.date} text--small`}>Created { dayjs(date).format(longDate) }</li>}
  </ul>
);

export default Category;
