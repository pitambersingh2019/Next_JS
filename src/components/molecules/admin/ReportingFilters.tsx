import { useContext, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import dynamic from 'next/dynamic';
import dayjs from 'dayjs';
import { Button, Date, Select } from '_atoms';
import { ReportingContext, SpaceContext } from '_context';
import { useRefresh } from '_hooks';
import { delay, globals, sortStrings, sortObject } from '_utils';
import styles from './ReportingFilters.module.scss';

interface IProps {
  launch: boolean;
  companyValues: string[];
  topics: IOption[];
  emitClose: () => void;
}

const Modal = dynamic(import('./../global/Modal'));

// create all variables & object that we can outside the component to keep bootstrapping times down 
const defaultValue = 'default';
const { isoDate, genders } = globals;
const location: IField = {
  name: 'location',
  label: 'Location'
};
const team: IField = {
  name: 'team',
  label: 'Team'
};
const jobRole: IField = {
  name: 'jobRole',
  label: 'Role',
  prompt: 'Select a role'
};
const gender: IField = {
  name: 'gender',
  opts: genders,
  label: 'Gender'
};
const seniority: IField = {
  name: 'seniority',
  label: 'Seniority',
  prompt: 'Select seniority'
};
const ages = [
  '18-30',
  '31-40',
  '41-50',
  '51+'
];
const ageRange: IField = {
  name: 'ageRange',
  opts: ages,
  label: 'Age range',
  prompt: 'Select an age'
};
const companyValue: IField = {
  name: 'companyValue',
  label: 'Company value',
  prompt: 'Select a value'
};
const topic: IField = {
  name: 'topic',
  label: 'Topic'
};

// a modal that houses all available reporting filters used to apply to the current dashboard (whether that be standard, learning or happiness survey dashboard). For the latter two, company values (specific to happiness surveys) or learning topics (specific to learning surveys) are passed in as optional props
const ReportingFilters = ({ launch, companyValues, topics, emitClose }: IProps) => {

  const { control, watch, register, handleSubmit } = useForm({ mode: 'onSubmit' });
  const { reporting, saveReporting } = useContext(ReportingContext);
  const { refresh, bumpRefresh } = useRefresh();
  const { space } = useContext(SpaceContext);
  const { locations, teams, roles, seniority: seniorities } = space;
  const [isValid, setIsValid] = useState<boolean>(false);
  const [validInputs, setValidInputs] = useState<string[]>([]);
  const selectedDate = watch('employeeStartDate');

  // create array of metric along with options for the dropdowns. Some are space-specific (e.g. locations, teams etc) whereas others (like genders and age ranges) never change so are defined globally 
  let metrics: IField[] = [
    {
      ...location,
      opts: locations
    },
    {
      ...team,
      opts: teams
    },
    {
      ...jobRole,
      opts: roles
    },
    gender,
    {
      ...seniority,
      opts: seniorities
    },
    ageRange
  ];

  // if we're in the happiness survey dashbaord, add company values to the metrics
  if (companyValues.length > 0) metrics = [...metrics, { ...companyValue, opts: companyValues }];

  // if we're in the learning survey dashbaord, add learning topics to the metrics
  if (topics.length > 0) metrics = [...metrics, { ...topic, opts: topics.map(({ text }) => text) }];

  // this is called when the user submits the form to apply the selected reporting filter s
  const onSubmit = (submitted: IReporting): IReporting => {

    const { employeeStartDate: submittedDate } = submitted;
    // validate & format the submitted employee start date if selected
    const employeeStartDate = (submittedDate !== '' && submittedDate !== null) ? dayjs(submittedDate).format(isoDate) : defaultValue;
    // add the formatted date to the rest of the submitted data  
    const data = { ...submitted, employeeStartDate };
    const filters = { ...reporting };
    // check if the submitted filters are any different to those currently applied 
    const hasChanged = JSON.stringify(sortObject(filters)) === JSON.stringify(sortObject(reporting));

    // create a version of the applied filters, nullifying those that may have been unselected 
    Object.entries(data).forEach(([key, val]) => filters[key] = val === defaultValue ? null : val);

    // if we have updates to apply, overwrite the global reporting filter context 
    if (hasChanged) saveReporting(filters);

    // close the modal to show the updated dashboard 
    emitClose();

    // return in case we wanna unit test
    return filters;

  };

  // this is called by all the dropdowns whenever its value is changed
  const handleChange = (value: string, name: string): boolean => {

    // validate dropdown's selected value 
    const validInput = (value !== '' && value !== defaultValue);
    // check if we've already got this applied
    const alreadyLogged = validInputs.includes(name);

    // if not already applied, apply it
    if (validInput && !alreadyLogged) setValidInputs([...validInputs, name]);

    // if already applied, remove it
    if (!validInput && alreadyLogged) setValidInputs(validInputs.filter(item => item !== name));

    // return in case we wanna unit test
    return validInput;

  };

  // when the user closes the modal, they are in effect 'cancelling' - so we want to refresh the modal to return to its default state 
  const closeReporting = () => {

    // close the modal
    emitClose();
    // after animation has played, manually trigger refresh which is used in the key prop to rerender
    delay(250).then(() => bumpRefresh());
  
  };

  useEffect(() => {

    // this is where we decide whether the apply button is enabled
    const numOfValidInputs = validInputs.length;

    // disable button 
    if (numOfValidInputs === 0 && isValid) setIsValid(false);

    // enable button 
    if (numOfValidInputs > 0 && !isValid) setIsValid(true);
  
  }, [validInputs]);

  useEffect(() => {

    // the Date component works a little differently to Select, so we watch its value using useForm()'s watch func & then call our change handler method 
    handleChange(selectedDate, 'employeeStartDate');

  }, [selectedDate]);

  useEffect(() => {

    // when the reporting context data changes (e.g. from the date range filtering), we need to add the active filter to our local tally of valid inputs to keep everything in sync 
    const activeFilters = Object.entries(reporting).filter(([_, value]) => value !== null).map(([name, _]) => name);

    if (activeFilters.length > 0) setValidInputs([...validInputs, ...activeFilters]);

  }, [reporting]);

  return (
    <Modal key={refresh}
      launch={launch}
      classes={`${styles.root} modal`}
      emitClose={closeReporting}>
      <h2 className="h4">What would you like to report on?</h2>
      <form className="form form--standard"
        onSubmit={handleSubmit(onSubmit)}>
        <fieldset>
          <legend>Reporting filter metrics</legend>
          <div className={`${styles.grid} form__grid`}>
            {metrics.map(({ name, opts, label, prompt }, i) => {

              const selected = reporting[name] ?? defaultValue;
              const initial = prompt ? prompt : `Select a ${name}`;
              const options = opts && sortStrings(opts).map(option => ({
                text: option,
                value: label === 'Topic' ? topics.find(({ text }) => text === option)?.value ?? '' : option
              }));

              return options && (
                <Select key={`${name}-${i}`}
                  name={name}
                  label={label}
                  selected={selected}
                  showDisabled={false}
                  options={[{ text: initial, value: defaultValue }, ...options]}
                  hasError={false}
                  register={register}
                  emitChange={(value) => handleChange(value, name)} />
              );

            })}
            <Controller name="employeeStartDate"
              control={control}
              defaultValue={reporting.employeeStartDate ?? ''}
              render={({ onChange, value }) => (
                <Date onChange={onChange}
                  value={value}
                  max={dayjs().format(isoDate)}
                  label="Employee start date"
                  yearNav={true}
                  hasError={false} />
              )} />
          </div>
          <div className={`${styles.actions} actions`}>
            <Button text="Generate report"
              type="submit"
              prominence="primary"
              classes={!isValid ? 'disabled disabled--block' : ''}
              disabled={!isValid} />
            <Button text="Cancel"
              emitClick={closeReporting} />
          </div>
        </fieldset>
      </form>
    </Modal>
  );

};

export default ReportingFilters;
