import { ReactNode, useState } from 'react';
import ReportingContext from './ReportingContext';
import { globals } from '_utils';

interface IProps {
	children: ReactNode;
}

// this is where the reporting filters are saved. In the admin dashboards, the user can filter the information by a range of different reporting filters: gender, start date, department etc. These are then stored globally in this context & used by whichever components need them 
const ReportingProvider = ({ children }: IProps) => {

  const [reporting, setReporting] = useState<IReporting>(globals.defaultReporting);

  const saveReporting = (data: IReporting) => setReporting(data);

  return (
    <ReportingContext.Provider value={{ reporting, saveReporting }}>
      { children }
    </ReportingContext.Provider>
  );

};

export default ReportingProvider;
