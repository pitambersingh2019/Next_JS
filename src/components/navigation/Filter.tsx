import { useContext, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import { Button, DateRange, Restricted } from '_atoms';
import Hidden from './Hidden';
import { Chevron } from '_vectors';
import { FilterContext, LoadingContext } from '_context';
import { useExpanded, useRefresh, useWindow } from '_hooks';
import { globals } from '_utils';
import styles from './Filter.module.scss';

interface IFilterButtons {
  expanded?: boolean;
  toggleExpanded: () => void;
}

interface DateLabelButton {
  text: string;
}

const { dateLabels, isoDate, shortDate } = globals;
const { labelLastYear, labelLastHalfYear, labelLastQuarter, labelLastMonth, labelCustom } = dateLabels;
const promptLabel = 'Viewing data from:';
const dateRangeButtons: DateLabelButton[] = [
  {
    text: labelLastYear
  },
  {
    text: labelLastHalfYear
  },
  {
    text: labelLastQuarter
  },
  {
    text: labelLastMonth
  }
];

// used to render the actual buttons, extracted here to keep parent component nice 'n DRY
const Buttons = ({ expanded, toggleExpanded }: IFilterButtons) => {

  const { control, watch } = useForm({ mode: 'onSubmit' });
  const { active, dates, label, saveDateRange } = useContext(FilterContext);
  const { start: startDate, end: endDate } = dates;
  const { isFetched, isLoading } = useContext(LoadingContext);
  const { refresh, bumpRefresh } = useRefresh();
  const [customInteracted, setCustomInteracted] = useState<boolean>(false);
  const { vw } = useWindow().windowSize;
  const selectedRange = watch('dateRangeField');
  const isCustom = !dateRangeButtons.map(item => item.text).includes(active);
  const disable = !isFetched || isLoading;
  const today = dayjs().format(isoDate);

  // work out what dates each of the fixed time period buttons will apply, calculated in the past from today 
  const calcButtonRange = (targetRange: string) => {

    let start = '';

    switch (true) {

      case (targetRange === labelLastYear):
        start = dayjs().subtract(1, 'year').format(isoDate);
        break;

      case (targetRange === labelLastHalfYear):
        start = dayjs().subtract(6, 'month').format(isoDate);
        break;

      case (targetRange === labelLastQuarter):
        start = dayjs().subtract(3, 'month').format(isoDate);
        break;

      case (targetRange === labelLastMonth):
        start = dayjs().subtract(1, 'month').format(isoDate);
        break;
      
      default:
        break;

    }

    const end = today;
    const data = { start, end };

    // save in global context
    saveDateRange(targetRange, data, labelCustom);
    bumpRefresh();

    if (expanded) toggleExpanded();

  };

  // work out what values to pass to save from the calendar plugin (passed in as an array of 2 strings when both dates are selected)
  const calcCalendarRange = (value: string[]) => {

    if (!customInteracted) setCustomInteracted(true);

    const first = dayjs(value[0]);
    let second = dayjs(value[1]);

    // used to fix a higholighting bug where midnight was playing silly buggers. Minus 1 second to fix!
    if (!customInteracted) second = second.subtract(1, 'second');
   
    const start = first.format(isoDate);
    const end = second.format(isoDate);
    const startShort = first.format(shortDate);
    const endShort = second.format(shortDate);
    const data = { start, end };
    const customShortLabel = `${startShort} - ${endShort}`;

    // save dates & labels ito global context
    saveDateRange(labelCustom, data, customShortLabel);
  
  };

  useEffect(() => {

    // format & apply custom date range
    if (selectedRange?.length === 2) calcCalendarRange(selectedRange);

  }, [selectedRange]);

  useEffect(() => {

    // expand hidden elements above a particular viewport 
    if (vw && vw >= 1299 && expanded) toggleExpanded();

  }, [vw]);

  return (
    <ul>
      {dateRangeButtons?.map(({ text }: DateLabelButton, i: number) => (
        <li key={`${text}-${i}`}>
          <Button key={`${text}-${i}`}
            prominence="range"
            text={text}
            isFilter={active === text}
            emitClick={() => calcButtonRange(text)}
            disabled={disable} />
        </li>
      ))}
      <li className={`${styles.hover}${!disable ? ' ' + styles.enabled : ''}`}>
        <Button prominence="range"
          isFilter={isCustom}
          text={label}
          disabled={disable} />
        <form className="form form--standard">
          <fieldset key={refresh}>
            <Controller name="dateRangeField"
              control={control}
              defaultValue={isCustom ? [new Date(startDate), new Date(dayjs(endDate).add(1, 'day').format())] : ''}
              render={({ onChange, value }) => (
                <DateRange onChange={onChange}
                  value={value}
                  max={today}
                  label="Date range"
                  hasError={false} />
              )} />
          </fieldset>
        </form>
      </li>
    </ul>
  );

};

// used to render the date filter nav for the admin dashboard 
const Filter = () => {

  const { expanded, toggleExpanded, handleClick } = useExpanded();

  return (
    <Restricted allow={['Admin']}>
      <div className={`${styles.root}${expanded ? ' ' + styles.expanded : ''}`}
        onClick={handleClick}>        
        <div className="inner">
          <nav className={styles.visible}>
            <h3 className={styles.label}>{ promptLabel }</h3>
            <Buttons expanded={expanded}
              toggleExpanded={toggleExpanded} />
          </nav>
          <button className={styles.expand}
            onClick={toggleExpanded}>
            <h3 className={styles.label}>{ promptLabel }</h3>
            <Chevron />
          </button>
          <Hidden classes={styles.hidden}
            expanded={expanded}>
            <Buttons expanded={expanded}
              toggleExpanded={toggleExpanded} />
          </Hidden>
        </div>
      </div>
    </Restricted>
  );

};

export default Filter;
