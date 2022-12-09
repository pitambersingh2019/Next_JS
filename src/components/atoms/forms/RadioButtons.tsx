import { DetailedHTMLProps, InputHTMLAttributes, RefObject } from 'react';
import Radio from './Radio';

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
  label: string;
  heading?: string;
  options: IOption[];
  preselect?: string;
  hasError: boolean;
  errorMsg?: string;
  customMsg?: string;
  register: ({ required }: { required: string | boolean | undefined }) => RefReturn;
};

const RadioButtons = ({ name, label, heading, options, preselect, hasError, errorMsg, customMsg, register, required }: RadioProps) => {

  const errorMessage = customMsg ? customMsg : 'We need you to choose an option. Please try again';

  return (
    <>
      {heading && <h3 className="form--survey__title h5">{ heading }</h3>}
      {heading ? <p>{ label }</p> : <span className="label text--small">{ label }</span>}
      {options.map(({ text, value }, i) => (
        <Radio key={`${value}-${i}`}
          name={name}
          text={text}
          value={value}
          preselect={preselect ? preselect : undefined}
          hasError={hasError}
          errorMsg={i === options.length - 1 && hasError ? errorMsg : undefined}
          customMsg={errorMessage ? errorMessage : undefined}
          register={register}
          required={required} />
      ))}
    </>
  );

};

export default RadioButtons;
