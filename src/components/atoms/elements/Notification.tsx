import styles from './Notification.module.scss';

interface IProps {
  pings: number;
}

const Notification = ({ pings }: IProps) => (
  <aside role="alert" 
    className={styles.root}>
    { pings }
  </aside>
);

export default Notification;
