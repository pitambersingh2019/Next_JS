import DateRangePicker from '@wojtekmaj/react-daterange-picker/dist/entry.nostyle';
import Error from './../elements/Error';
import { useWindow } from '_hooks';
import styles from './Dates.module.scss';

interface IProps {
  label: string;
  min: string;
  max: string;
  hasError: boolean;
  errorMsg?: string;
  value: Date | Date[] | null | undefined;
  onChange: (() => void);
}

const Dates = ({ label, min, max, hasError, errorMsg, value, onChange }: IProps) => {

  const { vw } = useWindow().windowSize;

  return (
    <label className={styles.root}>
      <DateRangePicker onChange={onChange} 
        value={value}
        name={label}
        minDate={new Date(min)}
        maxDate={new Date(max)}
        minDetail="year"
        calendarIcon={null}
        clearIcon={null}
        isOpen={true}
        showDoubleView={vw && vw > 799} />
      <Error message={errorMsg}
        expanded={hasError} />
    </label>
  );

};

export default Dates;