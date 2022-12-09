import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Advert, Button, Card, Error, Input, RadioButtons, Restricted } from '_atoms';
import { ChangeAvatar, ChangePassword, Expander, PraiseHistory } from '_molecules';
import { SpaceContext } from '_context';
import { useFetch } from '_hooks';
import styles from './EmployeeProfile.module.scss';

interface ISubmitted {
  name: string;
  feedback: string;
  happiness: string;
  microtraining: string;
  praise: string;
  surveys: string;
  training: string;
}

interface IManagementNotifications {
  feedback: boolean;
  happiness: boolean;
  surveys: boolean;
  training: boolean;
}

interface IUserNotifications {
  praise: boolean;
  training: boolean;
}

interface IProfileData {
  managementNotifications?: IManagementNotifications;
  memberNotifications: IUserNotifications;
  name: string;
}

interface IProfile extends IProfileData {
  avatar: IImage;
  email: string;
}

const trainingOptions: IOption[] = [
  {
    text: 'Email me when I’m assigned a new questionnaire',
    value: 'true'
  },
  {
    text: 'Don’t notify me about new questionnaire',
    value: 'false'
  }
];

const praiseOptions: IOption[] = [
  {
    text: 'Email me when I receive praise',
    value: 'true'
  },
  {
    text: 'Don’t notify me about praise',
    value: 'false'
  }
];

const microtrainingOptions: IOption[] = [
  {
    text: 'Email me after every response',
    value: 'true'
  },
  {
    text: 'Don’t notify me about learning responses',
    value: 'false'
  }
];

const surveysOptions: IOption[] = [
  {
    text: 'Email me after every response',
    value: 'true'
  },
  {
    text: 'Don’t notify me about survey responses',
    value: 'false'
  }
];

const happinessOptions: IOption[] = [
  {
    text: 'Email me after every response',
    value: 'true'
  },
  {
    text: 'Don’t notify me about happiness responses',
    value: 'false'
  }
];

const feedbackOptions: IOption[] = [
  {
    text: 'Email me when I receive new suggestions and feedback',
    value: 'true'
  },
  {
    text: 'Don’t notify me about new feedback',
    value: 'false'
  }
];

const customMsg = 'Please choose an option';

