import { useContext, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useForm } from 'react-hook-form';
import { Button, Error, Select } from '_atoms';
import TabbedForm from './../global/TabbedForm';
import { LoadingContext } from '_context';
import { useFetch } from '_hooks';
import styles from './DeleteModal.module.scss';

interface IProps {
  all: ITopic[];
  topic: ITopic;
  launch: boolean;
  emitClose: () => void;
}

const Modal = dynamic(import('./../global/Modal'));

// modal component used to delete a learning topic from the platform. If there are active training surveys assigned to the target topic, the user has the option to move these to another topic 
const DeleteTopic = ({ all, topic, launch, emitClose }: IProps) => {

  const { register, errors, handleSubmit } = useForm({ mode: 'onSubmit' });
  const { error, errorMessage, submitted, setSubmitted, postData } = useFetch();
  const { isLoading } = useContext(LoadingContext);
  const [migrating, setMigrating] = useState<string>('');
  const [buttonText, setButtonText] = useState<string>('Delete topic');
  const [successText, setSuccessText] = useState<string>('The topic has been deleted.');
  const { id, name, active } = topic;
  const form = active > 0;
  const single = active === 1;

  // format text content based on the number of active surveys 
  const conjoiner = single ? 'it' : 'them';
  const label = `There ${single ? 'is a' : 'are ' + active} learning survey${single ? '' : 's'} in this topic. Do you want to move ${conjoiner} to another topic?`;
  const selected = `Don't move ${conjoiner} to a topic`;

  // filter current topic, then map & create the options for the dropdown to select the topic to migrate active surveys to  
  const options: IOption[] = all.filter(item => item.id !== id).map(({ id, name }) => ({
    text: name,
    value: id
  }));

  // the user has confirmed that they really want to delete the topic, so we post to the API with the optional topic to migrate the active surveys to
  const onSubmit = () => {

    const data = {
      migrate: migrating ? migrating : null
    };

    postData(`/training-topics/delete/${id}`, data).then(response => {

      if (response?.deleted.id) setSubmitted(true);

    });

  };

  useEffect(() => {

    // check if we have a form first
    if (form) {
      
      // we've chosen a topic to migrate to
      if (migrating.length) {

        // get the name of the new topic to use in the button text
        const movedTo = all.find(item => item.id === migrating)?.name;

        setButtonText('Move learning and delete topic');
        setSuccessText(`The topic has been deleted and moved${movedTo ? ' to ' + movedTo : ''}.`); 
      
      } else {

        // we're just deleting the topic
        setButtonText('Delete topic only');

      }

    }

  }, [migrating]);

  return (
    <Modal launch={launch}
      classes={`${styles.root}${form ? ' ' + styles.options : ''} modal`}
      emitClose={emitClose}>
      <h2 className="h4">Are you sure you want to delete { name }?</h2>
      <TabbedForm success={submitted}
        info={successText}>
        <form className="form form--standard"
          onSubmit={handleSubmit(onSubmit)}>
          <fieldset>
            <legend>Delete topic</legend>
            {form && (
              <Select name="migrate"
                label={label}
                selected={selected}
                options={[{ text: selected, value: '' }, ...options]}
                hasError={errors.migrate}
                register={register}
                emitChange={(value) => setMigrating(value)} />
            )}
          </fieldset>
          <div className="actions">
            <Button text={buttonText}
              type="submit"
              prominence="primary"
              disabled={isLoading} />
            <Button text="Cancel"
              emitClick={emitClose} />
          </div>
          <Error message={`${errorMessage} (${error})`}
            expanded={!!error} />
        </form>
      </TabbedForm>
    </Modal>
  );

};

export default DeleteTopic;
