import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { Button, Error, Input } from '_atoms';
import { ActionForm } from '_molecules';
import { useFetch } from '_hooks';

interface ISubmitted {
  password: string;
  confirmPassword: string;
}

export interface IProps {
  content: IFormIntro;
}

const button: ILink = {
  text: 'Log in',
  target: '/login'
};

// used to allow the user to reset their password if forgotten. They get emailed a unique link with a token
const ResetPasswordForm = ({ content }: IProps) => {

  const router = useRouter();
  const { register, errors, watch, handleSubmit } = useForm({ mode: 'onSubmit' });
  const { env, error, errorMessage, submitted, setSubmitted, fetchData, postData } = useFetch();
  const [token, setToken] = useState<string | null>(null);
  const [valid, setValid] = useState<boolean>(false);
  const { formHeading, formSummary } = content;
  const endpoint = `/account/reset-password/${token}`;
  // we want to watch the first password field in order to validate that the value in both password fields matches 
  const enteredPassword = watch('password');

  useEffect(() => {

    // read the token from the query string
    const userToken = router.query.token;

    // store the token locally
    if (userToken && typeof userToken === 'string') setToken(userToken);

  }, []);

  useEffect(() => {

    // validate token on mount
    if (env && token) fetchData(endpoint).then(response => response.success && setValid(true));

  }, [env, token]);

  // post submitted data to API
  const onSubmit = (submitted: ISubmitted) => postData(endpoint, submitted).then(response => response.success && setSubmitted(true));

  return (
    <ActionForm layout="single"
      success={submitted}
      heading={formHeading}
      description={formSummary}
      info="Your password has been reset"
      button={button}>
      {valid ? (
        <form className="form form--standard"
          onSubmit={handleSubmit(onSubmit)}>
          <fieldset>
            <div className="form__grid">
              <legend>Form group</legend>
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
      ) : (
        token && !error ? (
          <>
            <h2>One second</h2>
            <p>We're just fetching your details...</p>
          </>
        ) : (
          <>
            <h2>Sorry</h2>
            <p>We can't find your details on our system. Please check the link in your email and try again {error ? ' (' + error + ')' : ''}</p>
          </>
        )
      )}
    </ActionForm>
  );

};

export default ResetPasswordForm;
