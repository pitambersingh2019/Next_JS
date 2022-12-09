import { DetailedHTMLProps, RefObject, SelectHTMLAttributes, useEffect, useState } from 'react';
import Error from './../elements/Error';
import Tooltip from './../elements/Tooltip';
import { Chevron } from '_vectors';

type RefReturn =
  | string
  | ((instance: HTMLSelectElement | null) => void)
  | RefObject<HTMLSelectElement>
  | null
  | undefined;

type SelectProps = DetailedHTMLProps<
  SelectHTMLAttributes<HTMLSelectElement>,
  HTMLSelectElement
> & {
  name: string;
  label: string;
  selected?: string;
  deselected?: string;
  options: IOption[];
  hasError: boolean;
  errorMsg?: string;
  customMsg?: string;
  required?: boolean;
  disabled?: boolean;
  showDisabled?: boolean;
  tooltip?: string;
  emitChange?: (value: any, name: string) => void;
  register: ({ validate }: { validate: (value: string) => boolean | string }) => RefReturn;
};

const Select = ({ name, label, selected, options, hasError, errorMsg, customMsg, disabled = false, showDisabled = true, tooltip, required, emitChange, register }: SelectProps) => {

  const [touched, setTouched] = useState<boolean>(false);
  const [value, setValue] = useState<string>(selected || label);
  const errorMessage = customMsg ? customMsg : 'Please select one of the options';

  const handleChange = (value: string) => {

    setValue(value);

    if (!touched && value !== '' && value !== 'default') setTouched(true);

    if (touched && (value === '' || value === 'default')) setTouched(false);

    if (emitChange) emitChange(value, name); 

  };

  useEffect(() => {

    if (selected) setValue(selected);

    if (!touched && selected !== '' && selected !== 'default') setTouched(true);

  }, [selected]);

  return (
    <label>
      <span className="label text--small">
        {tooltip ? (
          <Tooltip visible={label}
            hidden={tooltip} />
        ) : label}
      </span>
      <span className="label__icon">
        <select ref={register({ validate: value => required ? value !== label || errorMessage : true })}
          name={name}
          value={value}
          disabled={disabled}
          aria-invalid={hasError ? 'true' : 'false'}
          className={`form__input--${!touched ? 'in' : ''}valid`}
          onChange={(e) => handleChange(e.target.value)}>
          {showDisabled && <option disabled>{ label }</option>}
          {options.map(({ text, value, disabled }, i) => (
            <option key={`${value}-${i}`}
              value={value}
              disabled={disabled}>
              { text }
            </option>
          ))}
        </select>
        <Chevron />
      </span>
      <Error message={errorMsg}
        expanded={hasError} />
    </label>
  );

};

export default Select;
