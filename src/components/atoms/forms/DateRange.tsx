import DateRangePicker from '@wojtekmaj/react-daterange-picker/dist/entry.nostyle';
import Error from './../elements/Error';
import styles from './DateRange.module.scss';

interface IProps {
  label: string;
  min?: string;
  max?: string;
  hasError: boolean;
  errorMsg?: string;
  expanded?: boolean;
  value: Date | Date[] | null | undefined;
  yearNav?: boolean;
  onChange: (() => void);
}

const DateRange = ({ label, min, max, hasError, errorMsg, expanded, value, yearNav = true, onChange }: IProps) => (
  <div className={`${styles.root}${expanded ? '' : ' ' + styles.hide}${yearNav ? ' show-year' : ''}`}>
    <DateRangePicker onChange={onChange} 
      value={value}
      name={label}
      minDate={min ? new Date(min) : undefined}
      maxDate={max ? new Date(max) : undefined}
      minDetail="year"
      calendarIcon={null}
      clearIcon={null}
      isOpen={true}
      showDoubleView={false} />
    <label>{ label }</label>
    <Error message={errorMsg}
      expanded={hasError} />
  </div>
);

export default DateRange;