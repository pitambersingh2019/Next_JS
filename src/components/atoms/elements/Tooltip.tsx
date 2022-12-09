import styles from './Tooltip.module.scss';

interface IProps {
  visible: string;
  hidden: string;
}

const Tooltip = ({ visible, hidden }: IProps) => (
  <span className={styles.root}>
    { visible }
    <aside className={`${styles.overlay} text--small`}>{ hidden }</aside>
  </span>
);

export default Tooltip;
