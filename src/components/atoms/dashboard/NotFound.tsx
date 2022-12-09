import styles from './NotFound.module.scss';

interface IProps {
  classes?: string;
}

const NotFound = ({ classes }: IProps) => (
  <div className={`${styles.root}${classes ? ' ' + classes : ''}`}>
    <h3>Oops</h3>
    <p>Something went wrong while trying to fetch the data. Please try again</p>
  </div>
);

export default NotFound;