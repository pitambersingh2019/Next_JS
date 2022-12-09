import { useContext, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Error, Textarea } from '_atoms';
import { Expander, TabbedForm } from '_molecules';
import { SpaceContext } from '_context';
import { useFetch } from '_hooks';
import { Whitepaper } from '_vectors';
import styles from './TeamAdd.module.scss';

interface ISubmitted {
  emailAddresses: string;
}

// used to render a form to allow admin users to add new employees in the platform. They have the ability to upload a CSV (which will work as long as it's formatted correctly) or to add multiple emails (separated by a comma or semicolon) in a textarea. The submitted emails will then recieve the activate account email 
const TeamAdd = () => {

  const { space, hasSpaceData } = useContext(SpaceContext);
  const { id: spaceId } = space;
  const fileRef = useRef<HTMLLabelElement>(null);
  const [files, setFiles] = useState<FileList | null>(null);
  const [invalid, setInvalid] = useState<boolean>(false);
  const { error, errorMessage, submitted, setSubmitted, postData } = useFetch();
  const { register, errors, handleSubmit } = useForm({ mode: 'onSubmit' });
  
  // handle submit of the form, either with CSV file or textarea content
  const onSubmit = (submitted: ISubmitted) => {

    const { emailAddresses } = submitted;

    // make sure we have submitted content - otherwise show validation message
    if (emailAddresses.length || !!files) {

      setInvalid(false);

      if (files) {

        // if we have a CSV file, format it & then post to the CSV endpoint
        const data = new FormData();

        data.append('file', files[files.length - 1]);

        postData('/members/invite-users/csv ', data, true).then(response => {

          if (response?.success) setSubmitted(true);

        });

      } else if (emailAddresses.length && hasSpaceData) {

        // otherwise, we'll have some email addresses which we post to that endpoint instead
        const data = {
          spaceId,
          emailAddresses
        };

        postData('/members/invite-users', data).then(response => {

          if (response?.success) setSubmitted(true);
    
        });

      } 

    } else {

      setInvalid(true);

    }

  };

  return (
    <section className={`${styles.root} dashboard-single card`}>
      <h1 className="h4">Add employees</h1>
      <TabbedForm success={submitted}
        info="We're creating the members! This can sometimes take a while but we'll email you when it's done">
        <p>Invite new employees with their email address. They will receive a message instructing them on how to activate their account.</p>
        <form className="form form--standard"
          onSubmit={handleSubmit(onSubmit)}>
          <fieldset>
            <div className="form__grid">
              <Textarea name="emailAddresses" 
                label="Email address(es)" 
                placeholder="Add multiple addresses separated by ; or ," 
                hasError={errors.emailAddresses}
                register={register} />
              <div className={styles.file}>
                <label ref={fileRef}>
                  <span className="label text--small">Get employees from a CSV list</span>
                  <input type="file" 
                    accept=".csv" 
                    onChange={(e) => setFiles(e.currentTarget.files)} />
                  <Expander expanded={!!files}>
                    <div className={styles.selected}>
                      <Whitepaper />
                      <span>{files && files[files.length - 1]?.name }</span>
                    </div>
                  </Expander>
                  <Button text="Upload"
                    emitClick={() => fileRef.current?.click()} />
                </label>
              </div>
            </div>
          </fieldset>
          <Button text="Add employee(s)"
            type="submit"
            prominence="primary" />
          <Error message={error && errorMessage ? `${errorMessage} (${error})` : 'Please upload a CSV or enter some email addresses'}
            expanded={invalid || !!error}
            persist={true} />
        </form>
      </TabbedForm>
    </section>
  );

};

export default TeamAdd;
