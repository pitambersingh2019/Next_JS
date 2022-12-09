import { DetailedHTMLProps, InputHTMLAttributes, RefObject } from 'react';
import Error from './../elements/Error';
import { Check } from '_vectors';
import styles from './Checkbox.module.scss';

type RefReturn =
  | string
  | ((instance: HTMLInputElement | null) => void)
  | RefObject<HTMLInputElement>
  | null
  | undefined;

type InputProps = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  name: string;
  text: string;
  preselect?: boolean;
  hasError: boolean;
  errorMsg?: string;
  customMsg?: string;
  emitChange?: (value: boolean) => void;
  register: ({ required }: { required: string | boolean | undefined }) => RefReturn;
};

const Checkbox = ({ name, text, preselect, hasError, errorMsg, customMsg, emitChange, register, required }: InputProps) => (
  <label className={`${styles.root} form__checkbox`}>
    <span className={`${styles.text} text--medium`}>{ text }</span>
    <input ref={register({ required: required ? customMsg : false })}
      type="checkbox"
      name={name}
      className={styles.input}
      defaultChecked={preselect}
      onChange={(e) => emitChange && emitChange(e.target.checked)}
      aria-invalid={hasError ? 'true' : 'false'} />
    <span className={styles.indicator}>
      <Check />
    </span>
    <Error message={errorMsg}
      expanded={hasError} />
  </label>
);

export default Checkbox;
