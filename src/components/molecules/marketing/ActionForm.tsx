import { ReactNode } from 'react';
import TabbedForm from './../global/TabbedForm';
import styles from './ActionForm.module.scss';

interface IProps {
  layout: 'single' | 'double';
  success: boolean;
  title?: string;
  heading: string;
  description?: string;
  thanks?: string;
  info?: string;
  button?: ILink;
  children?: ReactNode;
}

// used to add a heading & optional subheading to the TabbedForm component
const ActionForm = ({ layout, success, title, heading, description, thanks = 'Thanks', info, button, children }: IProps) => (
  <section className={`${styles.root}${title ? ' ' + styles.titled : ''} general`}>
    <div className="inner">
      {title ? (
        <>
          <h1 className="h5">{ title }</h1>
          <h2 className="h1">{ heading }</h2>
        </>
      ) : <h1>{ heading }</h1>}
      {description && <p>{ description }</p>}
      <TabbedForm success={success}
        thanks={thanks}
        info={info}
        button={button}
        classes={`${styles.holder} ${styles[layout]}`}>
        { children }
      </TabbedForm>
    </div>
  </section>
);

export default ActionForm;
