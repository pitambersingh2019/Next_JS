import { useContext } from 'react';
import dynamic from 'next/dynamic';
import { Button, Error } from '_atoms';
import TabbedForm from './../global/TabbedForm';
import { LoadingContext } from '_context';
import { useFetch } from '_hooks';
import styles from './DeleteModal.module.scss';

interface IProps {
  employee: IUser | IUserIndex;
  launch: boolean;
  emitClose: () => void;
  emitDeleted: () => void;
}

const Modal = dynamic(import('./../global/Modal'));

// modal component used in various places to delete a specific team member from the platform 
const DeleteEmployee = ({ employee, launch, emitClose, emitDeleted }: IProps) => {

  const { error, errorMessage, submitted, setSubmitted, postData } = useFetch();
  const { isLoading } = useContext(LoadingContext);
  const { id, name } = employee;
  const firstName = name.split(' ')[0];

  // the user has confirmed that they really want to delete the stricken employee, so we post the ID to the API 
  const deleteEmployee = () => {

    postData(`/members/delete/${id}`, id).then(response => {

      if (response?.success) {

        setSubmitted(true);
        emitDeleted();

      }

    });

  };

  return (
    <Modal launch={launch}
      classes={`${styles.root} modal`}
      emitClose={emitClose}>
      <h2 className="h4">Are you sure you want to delete { firstName }?</h2>
      <TabbedForm success={submitted}
        info={`${firstName} has been deleted`}>
        <div className="actions">
          <Button text="Delete"
            prominence="primary"
            emitClick={deleteEmployee}
            disabled={isLoading} />
          <Button text="Cancel"
            emitClick={emitClose} />
        </div>
        <Error message={`${errorMessage} (${error})`}
          expanded={!!error} />
      </TabbedForm>
    </Modal>
  );

};

export default DeleteEmployee;
