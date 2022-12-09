import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { Button, Card, Error, Input } from '_atoms';
import { SelectBadge, SelectRecipients, TabbedForm } from '_molecules';
import { useFetch, useRefresh } from '_hooks';
import { delay } from '_utils';
import styles from './PraiseEmployee.module.scss';

// used to allow managers to praise one or multiple employees at the same time (can be preselected via query string)
const PraiseEmployee = () => {

  const router = useRouter();
  const { member } = router.query;
  const { register, errors, handleSubmit, formState: { submitCount } } = useForm({ mode: 'onSubmit' });
  const { error, errorMessage, submitted, setSubmitted, postData } = useFetch();
  const { refresh, bumpRefresh } = useRefresh();
  const [loading, setLoading] = useState<boolean>(true);
  const [recipients, setRecipients] = useState<number[] | null>(null);
  const [badge, setBadge] = useState<IBadge | null>(null);
  const [prompt, setPrompt] = useState<boolean>(false);

  // after 5s, hide the confirmation message & revert the UI 
  const refreshPraise = () => delay(5000).then(() => {

    setSubmitted(false);
    bumpRefresh();
    setPrompt(false);
    setBadge(null);

  });

  // handle submit of praise 
  const onSubmit = (entered: IPraiseMessage) => {

    // make sure we have a badge & recipient list to post to the API 
    if (badge?.id && recipients?.length) {

      // format data 
      const data = {
        ...entered,
        typeId: badge?.id,
        recipientIds: recipients.join(', ')
      };
  
      postData('/praise/give', data).then(response => {
  
        if (response?.success) {

          setSubmitted(true);
          refreshPraise();
          
        } 
  
      });

    }

  };

  useEffect(() => {

    // watch the number of submits in order to show validation messages 
    if (submitCount > 0) setPrompt(true);

  }, [submitCount]);

  return (
    <Card heading="Praise"
      icon="praise"
      loading={loading}
      classes={`${styles.root} dashboard-single`}>
      <div className={styles.wrapper}>
        <TabbedForm success={submitted}
          info={`We've sent your praise`}>
          <div className={styles.recipients}>
            <SelectRecipients key={refresh}
              preselect={member ? member : undefined}
              emitComplete={(recipients) => setRecipients(recipients)}
              emitLoaded={() => setLoading(false)} />
            <Error message="Please select at least one recipient"
              expanded={prompt && !recipients?.length}
              persist={true} />
          </div>
          <div className={styles.badges}>
            <h3 className="text--small">Add a badge</h3>
            <SelectBadge refresh={refresh} 
              emitSelect={(badge) => setBadge(badge)} />
            <Error message="Please select a badge"
              expanded={prompt && !badge}
              persist={true} />
          </div>
          <form className={`${styles.form} form form--standard`}
            onSubmit={handleSubmit(onSubmit)}>
            <fieldset>
              <legend>Give praise to employee(s)</legend>
              <div className={`${styles.input} form__grid`}>
                <Input key={refresh}
                  name="message"
                  label="Write a message" 
                  placeholder="Well done on that recent project..."
                  type="text"
                  hasError={errors.message}
                  errorMsg={errors.message?.message}
                  register={register} 
                  required={true} />
              </div>
            </fieldset>
            <Button text="Send praise"
              prominence="primary"
              type="submit" />
            <Error message={`${errorMessage} (${error})`}
              expanded={!!error}
              persist={true} />
          </form>
        </TabbedForm>
      </div>
    </Card>
  );

};

export default PraiseEmployee;