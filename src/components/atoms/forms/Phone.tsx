import { DetailedHTMLProps, InputHTMLAttributes, useEffect, useRef } from 'react';
import Error from './../elements/Error';
import { Chevron } from '_vectors';
import styles from './Phone.module.scss';

type InputProps = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  name: string;
  label: string;
  hasError: boolean;
  errorMsg?: string;
  instance: intlTelInput.Plugin | null;
  value: string;
  onChange: ((number: string) => void);
  onInit: ((ref: Element) => void);
};

const Phone = ({ name, label, hasError, errorMsg, instance, value, onChange, onInit }: InputProps) => {

  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {

    if (ref?.current) onInit(ref.current);

  }, []);

  return ( 
    <label className={styles.root}> 
      <span className="label text--small">{ label }</span> 
      <input ref={ref} 
        onChange={() => instance && onChange(instance.getNumber())} 
        value={value} 
        type="tel" 
        name={name} 
        className={styles.input} 
        aria-invalid={hasError ? 'true' : 'false'} /> 
      <Chevron />
      <Error message={errorMsg}
        expanded={hasError} />
    </label> 
  );

};

export default Phone;
