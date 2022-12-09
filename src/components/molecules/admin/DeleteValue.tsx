import { useContext, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useForm } from 'react-hook-form';
import { Button, Error } from '_atoms';
import { LoadingContext } from '_context';
import { useFetch } from '_hooks';
import styles from './DeleteModal.module.scss';

interface IProps {
  companyValue: ICompanyValue;
  launch: boolean;
  emitClose: () => void;
}

const Modal = dynamic(import('./../global/Modal'));

// modal component used to delete a company value from the platform
const DeleteValue = ({ companyValue, launch, emitClose }: IProps) => {

  const { handleSubmit } = useForm({ mode: 'onSubmit' });
  const { error, errorMessage, submitted, setSubmitted, postData } = useFetch();
  const { isLoading } = useContext(LoadingContext);
  const { id, name } = companyValue;

  // the user has confirmed that they really want to delete the company value, so we post its ID to the API
  const onSubmit = () => {

    const data = {
      id
    };

    postData('/company-values/delete', data).then(response => {

      if (response?.deleted.id) setSubmitted(true);

    });

  };

  useEffect(() => {

    if (submitted) emitClose();

  }, [submitted]);

  return (
    <Modal launch={launch}
      classes={`${styles.root} modal`}
      emitClose={emitClose}>
      <h2 className="h4">Are you sure you want to delete { name }?</h2>
      <p className="text--small">Deleting this company value will remove it from any questions already created - affecting reporting data - and cannot be undone.</p>
      <form className="form form--standard"
        onSubmit={handleSubmit(onSubmit)}>
        <div className="actions">
          <Button text="Delete value"
            type="submit"
            prominence="primary"
            disabled={isLoading} />
          <Button text="Cancel"
            emitClick={emitClose} />
        </div>
        <Error message={`${errorMessage} (${error})`}
          expanded={!!error} />
      </form>
    </Modal>
  );

};

export default DeleteValue;
