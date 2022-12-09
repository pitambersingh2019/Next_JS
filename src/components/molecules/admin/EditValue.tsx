import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useForm } from 'react-hook-form';
import { Button, Error, Input } from '_atoms';
import { useFetch } from '_hooks';
import styles from './EditModal.module.scss';

interface IProps {
  companyValue: ICompanyValue;
  launch: boolean;
  emitClose: () => void;
}

const Modal = dynamic(import('./../global/Modal'));

// modal component used to update a company value name 
const EditValue = ({ companyValue, launch, emitClose }: IProps) => {

  const { register, errors, handleSubmit } = useForm({ mode: 'onSubmit' });
  const { error, errorMessage, submitted, setSubmitted, postData } = useFetch();

  // post new name to the API 
  const onSubmit = (submitted: ICompanyValue) => {

    const { id } = companyValue;
    const { name } = submitted;
    const data = { 
      id, 
      name 
    };

    postData(`/company-values/edit`, data).then(response => {

      if (response?.edited.id) setSubmitted(true);

    });

  };

  // on success, emit close event to parent component
  useEffect(() => {

    if (submitted) emitClose();

  }, [submitted]);

  return (
    <Modal launch={launch}
      classes={`${styles.root} modal`}
      emitClose={emitClose}>
      <h2 className="h4">Edit value</h2>
      <form className="form form--standard"
        onSubmit={handleSubmit(onSubmit)}>
        <fieldset>
          <div className="form__grid">
            <legend>Edit value</legend>
            <Input name="name"
              label="Company value name" 
              type="text"
              prefill={companyValue.name}
              hasError={errors.name}
              errorMsg={errors.name?.message}
              register={register} 
              required={true} />
          </div>
        </fieldset>
        <Button text="Update value"
          type="submit"
          prominence="primary" />
        <Error message={`${errorMessage} (${error})`}
          expanded={!!error} />
      </form>
    </Modal>
  );

};

export default EditValue;
