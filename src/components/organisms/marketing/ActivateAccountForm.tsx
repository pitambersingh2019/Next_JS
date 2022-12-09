import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { Button, Error, Input } from '_atoms';
import { ActionForm } from '_molecules';
import { useFetch } from '_hooks';

interface ISubmitted {
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
}

export interface IProps {
  content: IFormIntro;
}

// used to render the account activation component - a new employee recieves an email with a unique link which takes them to a page where they enter their name & password to activate their account
const ActivateAccountForm = ({ content }: IProps) => {

  const router = useRouter();
  const { v: token } = router.query;
  const { register, errors, watch, handleSubmit } = useForm({ mode: 'onSubmit' });
  const { error, errorMessage, success, postData } = useFetch();
  const { formHeading, formSummary } = content;
  // we want to watch the first password field in order to validate that the value in both password fields matches 
  const enteredPassword = watch('password');

  // handle form submit, formatting the data before posting to the API
  const onSubmit = (submitted: ISubmitted) => {

    const { firstName, lastName, password } = submitted;

    const data = {
      token,
      name: `${firstName} ${lastName}`,
      password
    };

    postData('/members/activate-user', data);

  };

  return (
    <ActionForm layout="double"
      success={success}
      heading={formHeading}
      description={!token ? `Sorry, that link doesn't look right. Please check your email and try again` : formSummary}
      info="Your account is set up and complete, now you can start using Prosper EX"
      button={{
        target: '/dashboard',
        text: 'Go to your dashboard'
      }}>
      {token && (
        <form className="form form--standard"
          onSubmit={handleSubmit(onSubmit)}>
          <fieldset>
            <div className="form__grid">
              <legend>Form group</legend>
              <Input name="firstName"
                label="First name" 
                type="text"
                hasError={errors.firstName}
                errorMsg={errors.firstName?.message}
                register={register} 
                required={true} />
              <Input name="lastName"
                label="Last name" 
                type="text"
                hasError={errors.lastName}
                errorMsg={errors.lastName?.message}
                register={register} 
                required={true} />
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
          <Button text="Activate"
            type="submit"
            prominence="primary" />
          <Error message={`${errorMessage} (${error})`}
            expanded={!!error} />
        </form>
      )}
    </ActionForm>
  );

};

export default ActivateAccountForm;
