import { Controller, useForm } from 'react-hook-form';
import { Button, Error, Input, Phone, Select } from '_atoms';
import { ActionForm } from '_molecules';
import { useFetch, usePhone } from '_hooks';

interface ISubmitted {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  companyName: string;
  companySize: string;
}

export interface IProps {
  content: IFormIntro;
}

// define options for company size dropdown
const companySizes: IOption[] = [
  {
    text: '1-9',
    value: '1-9'
  },
  {
    text: '10-99',
    value: '10-99'
  },
  {
    text: '100-499',
    value: '100-499'
  },
  {
    text: '500+',
    value: '500+'
  }
];

// used to render the enquiry form - for prospective businesses that are interested in buying & using the Prosper platform
const ContactUsForm = ({ content }: IProps) => {

  const { control, register, errors, watch, handleSubmit } = useForm({ mode: 'onSubmit' });
  const { error, errorMessage, success, postData } = useFetch();
  const { instance, phoneValidation, initPhone } = usePhone();
  const { formTitle, formHeading, formSummary } = content;
  const enteredFirstName = watch('firstName');

  // no need to format submitted data, so we can just post to the API
  const onSubmit = (submitted: ISubmitted) => postData('/demo/request', submitted);

  return (
    <ActionForm layout="double"
      success={success}
      title={formTitle}
      heading={formHeading}
      description={formSummary}
      thanks={`Thanks ${ enteredFirstName }`}
      info="We'll be in touch via email">
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
            <Input name="email"
              label="Business email" 
              type="email"
              hasError={errors.email}
              errorMsg={errors.email?.message}
              register={register} 
              required={true} />
            <Controller name="phoneNumber"
              control={control}
              defaultValue=""
              rules={phoneValidation}
              render={({ onChange, value }) => (
                <Phone onChange={onChange} 
                  value={value} 
                  instance={instance} 
                  onInit={(input) => initPhone(input)}
                  name="phoneNumber" 
                  label="Phone" 
                  hasError={errors.phoneNumber}
                  errorMsg={errors.phoneNumber?.message} />
              )} /> 
            <Input name="companyName"
              label="Company name" 
              type="text"
              hasError={errors.companyName}
              errorMsg={errors.companyName?.message}
              register={register} 
              required={true} />
            <Select name="companySize"
              label="Company size"
              options={companySizes}
              hasError={errors.companySize}
              errorMsg={errors.companySize?.message}
              register={register}
              required={true} />
          </div>
        </fieldset>
        <Button text="Get a demo"
          type="submit"
          prominence="primary" />
        <Error message={`${errorMessage} (${error})`}
          expanded={!!error} />
      </form>
    </ActionForm>
  );

};

export default ContactUsForm;
