import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';
import { Controller, useForm } from 'react-hook-form';
import { Button, Date as DateInput, Error, Input, Select } from '_atoms';
import DeleteEmployee from './DeleteEmployee';
import Expander from './../global/Expander';
import { useFetch, useRefresh } from '_hooks';
import { capitalise, delay, globals } from '_utils';
import styles from './TeamMember.module.scss';

type Focused = 'dob' | 'esd' | null;

interface IProps {
  memberId?: string | string[];
  classes?: string;
}

interface IStats {
  surveysCompleted: number;
  praiseReceived: number;
  praiseGiven: number;
}

// define as much as possible out of the component (to avoid performance bottlenecks), using global data & known values 
const { isoDate, shortDate, genders } = globals;
const today = dayjs().format(isoDate);
const nameLabel = 'Name';
const emailLabel = 'Email';
const startLabel = 'Company start date';
const genderLabel = 'Gender';
const dobLabel = 'Date of birth';
const roles = [
  'Employee',
  'Admin'
];
const rolesLabel = 'User role';
const fields: IField[] = [
  {
    name: 'jobRole',
    label: 'Job role'
  },
  {
    name: 'seniority',
    label: 'Seniority'
  },
  {
    name: 'location',
    label: 'Location'
  },
  {
    name: 'department',
    label: 'Team'
  }
];

// used to create dropdown option array
const mapOptions = (options: string[]) => options.map(option => ({
  text: option,
  value: option
}));

