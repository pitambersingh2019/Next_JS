import { DetailedHTMLProps, InputHTMLAttributes, RefObject, useEffect, useState } from 'react';
import Error from './../elements/Error';
import styles from './Toggle.module.scss';

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
  emitChange?: () => void;
  register: ({ required }: { required: string | boolean | undefined }) => RefReturn;
};

const Toggle = ({ name, text, preselect = false, hasError, errorMsg, customMsg, emitChange, register, required }: InputProps) => {

  const [checked, setChecked] = useState<boolean>(preselect);

  const handleChange = () => {

    setChecked(v => !v);

    if (emitChange) emitChange();

  };

  useEffect(() => {

    setChecked(preselect);

  }, [preselect]);
  
  return (
    <label className={`${styles.root} form__checkbox`}>
      <span className={`${styles.text} text--medium`}>{ text }</span>
      <input ref={register({ required: required ? customMsg : false })}
        type="checkbox"
        name={name}
        className={styles.input}
        checked={checked}
        onChange={handleChange}
        aria-invalid={hasError ? 'true' : 'false'} />
      <span className={styles.indicator}>Indicator</span>
      <Error message={errorMsg}
        expanded={hasError} />
    </label>
  );

};
  
export default Toggle;