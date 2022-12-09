import { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { Button, Error, Input } from '_atoms';
import { ActionForm } from '_molecules';
import { EnvContext } from '_context';
import { useFetch } from '_hooks';
import { redirect } from '_utils';
import styles from './LoginForm.module.scss';

interface ISubmitted {
  email: string;
  password: string;
}

export interface IProps {
  content: IFormIntro;
}

const unAuthMsg = 'Sorry, your username or password are incorrect. Please check and try again';

// used to authenticate user & take them from marketing site to dashboard
const LoginForm = ({ content }: IProps) => {

  const router = useRouter();
  const { returnUrl, route, unAuth } = router.query;
  const { host } = useContext(EnvContext);
  const { register, errors, handleSubmit } = useForm({ mode: 'onSubmit' });
  const { error, errorMessage, postData } = useFetch();
  const [description, setDescription] = useState<string | undefined>(undefined);
  const { formHeading } = content;

  // handle form submission, authentication is done via a cookie
  const onSubmit = (submitted: ISubmitted) => {

    postData('/account/login', submitted).then(response => {

      if (response?.success) {

        const { spaceUrl } = response;

        const isLocalServer = host.includes('local');

        // if the user's session timed out we'll have a query string of their last location. Take them back there if so - otherwise, to the employee dashboard
        const location = returnUrl ? returnUrl : '/dashboard';
        // if we're working locally, build out the URL
        const localUrl = `http://absurd.${host}${host.includes('local') && !host.includes('prosperex.local') ? ':3020' : ''}`;
        // contruct the URL for redirect
        const target = `${isLocalServer ? localUrl : spaceUrl}${location}`;

        // take the user there
        redirect(target);

      }

    });

  };

  useEffect(() => {

    // tell the user that their creds weren't right
    if (unAuth) setDescription(unAuthMsg);

    // tell the user if their session timed out
    if (returnUrl) setDescription(`You tried to access a page which is only available to logged in users. If your session expired, please log in again`);

    // clean up URL
    if (unAuth) router.replace(`/${route}`);

  }, [returnUrl, unAuth]);

  return (
    <ActionForm layout="single"
      success={false}
      heading={formHeading}
      description={description}>
      <form className="form form--standard"
        onSubmit={handleSubmit(onSubmit)}>
        <fieldset>
          <div className="form__grid">
            <legend>Form group</legend>
            <Input name="email"
              label="Email address" 
              type="email"
              hasError={errors.email}
              errorMsg={errors.email?.message}
              register={register} 
              required={true} />
            <Input name="password"
              label="Password" 
              type="password"
              hasError={errors.password}
              errorMsg={errors.password?.message}
              register={register} 
              required={true} />
            <div className={styles.action}>
              <Link href="/forgotten-password">
                <a className="text-link">Forgot your password?</a>
              </Link>
            </div>
          </div>
        </fieldset>
        <Button text="Log in"
          type="submit"
          prominence="primary" />
        <Error message={error === 401 ? unAuthMsg : `${errorMessage} (${error})`}
          expanded={!!error} />
      </form>
    </ActionForm>
  );

};

export default LoginForm;