// used to render the employee profile component - where an employee has the ability to update their name, password (via modal) & avatar. They can also see their praise history & set their notification preferences. If the employee is an admin user they have more options for notification preferences (e.g. when users respond to surveys)
const EmployeeProfile = () => {

  const { register, errors, watch, handleSubmit, formState: { submitCount } } = useForm({ mode: 'onSubmit' });
  const { env, error, errorMessage, submitted, setSubmitted, fetchData, postData } = useFetch();
  const { space, saveSpace } = useContext(SpaceContext);
  const [profile, setProfile] = useState<IProfile | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const name = watch('name');

  const onSubmit = (submitted: ISubmitted) => {

    const { name, feedback, happiness, microtraining, praise, surveys, training } = submitted;

    // format the submitted data for standard employees (JSON.parse is a quick way of turning a string boolean into an actual boolean, e.g. 'true' -> true)
    const data: IProfileData = {
      name,
      memberNotifications: {
        praise: JSON.parse(praise),
        training: JSON.parse(training) 
      }
    };

    // if there is a microtraining prop in the submitted data, it's an admin employee so we need to format the extra notification preferences
    if (microtraining) {

      data.managementNotifications = {
        feedback: JSON.parse(feedback),
        happiness: JSON.parse(happiness),
        surveys: JSON.parse(surveys), 
        training: JSON.parse(microtraining)
      };

    }

    // post the formatted data to the API
    postData('/profile', data).then(response => {

      if (response?.success) setSubmitted(true);

    });

  };

  useEffect(() => {

    if (env) {

      // fetch the employee data (identified by login cookie)
      fetchData('/profile').then(response => {

        if (response?.name) setProfile(response);

      });

    }

  }, [env]);

  useEffect(() => {

    const { user } = space;

    // when we sucessfully update the data in the API, make sure we update the global context data too so that the UI is in sync without having to do any more API requests 
    if (submitted && name !== user.name) {

      // format updated data
      const updated: ISpace = { 
        ...space, 
        user: { 
          ...user, 
          name
        }
      };

      // save globally 
      saveSpace(updated);

    }

  }, [submitted, submitCount]);

  return (
    <>
      <section className={`${styles.grid} inner`}>
        <Advert classes={styles.advert} />
        <Card heading="My profile"
          loading={!profile && !error}
          classes={styles.body}>
          {profile ? (
            <form encType="multipart/form-data"
              className="form form--standard"
              onSubmit={handleSubmit(onSubmit)}>
              <fieldset>
                <div className={`${styles.section} ${styles.details}`}>
                  <div className={`${styles.personal} form__grid`}>
                    <legend>Your details</legend>
                    <Input name="name"
                      label="Name" 
                      prefill={profile?.name}
                      type="text"
                      hasError={errors.name}
                      errorMsg={errors.name?.message}
                      register={register} 
                      required={true} />
                    <Input name="email"
                      label="Email" 
                      prefill={profile?.email}
                      disabled={true}
                      type="email" />
                    <span>
                      <button type="button"
                        className="text-link text--small"
                        onClick={() => setModalOpen(true)}>Change password
                      </button>
                    </span>
                    <div className={styles.picture}>
                      <ChangeAvatar />
                    </div>
                  </div>
                </div>
              </fieldset>
              <PraiseHistory classes={styles.section} />
              <fieldset>
                <div className={`${styles.section} form__grid`}>
                  <legend className="h4">Notification settings</legend>
                  <RadioButtons name="training"
                    label="Learning, surveys, happiness"
                    options={trainingOptions}
                    preselect={profile?.memberNotifications?.training?.toString()}
                    hasError={errors.training}
                    errorMsg={errors.training?.message}
                    customMsg={customMsg}
                    register={register} 
                    required={true} />
                  <RadioButtons name="praise"
                    label="Praise"
                    options={praiseOptions}
                    preselect={profile?.memberNotifications?.praise?.toString()}
                    hasError={errors.praise}
                    errorMsg={errors.praise?.message}
                    customMsg={customMsg}
                    register={register} 
                    required={true} />
                </div>
              </fieldset>
              <Restricted allow={['Admin']}>
                <fieldset>
                  <div className={`${styles.section} form__grid`}>
                    <legend className="h4">Management notifications</legend>
                    <RadioButtons name="microtraining"
                      label="Learning"
                      options={microtrainingOptions}
                      preselect={profile?.managementNotifications?.training?.toString()}
                      hasError={errors.microtraining}
                      errorMsg={errors.microtraining?.message}
                      customMsg={customMsg}
                      register={register} 
                      required={true} />
                    <RadioButtons name="surveys"
                      label="Surveys"
                      options={surveysOptions}
                      preselect={profile?.managementNotifications?.surveys?.toString()}
                      hasError={errors.surveys}
                      errorMsg={errors.surveys?.message}
                      customMsg={customMsg}
                      register={register} 
                      required={true} />
                    <RadioButtons name="happiness"
                      label="Happiness surveys"
                      options={happinessOptions}
                      preselect={profile?.managementNotifications?.happiness?.toString()}
                      hasError={errors.happiness}
                      errorMsg={errors.happiness?.message}
                      customMsg={customMsg}
                      register={register} 
                      required={true} />
                    <RadioButtons name="feedback"
                      label="Open suggestions and feedback"
                      options={feedbackOptions}
                      preselect={profile?.managementNotifications?.feedback?.toString()}
                      hasError={errors.feedback}
                      errorMsg={errors.feedback?.message}
                      customMsg={customMsg}
                      register={register} 
                      required={true} />
                  </div>
                </fieldset>
              </Restricted>
              <Expander expanded={submitted}>
                <aside className={styles.success}>
                  <h3>Thanks { name }</h3>
                  <p>We've updated your details</p>
                </aside>
              </Expander>
              <Button text="Save changes"
                type="submit"
                prominence="primary" />
              <Error message={`${errorMessage} (${error})`}
                expanded={!!error} />
            </form>
          ) : (
            <p>There was a problem getting the data from the server. Please try again later.</p>
          )}
        </Card>
      </section>
      <ChangePassword launch={modalOpen}
        emitClose={() => setModalOpen(false)} />      
    </>
  );

};

export default EmployeeProfile;
