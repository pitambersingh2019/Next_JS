import { DetailedHTMLProps, TextareaHTMLAttributes, RefObject } from 'react';
import Error from './../elements/Error';

type RefReturn =
  | string
  | ((instance: HTMLTextAreaElement | null) => void)
  | RefObject<HTMLTextAreaElement>
  | null
  | undefined;

type TextareaProps = DetailedHTMLProps<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  HTMLTextAreaElement
> & {
  name: string;
  label: string;
  prefill?: string;
  hideLabel?: boolean;
  heading?: string;
  placeholder?: string;
  rows?: number;
  hasError: boolean;
  errorMsg?: string;
  customMsg?: string;
  register: ({ required }: { required: string | boolean | undefined }) => RefReturn;
};

const Textarea = ({ name, label, prefill, hideLabel, heading, placeholder, rows = 2, hasError, errorMsg, customMsg, register, required }: TextareaProps) => {

  const errorMessage = customMsg ? customMsg : 'We need you to give some details here. Please try again';

  return (
    <label>
      {!hideLabel && (
        <>
          {heading && <h3 className="form--survey__title h5">{ heading }</h3>}
          {heading ? <p>{ label }</p> : <span className="label text--small">{ label }</span>}
        </>
      )}
      <textarea ref={register({ required: required ? errorMessage : false })}
        name={name}
        placeholder={placeholder ? placeholder : undefined}
        defaultValue={prefill ? prefill : undefined}
        rows={rows}
        aria-invalid={hasError ? 'true' : 'false'} />
      <Error message={errorMsg}
        expanded={hasError} />
    </label>
  );

};

export default Textarea;