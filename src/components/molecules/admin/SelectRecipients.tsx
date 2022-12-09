import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Checkbox, Error, Radio } from '_atoms';
import Expander from './../global/Expander';
import { useFetch, useRefresh } from '_hooks';
import { filterInactiveUsers, sortStrings, sortUsers } from '_utils';
import styles from './SelectRecipients.module.scss';

interface IProps {
  classes?: string;
  draftSurvey?: ISurvey;
  preselect?: string | string[];
  filterInactive?: boolean;
  emitComplete: (recipients: number[], sentToAll: boolean) => void;
  emitLoaded?: () => void;
}

// used to select recipients in various parts of the manager dashboard (e.g. for surveys or praise). The departments & employees are formatted in the FE due to delays in the intial BE build - arguably could be moved to the BE, but it ain't broke...
const SelectRecipients = ({ classes, draftSurvey, preselect, filterInactive = true, emitComplete, emitLoaded }: IProps) => {

  const { register, errors, watch, handleSubmit } = useForm({ mode: 'onBlur' });
  const { env, error, errorMessage, fetchData } = useFetch();
  const { refresh, bumpRefresh } = useRefresh();
  const [members, setMembers] = useState<IUser[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [employees, setEmployees] = useState<IOption[]>([]);
  const [recipients, setRecipients] = useState<number[]>([]);
  const category = watch('category');

  useEffect(() => {

    // once we have members from the API, we can format for our component
    if (members.length) {

      // create an array of all unique values for department props in the members array
      const mappedDepartments = members.map(({ department }) => typeof department === 'string' ? department : '').filter((value, index, self) => value.length && self.indexOf(value) === index);
      // create the data to use for the Checkbox component next to each employee 
      const mappedEmployees = members.map(({ name, id }) => ({
        text: name,
        value: id.toString()
      }));

      // sort & store 
      setDepartments(sortStrings(mappedDepartments));
      setEmployees(mappedEmployees);

    }

  }, [members]);

  useEffect(() => {

    // if we're in the SurveyCreate component & have previously selected recipients in a draft, make sure these are selected 
    if (draftSurvey?.recipients) setRecipients(draftSurvey?.recipients);

  }, [draftSurvey]);

  useEffect(() => {

    // the SurveyCreate component needs to know whether the survey was sent to all employees in order to tell the API, so we work that out here 
    const sentToAll = recipients.length === members.length;

    // emit to the parent component
    emitComplete(recipients, sentToAll);

  }, [recipients, members]);

  useEffect(() => {

    // the PraiseEmployee component needs to know once we've loaded & formatted the data in order to hide the loader
    if (employees.length && departments.length && emitLoaded) emitLoaded();

    // check whether we need to have any employees selected by default
    const preselected = employees.find(item => item.value === preselect)?.value;

    // if so, select them
    if (preselected) setRecipients([parseInt(preselected)]);

  }, [employees, departments]);

  useEffect(() => {

    // make sure recipients array is up to date
    handleSubmit((data) => {

      // create array of all the selected items
      const selectedItems = Object.entries(data).filter(([_, val]) => val === true).map(([key, _]) => key);

      // if the user has selected all employees, simply create an array of all recipient IDs
      if (category === 'all') setRecipients(members.map(({ id }) => id));

      // if the user has selected departments, create an array of all employees in the selected departments
      if (category === 'departments') {
        
        const mappedEmployees = members?.filter(({ department }) => typeof department === 'string' && selectedItems.includes(department)).map(({ id }) => id);
  
        setRecipients(mappedEmployees);

      }

      // if the user has selected specific employees, create an array of those employees' IDs
      if (category === 'employees') {

        const mappedEmployees = members?.filter(item => selectedItems.includes(item.id.toString())).map(({ id }) => id);
  
        setRecipients(mappedEmployees);

      }

    })();

  }, [refresh]);

  useEffect(() => {

    // when the category changes, self-submit the form to keep the recipients array up to date
    bumpRefresh();

  }, [category]);

  useEffect(() => {

    if (env) {

      // fetch all the members in the space
      fetchData('/members/all').then(response => {

        if (response?.length) {
          
          filterInactive
            ? setMembers(sortUsers(filterInactiveUsers(response)))
            : setMembers(sortUsers(response));

        }

      });

    }

  }, [env]);

  return (
    <div className={`${styles.root}${classes ? ' ' + classes : ''}`}>
      <h3 className="text--small">Participants</h3>
      <Radio name="category"
        text="Send to all employees"
        value="all"
        hasError={false}
        register={register} />
      <Radio name="category"
        text="Choose teams"
        value="departments"
        hasError={false}
        register={register} />
      <Expander expanded={category === 'departments'}>
        <div className={styles.list}>
          {departments.map((department, i) => (
            <Checkbox key={`${department}-${i}`}
              name={department}
              text={department}
              preselect={recipients.includes(parseInt(department))}
              hasError={errors[department]}
              errorMsg={errors[department]?.message}
              register={register}
              emitChange={bumpRefresh} />
          ))}
        </div>
      </Expander>
      <Radio name="category"
        text="Choose employees"
        value="employees"
        preselect="employees"
        hasError={false}
        register={register} />
      <Expander expanded={category === 'employees' && employees.length > 0}>
        <div className={styles.list}>
          {employees?.map(({ text, value }, i) => (
            <Checkbox key={`${value}-${i}`}
              name={value}
              text={text}
              preselect={draftSurvey?.recipients.includes(parseInt(value)) || preselect === value}
              hasError={errors[value]}
              errorMsg={errors[value]?.message}
              register={register}
              emitChange={bumpRefresh} />
          ))}
        </div>
      </Expander>
      <Error message={`${errorMessage} (${error})`}
        expanded={!!error}
        persist={true} />
    </div>
  );

};

export default SelectRecipients;
