import { ChangeEvent, DetailedHTMLProps, SelectHTMLAttributes, useEffect, useState } from 'react';
import { Chevron } from '_vectors';
import styles from './Dropdown.module.scss';

type SelectProps = DetailedHTMLProps<
  SelectHTMLAttributes<HTMLSelectElement>,
  HTMLSelectElement
> & {
  name: string;
  label: string;
  options: IOption[];
  selected?: string;
  active?: boolean;
  aligned?: boolean
  emitChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
};

const Dropdown = ({ name, label, options, selected, active, aligned = false, emitChange }: SelectProps) => {

  const [value, setValue] = useState<string>('');

  const onChange = (e: ChangeEvent<HTMLSelectElement>): void => {

    setValue(e.target.value);

    emitChange && emitChange(e);

  };

  useEffect(() => {

    selected && setValue(selected);

  }, [selected]);

  return (
    <label>
      <span className="label">{ label }</span>
      <select name={name}
        value={value ? value : label}
        className={`${styles.input}${active ? ' ' + styles.active : ''}${aligned ? ' ' + styles.aligned : ''}`}
        onChange={onChange}>
        {!value && <option disabled>{ label }</option>}
        {options.map(({ text, value }) => (
          <option key={value}
            value={value}>
            { text }
          </option>
        ))}
      </select>
      <Chevron />
    </label>
  );

};

export default Dropdown;
