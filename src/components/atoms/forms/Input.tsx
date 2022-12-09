import { DetailedHTMLProps, InputHTMLAttributes, RefObject } from 'react';
import Error from './../elements/Error';

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
  type: 'text' | 'email' | 'tel' | 'password';
  label: string;
  prefill?: string | string[];
  disabled?: boolean;
  hideLabel?: boolean;
  heading?: string;
  placeholder?: string;
  length?: number;
  compare?: string;
  hasError?: boolean;
  errorMsg?: string;
  customMsg?: string;
  autocomplete?: 'off' | undefined;
  emitChange?: (value: string) => void;
  register?: ({ required }: { required: string | boolean | undefined, pattern?: { value: RegExp, message: string }, minLength?: { value: number, message: string }, validate?: (value: string) => boolean | string }) => RefReturn;
};

const Input = ({ name, type, label, prefill, disabled = false, hideLabel = false, heading, placeholder, length, compare, hasError, errorMsg, customMsg, autocomplete = undefined, emitChange, register, required }: InputProps) => {
  
  const errorMessage = customMsg ? customMsg : 'We need you to fill in this field. Please try again';
  const emailMessage = `That email doesn't look quite right. Please check and try again`;
  const lengthMessage = `This needs to be at least ${length} characters long. Please check and try again`;
  const matchMessage = `Those passwords don't match. Please check and try again`;

  const emailRegex = /\S+@\S+\.\S+/;

  const registerObject = { 
    required: required ? errorMessage : false,
    pattern: type === 'email' ? { value: emailRegex, message: emailMessage } : undefined,
    minLength: length ? { value: length, message: lengthMessage } : undefined,
    validate: type === 'password' && compare ? (value: string) => value === compare || matchMessage : undefined
  };

  return (
    <label>
      {heading && <h3 className="form--survey__title h5">{ heading }</h3>}
      {!hideLabel && (
        heading 
          ? <p>{ label }</p> 
          : <span className="label text--small">{ label }</span>
      )}
      <input ref={register && register(registerObject)}
        name={name}
        type={type}
        disabled={disabled}
        autoComplete={autocomplete}
        placeholder={placeholder ? placeholder : undefined}
        defaultValue={prefill ? prefill : undefined}
        onChange={(e) => emitChange && emitChange(e.currentTarget.value)}
        aria-invalid={hasError ? 'true' : 'false'} />
      <Error message={errorMsg}
        expanded={hasError ? hasError : false} />
    </label>
  );

};

export default Input;