// used to display various details about an employee, as well as the option to edit & update the values. The transition between the 'display' state & 'edit' state is animated via the Expander component  
const TeamMember = ({ memberId, classes }: IProps) => {

  const router = useRouter();
  const { control, register, errors, handleSubmit } = useForm({ mode: 'onSubmit' });
  const { env, error, errorMessage, fetchData, postData } = useFetch();
  const { refresh, bumpRefresh } = useRefresh();
  const [member, setMember] = useState<IUserIndex | null>(null);
  const [stats, setStats] = useState<IStats | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [overflow, setOverflow] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [focused, setFocused] = useState<Focused>(null);
  const endpoint = `/members/${memberId}`;
  const userRole = member?.roles?.includes('Admin') ? 'Admin' : 'Employee';

  // handle submit of edited values
  const onSubmit = (submitted: IUserIndex) => {

    // grab items from the submitted data that we need to base logic from 
    const { dateOfBirth, employeeStartDate, gender } = submitted;

    // create a copy of the raw submitted object
    const data: IUserIndex = { 
      ...submitted
    };

    // if gender wasn't selected set as empty string - otherwise lowercase it for the API
    gender === 'Gender'
      ? data.gender = ''
      : data.gender = gender?.toLowerCase() ?? '';

    // if date of birth was defined, format it for the API  
    if (dateOfBirth !== '' && dateOfBirth !== null) data.dateOfBirth = dayjs(dateOfBirth).format(isoDate);

    // if start date was defined, format it for the API  
    if (employeeStartDate !== '' && employeeStartDate !== null) data.employeeStartDate = dayjs(employeeStartDate).format(isoDate);

    // post data to the API, reverting the edit state on success
    postData(endpoint, data).then(response => {

      if (response?.edited) {

        setIsEditing(false);
        bumpRefresh();

      } 

    });

  };

  useEffect(() => {

    // used to make sure calendars sit above all other elements when expanded 
    isEditing 
      ? delay(300).then(() => setOverflow(true))
      : setOverflow(false);

  }, [isEditing]);

  useEffect(() => {

    if (env) {

      // grab employee data from the API
      fetchData(endpoint).then(response => {

        if (response?.name) {

          let teamMember: IUserIndex = response;

          // the roles is a bit mangled in the BE so here we ensure there's at least an 'Employee' role for everyone 
          if (response.roles.length === 0) teamMember = { ...teamMember, roles: ['Employee'] };
          
          setMember(teamMember);

        }

      });

      // grab employee stats from the API
      fetchData(`/members/summary/${memberId}`).then(response => {

        if (response && 'surveysCompleted' in response) setStats(response);

      });

    }

  }, [env, refresh]);

  return (
    <>
      <header className={`${styles.header} padded`}>
        <h1 className="h4">{ member?.name }</h1>
        <div className="card__tasks">
          <Link href={`/admin/praise?member=${memberId}`}> 
            <a className="widget-link text--small"> 
              Give praise
            </a>
          </Link>
          <button className="widget-link text--small"
            onClick={() => setModalOpen(true)}>
            Delete
          </button>
        </div>
      </header>
      <article className={`${styles.details}${classes ? ' ' + classes + ' ' : ''} padded`}>
        <div className={styles.personal}>
          <div className={styles.edit}>
            <h2 className="text--medium">Personal details</h2>
            {isEditing ? (
              <button className="widget-link text--small"
                onClick={() => setIsEditing(false)}>
                Cancel
              </button>
            ) : (
              <button className="widget-link text--small"
                onClick={() => setIsEditing(true)}>
                Edit
              </button>
            )}
          </div>
          <form className="form form--standard"
            onSubmit={handleSubmit(onSubmit)}>
            <fieldset>
              <div className="form__grid">
                <legend>Team member details</legend>
                <div className={styles.span}>
                  <h4 className="text--small">{ nameLabel }</h4>
                  <Expander expanded={!isEditing}>
                    <span className="text--medium">{ member?.name }</span>
                  </Expander>
                  <Expander expanded={isEditing}>
                    <Input name="name"
                      label={nameLabel}
                      type="text"
                      prefill={member?.name}
                      hasError={errors.name}
                      errorMsg={errors.name?.message}
                      register={register} 
                      required={true} />
                  </Expander>
                </div>
                <div className={styles.span}>
                  <h4 className="text--small">{ emailLabel }</h4>
                  <Expander expanded={!isEditing}>
                    <span className="text--medium">{ member?.email }</span>
                  </Expander>
                  <Expander expanded={isEditing}>
                    <Input name="email"
                      label={emailLabel} 
                      type="email"
                      prefill={member?.email ?? ''}
                      hasError={errors.email}
                      errorMsg={errors.email?.message}
                      register={register} 
                      required={true} />
                  </Expander>
                </div>
                <div>
                  <h4 className="text--small">{ rolesLabel }</h4>
                  <Expander expanded={!isEditing}>
                    <span className="text--medium">{ userRole }</span>
                  </Expander>
                  <Expander expanded={isEditing}>
                    {member?.roles && (
                      <Select name="userRole"
                        label={rolesLabel}
                        selected={userRole}
                        options={mapOptions(roles)}
                        hasError={errors.userRole}
                        register={register} />
                    )}
                  </Expander>
                </div>
                {fields.map(({ name, label }, i) => (
                  <div key={`${name}-${i}`}>
                    <h4 className="text--small">{ label }</h4>
                    <Expander expanded={!isEditing}>
                      <span className="text--medium">{ member && member[name] || '-' }</span>
                    </Expander>
                    <Expander expanded={isEditing}>
                      <Input name={name}
                        label={label} 
                        type="text"
                        prefill={member?.[name] ?? ''}
                        hasError={errors[name]}
                        errorMsg={errors[name]?.message}
                        register={register} />
                    </Expander>
                  </div>
                ))}
                <div className={`${styles.calendar}${overflow ? ' ' + styles.overflow : ''}${focused === 'esd' ? ' ' + styles.focused : ''}`}>
                  <h4 className="text--small">{ startLabel }</h4>
                  <Expander expanded={!isEditing}>
                    <span className="text--medium">{ member?.employeeStartDate ? dayjs(member.employeeStartDate).format(shortDate) : '-' }</span>
                  </Expander>
                  <Expander expanded={isEditing}>
                    {member && (
                      <Controller name="employeeStartDate"
                        control={control}
                        defaultValue={member?.employeeStartDate ? new Date(member.employeeStartDate) : ''}
                        render={({ onChange, value }) => (
                          <DateInput onChange={onChange}
                            value={value}
                            emitOpen={() => setFocused('esd')}
                            emitClose={() => delay(200).then(() => setFocused(null))}
                            max={today}
                            yearNav={true}
                            label={startLabel}
                            hasError={false} />
                        )} />
                    )}
                  </Expander>
                </div>
                <div>
                  <h4 className="text--small">{ genderLabel }</h4>
                  <Expander expanded={!isEditing}>
                    <span className="text--medium">{ member?.gender ? capitalise(member.gender) : '-' }</span>
                  </Expander>
                  <Expander expanded={isEditing}>
                    <Select name="gender"
                      label={genderLabel}
                      selected={member?.gender ? capitalise(member.gender) : ''}
                      options={mapOptions(genders)}
                      hasError={errors.gender}
                      register={register} />
                  </Expander>
                </div>
                <div className={`${styles.calendar}${overflow ? ' ' + styles.overflow : ''}${focused === 'dob' ? ' ' + styles.focused : ''}`}>
                  <h4 className="text--small">{ dobLabel }</h4>
                  <Expander expanded={!isEditing}>
                    <span className="text--medium">{ member?.dateOfBirth ? dayjs(member.dateOfBirth).format(shortDate) : '-' }</span>
                  </Expander>
                  <Expander expanded={isEditing}>
                    {member && (
                      <Controller name="dateOfBirth"
                        control={control}
                        defaultValue={member?.dateOfBirth ? new Date(member.dateOfBirth) : ''}
                        render={({ onChange, value }) => (
                          <DateInput onChange={onChange}
                            value={value}
                            emitOpen={() => setFocused('dob')}
                            emitClose={() => delay(200).then(() => setFocused(null))}
                            max={today}
                            yearNav={true}
                            label={dobLabel}
                            hasError={false} />
                        )} />
                    )}
                  </Expander>
                </div>
              </div>
              <Expander expanded={isEditing}>
                <Button text="Save changes"
                  type="submit"
                  prominence="primary" />
              </Expander>
            </fieldset>
          </form>
          <Error message={`${errorMessage} (${error})`}
            expanded={!!error}
            persist={true} />
        </div>
        <div className={styles.stats}>
          <div className="statistics">
            <figure className="statistic">
              <h3 className="h1">{ stats?.surveysCompleted ?? 0 }</h3>
              <small>Survey{stats?.surveysCompleted !== 1 ? 's' : ''} completed</small>
            </figure>
            <figure className="statistic">
              <h3 className="h1">{ stats?.praiseReceived ?? 0 }</h3>
              <small>Praise received</small>
            </figure>
            <figure className="statistic">
              <h3 className="h1">{ stats?.praiseGiven ?? 0 }</h3>
              <small>Praise given</small>
            </figure>
          </div>
        </div>
      </article>
      {!!member && (
        <DeleteEmployee key={refresh * 5}
          employee={member}
          launch={modalOpen}
          emitClose={() => setModalOpen(false)}
          emitDeleted={() => delay(250).then(() => router.push('/admin/team'))} />
      )}
    </>
  );

};

export default TeamMember;
