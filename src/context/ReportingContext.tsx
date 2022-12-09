import { createContext } from 'react';

const ReportingContext = createContext({
  reporting: {} as IReporting,
  saveReporting: (_: IReporting) => {}
});

export default ReportingContext;
