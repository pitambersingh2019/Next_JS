import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { Error, Select } from '_atoms';
import SurveyResponse from './SurveyResponse';
import { useFetch } from '_hooks';
import { getEndpoint, sortUsers } from '_utils';
import styles from './SurveyIndividual.module.scss';

interface IProps {
  surveyId?: string | string[];
  surveyType: SurveyType;
  deepLinkedMember?: string | string[];
}

const defaultEmployee = 'Employee';
const selectedOption = 'Choose an employee';
const defaultOption = { text: selectedOption, value: '' };

// used in the SurveyResults component to show an employee's individual answers to a survey 
const SurveyIndividual = ({ surveyId, surveyType, deepLinkedMember }: IProps) => {

  const { register, errors } = useForm({ mode: 'onBlur' });
  const { env, error, errorMessage, fetchData } = useFetch();
  const [members, setMembers] = useState<IUser[]>([]);
  const [recipients, setRecipients] = useState<number[]>([]);
  const [options, setOptions] = useState<IOption[]>([defaultOption]);
  const [selected, setSelected] = useState<string | string[]>('');
  const [name, setName] = useState<string>(defaultEmployee);
  const [individual, setIndividual] = useState<ISurveyIndividual | null>(null);
  const isLearning = surveyType === 'Learning';

  // if an employee is selected in the dropdown, render their name - fallback to the default string
  const getEmployeeName = (): string => name === defaultEmployee ? 'employee' : name;

  useEffect(() => {

    // make sure we overwrite any previously active selected data 
    setIndividual(null);

    // if we have a selected employee, fetch their answers for the survey
    if (env && !!selected) {

      fetchData(`/${getEndpoint(surveyType)}/results/${surveyId}/individual/${selected}`).then((response) => {

        response.responses
          ? setIndividual(response)
          : setIndividual(null);

      });

    }

    // get the user's name from the members array
    const user = members?.find(({ id }) => id.toString() === selected);

    // if we have a name, grab the first name - otherwise set it be the default string 
    user
      ? setName(user.name.split(' ')[0])
      : setName(defaultEmployee);

  }, [env, selected]);

  useEffect(() => {

    // here we create the options for the dropdown 
    if (members?.length && recipients?.length) {

      // create a sorted array of member objects for recipients of the survey 
      const filtered = sortUsers(members.filter(({ id }) => recipients.includes(id)));

      // create options for the employee selection dropdown
      const mapped: IOption[] = filtered.map(({ id, name }) => ({
        text: name,
        value: id.toString()
      }));
      
      // store options locally
      setOptions([defaultOption, ...mapped]);

    }

  }, [members, recipients]);

  useEffect(() => {

    if (env) {

      // get member data
      fetchData('/members/all').then((response) => {

        if (response[0]?.name) setMembers(response);

      });

      // get survey data
      fetchData(`/${getEndpoint(surveyType)}/get/${surveyId}`).then(response => {

        if (response?.recipients?.length) setRecipients(response.recipients);

      });

    }

  }, [env]);

  useEffect(() => {

    // if we want to deep link into a selected member via optional query string, set the selected member on load
    if (deepLinkedMember && deepLinkedMember?.length > 0) setSelected(deepLinkedMember);
  
  }, []);

  return (
    <>
      <article className={styles.root}>
        <form className={`${styles.form} form form--standard`}>
          <fieldset>
            <legend>Select an employee to see their results</legend>
            <Select name="employee"
              label="Employee"
              showDisabled={false}
              selected={deepLinkedMember ? `${deepLinkedMember}` : selectedOption}
              options={options}
              hasError={errors.employee}
              register={register}
              emitChange={(value) => setSelected(value)} />
          </fieldset>
          <Error message={`${errorMessage} (${error})`}
            expanded={!!error} />
        </form>
        {individual && isLearning && (
          <figure className={`${styles.mark} statistic`}>
            <h2 className="text--small">{ name }'s mark</h2>
            <h3 className={`h1${!individual ? ' ' + styles.disabled : ''}`}>{ Math.round(individual?.score || 0) }%</h3>
            {individual && individual.incorrectCount && individual.incorrectCount > 0 ? <small>{ individual?.incorrectCount } incorrect answer{individual?.incorrectCount !== 1 ? 's' : ''}</small> : null}
          </figure>
        )}
        <div className={styles.profile}>
          <h2 className="text--small">Link to profile</h2>
          <Link href={`/admin/team/${selected}`}>
            <a className={`widget-link text--medium${!selected ? ' disabled disabled--text ' : ''}`}
              onClick={(e) => !selected && e.preventDefault()}>
              View { getEmployeeName() }'s profile
            </a>
          </Link>
        </div>
      </article>
      {individual && individual.responses?.map((response, i) => (
        <SurveyResponse key={`${response.question.split(' ')[0]}-${i}`}
          response={response}
          isMarked={isLearning} />
      ))}
      {!individual && selected.length > 0 && <p>{ getEmployeeName() } hasn't answered yet</p>}
    </>
  );

};

export default SurveyIndividual;
