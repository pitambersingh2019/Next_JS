import styles from './UspBar.module.scss';

interface IContent {
  text: string;
}

export interface IProps {
  content: IContent;
}

// simple display component 
const UspBar = ({ content }: IProps) => (
  <section className={styles.root}>
    <div dangerouslySetInnerHTML={{ __html: content.text }} 
      className="inner" />
  </section>
);

export default UspBar;
