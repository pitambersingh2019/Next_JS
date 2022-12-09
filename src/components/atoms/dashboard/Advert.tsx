import styles from './Advert.module.scss';

interface IProps {
  classes?: string;
}

const Advert = ({ classes }: IProps) => (
  <article className={`${styles.root}${classes ? ' ' + classes : ''}`}>
    <h2 className="h4"></h2>
  </article>
);

export default Advert;
