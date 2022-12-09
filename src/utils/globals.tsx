// global variables 
const globals = {
  defaultSrc: 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==',
  isoDate: 'YYYY-MM-DD',
  shortDate: 'D/M/YYYY',
  longDate: 'DD MMMM YYYY',
  genders: [
    'Male',
    'Female',
    'Prefer not to say'
  ],
  defaultReporting: {
    location: null,
    team: null,
    jobRole: null,
    gender: null,
    seniority: null,
    ageRange: null,
    employeeStartDate: null,
    companyValue: null,
    topic: null
  },
  dateLabels: {
    labelLastYear: 'Last year',
    labelLastHalfYear: 'Last 6 months',
    labelLastQuarter: 'Last 3 months',
    labelLastMonth: 'Last 1 month',
    labelCustom: 'Custom date range'
  }
};

export default globals;
