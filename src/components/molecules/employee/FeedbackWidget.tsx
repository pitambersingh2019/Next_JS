import { useForm } from 'react-hook-form';
import { Button, Card, Checkbox, Error, Textarea } from '_atoms';
import TabbedForm from './../global/TabbedForm';
import { useFetch, useRefresh } from '_hooks';
import { delay } from '_utils';
import styles from './FeedbackWidget.module.scss';

interface ISubmitted {
  text: string;
  anonymous: boolean | [];
}

interface IProps {
  classes?: string;
}

const inputLabel = 'Write to your management team';
const timeout = 600000;

// used in the employee dashboard to allow a member to submit (optionally anonymous) feedback to their manager
const FeedbackWidget = ({ classes }: IProps) => {

  const { register, errors, handleSubmit } = useForm({ mode: 'onSubmit' });
  const { error, errorMessage, submitted, setSubmitted, postData } = useFetch();
  const { refresh, bumpRefresh } = useRefresh();

  // handle submit of form 
  const onSubmit = (submitted: ISubmitted) => {

    const { anonymous } = submitted;
    const data: ISubmitted = submitted;

    if (Array.isArray(anonymous)) data.anonymous = anonymous.length > 0;

    postData('/feedback/submit', data).then(response => {

      if (response?.success) { 

        setSubmitted(true);

        delay(timeout).then(() => {
          
          bumpRefresh();
          setSubmitted(false);
        
        });

      }

    });

  };

  return (
    <Card heading="Open suggestions and feedback"
      icon="feedback"
      loading={false}
      classes={classes ? classes : undefined}>
      <TabbedForm success={submitted}
        info={`We've sent your feedback to the management team`}>
        <form key={refresh}
          className={`${styles.form} form form--standard`}
          onSubmit={handleSubmit(onSubmit)}>
          <fieldset>
            <legend>Send feedback to your management team</legend>
            <div className="form__grid">
              <Textarea name="text"
                label={inputLabel} 
                placeholder={inputLabel} 
                hideLabel={true}
                hasError={errors.text}
                errorMsg={errors.text?.message}
                register={register} 
                required={true} />
              <Checkbox name="anonymous"
                text="Make my comments anonymous"
                hasError={errors.anonymous}
                register={register} />
            </div>
          </fieldset>
          <Button text="Give feedback"
            type="submit" />
          <Error message={`${errorMessage} (${error})`}
            expanded={!!error}
            persist={true} />
        </form>
      </TabbedForm>
    </Card>
  );

};

export default FeedbackWidget;
