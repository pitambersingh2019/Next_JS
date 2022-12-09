import { useEffect, useState } from 'react';
import { Expander } from '_molecules';
import styles from './Error.module.scss';

interface IProps {
  message?: string;
  expanded: boolean;
  persist?: boolean;
}

const Error = ({ message, expanded, persist }: IProps) => {

  const [error, setError] = useState<string>('');

  useEffect(() => {

    message && setError(message);

  }, [message]);

  return persist ? (
    <Expander expanded={expanded}>
      <span role="alert"
        className={styles.root}>
        { error }
      </span>
    </Expander>
  ) : (
    <Expander expanded={!!(expanded && error.length)}
      emitComplete={() => setError('')}>
      <span role="alert"
        className={styles.root}>
        { error }
      </span>
    </Expander>
  );

};

export default Error;
