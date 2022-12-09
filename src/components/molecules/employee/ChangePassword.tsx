import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useForm } from 'react-hook-form';
import { Button, Error, Input } from '_atoms';
import TabbedForm from './../global/TabbedForm';
import { useFetch } from '_hooks';
import styles from './ChangePassword.module.scss';

interface ISubmitted {
  password: string;
  confirmPassword: string;
}

interface IProps {
  launch: boolean;
  emitClose?: () => void;
}

const Modal = dynamic(import('./../global/Modal'));

// used to allow the employee to update their password on their profile page
const ChangePassword = ({ launch, emitClose }: IProps) => {

  const { register, errors, watch, handleSubmit } = useForm({ mode: 'onSubmit' });
  const { error, errorMessage, submitted, setSubmitted, postData } = useFetch();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const enteredPassword = watch('password');

  // there's a specific endpoint for this, which we need to post the updated password to 
  const onSubmit = (submitted: ISubmitted) => {

    const { password } = submitted;

    const data = {
      password
    };

    postData('/profile/change-password', data).then(response => {

      if (response?.success) setSubmitted(true);

    });

  };

  useEffect(() => {

    // when the parent component tells us to launch the modal, set the local value to be passed to the Modal component 
    if (launch) setModalOpen(true);

  }, [launch]);

  useEffect(() => {

    // emit the close event to be used in the parent component
    if (!modalOpen && emitClose) emitClose();

  }, [modalOpen]);

  return (
    <Modal launch={modalOpen}
      classes={`${styles.root} modal`}
      emitClose={() => setModalOpen(false)}>
      <h2 className="h4">Change password</h2>
      <TabbedForm success={submitted}
        info="We've updated your password">
        <form className="form form--standard"
          onSubmit={handleSubmit(onSubmit)}>
          <fieldset>
            <div className="form__grid">
              <legend>Reset your password</legend>
              <Input name="password"
                label="Password" 
                type="password"
                length={10}
                hasError={errors.password}
                errorMsg={errors.password?.message}
                register={register} 
                required={true} />
              <Input name="confirmPassword"
                label="Confirm password" 
                type="password"
                length={10}
                compare={enteredPassword}
                hasError={errors.confirmPassword}
                errorMsg={errors.confirmPassword?.message}
                register={register} 
                required={true} />
            </div>
          </fieldset>
          <Button text="Reset password"
            type="submit"
            prominence="primary" />
          <Error message={`${errorMessage} (${error})`}
            expanded={!!error} />
        </form>
      </TabbedForm>
    </Modal>
  );

};

export default ChangePassword;
