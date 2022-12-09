import { ReactNode, useState } from 'react';
import dayjs from 'dayjs';
import { globals } from '_utils';
import FilterContext from './FilterContext';

interface IProps {
	children: ReactNode;
}

const { dateLabels, isoDate } = globals;
const { labelLastQuarter, labelCustom } = dateLabels;

export const defaultDateRange: IRange = {
  start: dayjs().subtract(3, 'month').format(isoDate),
  end: dayjs().format(isoDate)
};

// this is where the date filters are saved. In the admin dashboards, the user can filter the information by date range: either last week, month, year etc or a custom range which they pick with a calendar. This is then stored globally in this context & used by whichever components need it 
const FilterProvider = ({ children }: IProps) => {

  const [active, setActive] = useState<string>(labelLastQuarter);
  const [dates, setDates] = useState<IRange>(defaultDateRange);
  const [label, setLabel] = useState<string>(labelCustom);

  const saveDateRange = (activeFilter: string, dateRange: IRange, customLabel: string) => {

    setActive(activeFilter);
    setDates(dateRange);
    setLabel(customLabel);
  
  };

  return (
    <FilterContext.Provider value={{ active, label, dates, saveDateRange }}>
      { children }
    </FilterContext.Provider>
  );

};

export default FilterProvider;