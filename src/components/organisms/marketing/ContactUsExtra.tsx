import styles from './ContactUsExtra.module.scss';

interface IContent {
  heading: string;
  text: string;
}

export interface IProps {
  content: IContent;
}

// simple disaply component
const ContactUsExtra = ({ content }: IProps) => {

  const { heading, text } = content;

  return (
    <section className={styles.root}>
      <div className="inner">
        <h2>{ heading }</h2>
        <div dangerouslySetInnerHTML={{ __html: text }} />
      </div>
    </section>
  );

};

export default ContactUsExtra;
