import { useEffect, useRef, useState } from 'react';
import DatePicker from 'react-calendar';
import dayjs from 'dayjs';
import Error from './../elements/Error';
import { Calendar, Cross } from '_vectors';
import { useExpanded, useRefresh } from '_hooks';
import { globals } from '_utils';
import styles from './Date.module.scss';

interface IProps {
  label: string;
  min?: string;
  max?: string;
  placeholder?: string;
  hasError: boolean;
  errorMsg?: string;
  value: string;
  yearNav?: boolean;
  onChange: ((date: string) => void);
  emitOpen?: (() => void) | undefined;
  emitClose?: (() => void) | undefined;
}

const { isoDate, shortDate } = globals;

const DateInput = ({ label, min, max, placeholder = 'Select a date', hasError, errorMsg, value, yearNav = true, onChange, emitOpen, emitClose }: IProps) => {

  const calRef = useRef<HTMLDivElement>(null);
  const { expanded, toggleExpanded } = useExpanded();
  const { refresh, bumpRefresh } = useRefresh();
  const [date, setDate] = useState<string | null>(null);

  const handleChange = (inputted: Date | Date[]) => {

    if (!Array.isArray(inputted)) setDate(dayjs(inputted).format(isoDate));

  };

  const handleClear = () => {

    onChange('');
    setDate(null);
    bumpRefresh();

  };

  useEffect(() => {

    if (date) {

      onChange(date);
      toggleExpanded();

    }

  }, [date]);

  useEffect(() => {

    if (expanded) {
     
      calRef.current?.scrollIntoView({ block: 'nearest', inline: 'end', behavior: 'smooth' });

      if (emitOpen) emitOpen();
    
    }

    if (!expanded && emitClose) emitClose();

  }, [expanded]);

  return (
    <div className={styles.root}>
      <div className={styles.label}>
        <span className="label text--small">{ label }</span>
        <div onClick={toggleExpanded}
          className={`${expanded ? styles.expanded + ' ' : ''}form__date`}>
          <span className={`${styles.value} form__input--${value ? '' : 'in'}valid`}>{value ? dayjs(value).format(shortDate) : placeholder}</span>
          {expanded && value !== '' ? (
            <button className={styles.clear}
              onClick={handleClear}>
              <Cross />
            </button>
          ) : <Calendar />}
        </div>
        <Error message={errorMsg}
          expanded={hasError} />
      </div>
      <label>
        <input type="date" 
          name={label}
          value={value}
          readOnly={true} />
      </label>
      <div ref={calRef}
        className={`${styles.calendar}${expanded ? ' ' + styles.open : ''}${yearNav ? ' show-year' : ''}`}>
        <DatePicker key={refresh}
          value={value ? new Date(value) : undefined}
          onChange={handleChange}
          minDate={min ? new Date(min) : undefined}
          maxDate={max ? new Date(max) : undefined}
          minDetail="year" /> 
      </div>
    </div>
  );

};

export default DateInput;
