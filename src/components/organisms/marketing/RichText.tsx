import styles from './RichText.module.scss';

interface IContent {
  text: string;
}

export interface IProps {
  content: IContent;
}

// simple display component rendering HTML from an Umbraco WYSIWYG
const RichText = ({ content }: IProps) => (
  <section className={`${styles.root} general`}>
    <div className="inner">
      <div dangerouslySetInnerHTML={{ __html: content.text }} 
        className={`${styles.holder} content`} />
    </div>
  </section>
);

export default RichText;
