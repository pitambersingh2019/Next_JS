import { DetailedHTMLProps, InputHTMLAttributes, RefObject, useEffect, useState } from 'react';
import Checkbox from './Checkbox';

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
  label: string;
  heading?: string;
  options: IOptionCheckboxes[];
  customMsg?: string;
  emitChange?: () => any;
  register: ({ required }: { required: string | boolean | undefined }) => RefReturn;
  watch: (value: string) => boolean | undefined;
};

const Checkboxes = ({ name, label, heading, options, customMsg, emitChange, register, watch }: InputProps) => {

  const [error, setError] = useState<boolean>(false);
  const errorMessage = customMsg ? customMsg : 'We need you to check this box. Please try again';
  const values = options.map(option => watch(`${name}-${option.choiceId}`));

  useEffect(() => {

    const invalid = (!values.includes(true) && !values.includes(undefined));

    setError(invalid);

  }, [values]);

  return (
    <>
      {heading && <h3 className="form--survey__title h5">{ heading }</h3>}
      {heading ? <p>{ label }</p> : <span className="label text--small">{ label }</span>}
      {options.map(({ choiceId, text, value }, i) => (
        <Checkbox key={`${value}-${i}`}
          name={`${name}-${choiceId}`}
          text={text}
          hasError={error}
          errorMsg={i === options.length - 1 && error ? errorMessage : undefined}
          register={register}
          emitChange={() => emitChange && emitChange()} />
      ))}
    </>
  );

};

export default Checkboxes;
