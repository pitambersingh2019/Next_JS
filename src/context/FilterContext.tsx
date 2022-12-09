import { createContext } from 'react';
import { defaultDateRange } from './FilterProvider';

const FilterContext = createContext({
  active: '',
  dates: defaultDateRange,
  label: '',
  saveDateRange: (_: string, __: IRange, ___: string) => {}
});

export default FilterContext;
