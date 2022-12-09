import { useContext, useState } from 'react';
import dynamic from 'next/dynamic';
import { useForm } from 'react-hook-form';
import { Button, Checkbox, Error } from '_atoms';
import { LoadingContext } from '_context';
import { useFetch } from '_hooks';
import { getEndpoint } from '_utils';
import styles from './SurveyParticipants.module.scss';

interface ISubmitted {
  [userId: string]: boolean | string[];
}

interface IProps {
  launch: boolean;
  surveyId?: string | string[];
  surveyType: SurveyType;
  unsentMembers: IUserResend[];
  emitClose: () => void;
  emitResend: () => void;
}

const Modal = dynamic(import('./../global/Modal'));

// used to ask the user which employee(s) they'd like to resend a survey to, rendering a list of checkboxes next to employee names in a modal launched from a conditional button in SurveyResults 
const SurveyResend = ({ launch, surveyId, surveyType, unsentMembers, emitClose, emitResend }: IProps) => {

  const { register, errors, handleSubmit } = useForm({ mode: 'onSubmit' });
  const { isLoading } = useContext(LoadingContext);
  const { error, errorMessage, postData } = useFetch();
  const [isDisabled, setIsDisabled] = useState<boolean>(true);

  // used to reset the disabled state & emit the success event to the parent component (SurveyResults)
  const handleResent = () => {

    setIsDisabled(true);
    emitResend();

  };

  // called from clicking the Submit button & when a checkbox value changes (easiest way to validate), the difference handled by the passed boolean
  const onSubmit = (submitted: ISubmitted, shouldSubmit: boolean) => {

    // create array of numerical employee IDs based on those selected by the user. The second line is to do with an occasional bug in react-hook-form whereby a checkbox's value can either be a boolean or ['on']  
    const members = Object.entries(submitted)
      .filter(([_, value]) => value === true || (Array.isArray(value) && value.length === 1 && value[0] === 'on'))
      .map(([id, _]) => parseInt(id));

    // if there are no selected members we need to disable the Submit button
    setIsDisabled(members.length === 0);

    // if the user has clicked the Submit button, we should post the employee IDs to the API
    if (shouldSubmit) {

      const data = {
        members
      };
  
      postData(`/${getEndpoint(surveyType)}/results/resend/${surveyId}`, data).then(response => {
  
        if (response?.resent) handleResent();
  
      });

    }

  };

  return (
    <Modal launch={launch}
      classes="modal"
      emitClose={emitClose}>
      <h2 className="h4">Send to other team members</h2>
      <p className="text--small">The following team members aren't recipients of the survey, please select any you'd like it to be sent to.</p>
      <form className="form form--survey"
        onSubmit={(e) => {

          e.preventDefault();
          handleSubmit(data => onSubmit(data, true))();

        }}>
        <fieldset>
          <legend>Select other team members</legend>
          <div className={styles.checkboxes}>
            {unsentMembers.map(({ id, name }, i) => (
              <Checkbox key={`${id}-${i}`}
                name={id.toString()}
                text={name}
                hasError={errors[id]}
                errorMsg={errors[id]?.message}
                register={register}
                emitChange={() => handleSubmit(data => onSubmit(data, false))()} />
            ))}
          </div>
          <div className="actions">
            <Button text="Send survey"
              prominence="primary"
              type="submit"
              classes={isDisabled || isLoading ? 'disabled disabled--block' : ''}
              disabled={isDisabled || isLoading} />
            <Button text="Cancel"
              emitClick={emitClose} />
          </div>
        </fieldset>
      </form>
      <Error message={`${errorMessage} (${error})`}
        expanded={!!error} />
    </Modal>
  );

};

export default SurveyResend;
