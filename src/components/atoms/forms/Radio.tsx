import { DetailedHTMLProps, InputHTMLAttributes, RefObject } from 'react';
import Error from './../elements/Error';
import styles from './Radio.module.scss';

type RefReturn =
  | string
  | ((instance: HTMLInputElement | null) => void)
  | RefObject<HTMLInputElement>
  | null
  | undefined;

type RadioProps = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  name: string;
  text: string;
  value: string;
  preselect?: string;
  hasError: boolean;
  errorMsg?: string;
  customMsg?: string;
  register: ({ required }: { required: string | boolean | undefined }) => RefReturn;
};

const Radio = ({ name, text, value, preselect, hasError, errorMsg, customMsg, register, required }: RadioProps) => (
  <label className={`${styles.root} form__radio`}>
    <span className={`${styles.text} text--medium`}>{ text }</span>
    <input ref={register({ required: required ? customMsg : false })}
      type="radio"
      name={name}
      value={value}
      className={styles.input}
      defaultChecked={preselect === value ? true : false} />
    <span className={styles.indicator} />
    <Error message={errorMsg}
      expanded={hasError} />
  </label>
);

export default Radio;
