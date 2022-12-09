import dynamic from 'next/dynamic';
import { useForm } from 'react-hook-form';
import { Button, Error, Input } from '_atoms';
import TabbedForm from './../global/TabbedForm';
import { useFetch } from '_hooks';
import styles from './EditModal.module.scss';

interface IProps {
  topic: ITopic;
  launch: boolean;
  emitClose: () => void;
}

const Modal = dynamic(import('./../global/Modal'));

// modal component used to update a learning topic name 
const EditTopic = ({ topic, launch, emitClose }: IProps) => {

  const { register, errors, handleSubmit } = useForm({ mode: 'onSubmit' });
  const { error, errorMessage, submitted, setSubmitted, postData } = useFetch();

  // post new name to the API 
  const onSubmit = (submitted: ITopicUpdate) => {

    postData(`/training-topics/edit/${topic.id}`, submitted).then(response => {

      if (response?.id) setSubmitted(true);

    });

  };

  return (
    <Modal launch={launch}
      classes={`${styles.root} modal`}
      emitClose={emitClose}>
      <h2 className="h4">Edit topic</h2>
      <TabbedForm success={submitted}
        info={`We've updated the topic name`}>
        <form className="form form--standard"
          onSubmit={handleSubmit(onSubmit)}>
          <fieldset>
            <div className="form__grid">
              <legend>Edit topic</legend>
              <Input name="name"
                label="Topic name" 
                type="text"
                prefill={topic.name}
                hasError={errors.name}
                errorMsg={errors.name?.message}
                register={register} 
                required={true} />
            </div>
          </fieldset>
          <Button text="Update topic"
            type="submit"
            prominence="primary" />
          <Error message={`${errorMessage} (${error})`}
            expanded={!!error} />
        </form>
      </TabbedForm>
    </Modal>
  );

};

export default EditTopic;
