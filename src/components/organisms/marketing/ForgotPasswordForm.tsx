import { useForm } from 'react-hook-form';
import { Button, Error, Input } from '_atoms';
import { ActionForm } from '_molecules';
import { useFetch } from '_hooks';

interface ISubmitted {
  email: string;
  password: string;
}

export interface IProps {
  content: IFormIntro;
}

// used to render a forgotten password form, allowing the user to enter their email. If it exists, they're sent instructions on how to reset
const ForgotPasswordForm = ({ content }: IProps) => {

  const { register, errors, handleSubmit } = useForm({ mode: 'onSubmit' });
  const { error, errorMessage, success, postData } = useFetch();
  const { formHeading, formSummary } = content;
  
  // no need to format submitted data, so we can just post to the API
  const onSubmit = (data: ISubmitted) => postData('/account/forgot-password', data);

  return (
    <ActionForm layout="single"
      success={success}
      heading={formHeading}
      description={formSummary}
      info="If the email exists in our system, we'll send you instructions on how to reset your password">
      <form className="form form--standard"
        onSubmit={handleSubmit(onSubmit)}>
        <fieldset>
          <div className="form__grid">
            <legend>Form group</legend>
            <Input name="email"
              label="Email" 
              type="email"
              hasError={errors.email}
              errorMsg={errors.email?.message}
              register={register} 
              required={true} />
          </div>
        </fieldset>
        <Button text="Send email"
          type="submit"
          prominence="primary" />
        <Error message={`${errorMessage} (${error})`}
          expanded={!!error} />
      </form>
    </ActionForm>
  );

};

export default ForgotPasswordForm;
