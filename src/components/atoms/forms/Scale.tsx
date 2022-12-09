import { DetailedHTMLProps, InputHTMLAttributes, RefObject, useState } from 'react';
import Error from './../elements/Error';
import styles from './Scale.module.scss';

type RefReturn =
  | string
  | ((instance: HTMLInputElement | null) => void)
  | RefObject<HTMLInputElement>
  | null
  | undefined;

type ScaleProps = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  name: string;
  type: 'emoji' | 'normal';
  label: string;
  heading?: string;
  limit?: number;
  worst?: string;
  best?: string;
  hasError: boolean;
  errorMsg?: string;
  customMsg?: string;
  register: ({ required }: { required: string | boolean | undefined }) => RefReturn;
};

const Scale = ({ name, type, label, heading, limit = 5, worst, best, hasError, errorMsg, customMsg, register, required }: ScaleProps) => {

  const [touched, setTouched] = useState<boolean>(false);
  const errorMessage = customMsg ? customMsg : 'We need you to choose an option. Please try again';

  return (
    <div className={styles.root}>
      {heading && <h3 className="form--survey__title h5">{ heading }</h3>}
      {heading ? <p>{ label }</p> : <span className="label text--small">{ label }</span>}
      <div className={`${styles.options}${limit > 5 ? ' ' + styles.expanded : ''} ${type === 'emoji' ? styles.emoji : styles.scale}${touched ? ' ' + styles.touched : ''}`}>
        {Array(limit).fill('').map((_, i) => {

          const indexed = i + 1;

          return (
            <label key={`${label}-${i}`}>
              <span className={styles.label}>
                { label ? label : heading }
                , option 
                { indexed }
              </span>
              <input ref={register({ required: required ? errorMessage : false })}
                type="radio"
                name={name}
                value={indexed}
                className={styles.input}
                onChange={() => setTouched(true)} />
              <span className={styles.indicator} />
            </label>
          );

        })}
      </div>
      {worst && best && (
        <div className={`${styles.labels}${limit > 5 ? ' ' + styles.expanded : ''}`}>
          <span className="text--small">{ worst }</span>
          <span className="text--small">{ best }</span>
        </div>
      )}
      <Error message={errorMsg}
        expanded={hasError} />
    </div>
  );

};

export default Scale;
