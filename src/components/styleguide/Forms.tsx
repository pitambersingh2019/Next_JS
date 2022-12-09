import { Controller, useForm } from 'react-hook-form';
import { Button, Checkbox, Date, DateRange, Input, Phone, RadioButtons, Scale, Select, Textarea, Toggle } from '_atoms';
import { usePhone } from '_hooks';
import styles from './Forms.module.scss';

const options: IOption[] = [
  {
    text: 'Option 1',
    value: 'option-1'
  },
  {
    text: 'Option 2',
    value: 'option-2'
  }
];

// used to show all the different form field components
const Forms = () => {

  const { control, register, errors, handleSubmit } = useForm({ mode: 'onSubmit' });
  const { instance, phoneValidation, initPhone } = usePhone();

  const onSubmit = (data: any) => console.log(data);

  return (
    <section className="section employee">
      <div className="inner">
        <h2>Forms</h2>
        <form className="form form--standard"
          onSubmit={handleSubmit(onSubmit)}>
          <fieldset>
            <div className="form__grid">
              <legend>Form group</legend>
              <Input name="textField"
                label="Text field" 
                type="text"
                hasError={errors.textField}
                errorMsg={errors.textField?.message}
                customMsg="Can I get a text field"
                register={register} 
                required={true} />
              <Input name="emailField"
                label="Email field" 
                type="email"
                hasError={errors.emailField}
                errorMsg={errors.emailField?.message}
                customMsg="Can I get an email field"
                register={register} 
                required={true} />
              <Controller name="phoneField"
                control={control}
                defaultValue=""
                rules={phoneValidation}
                render={({ onChange, value }) => (
                  <Phone onChange={onChange} 
                    value={value} 
                    instance={instance} 
                    onInit={(input) => initPhone(input)}
                    name="phoneField" 
                    label="Phone field" 
                    hasError={errors.phoneField}
                    errorMsg={errors.phoneField?.message} />
                )} /> 
              <Input name="passwordField"
                label="Password field" 
                type="password"
                hasError={errors.passwordField}
                errorMsg={errors.passwordField?.message}
                customMsg="You need a password you wombat"
                register={register} 
                required={true} />
              <Select name="dropdownField"
                label="Dropdown field"
                options={options}
                hasError={errors.dropdownField}
                errorMsg={errors.dropdownField?.message}
                customMsg="Please select an option"
                register={register}
                required={true} />
              <Textarea name="textareaField"
                label="Textarea field"
                hasError={errors.textareaField}
                errorMsg={errors.textareaField?.message}
                customMsg="Please provide a short summary"
                register={register} 
                required={true} />
              <Controller name="dateField"
                control={control}
                defaultValue=""
                rules={{ required: 'Choose a date' }}
                render={({ onChange, value }) => (
                  <Date onChange={onChange}
                    value={value}
                    label="Date"
                    hasError={errors.dateField}
                    errorMsg={errors.dateField?.message} />
                )} />
            </div>
          </fieldset>
          <fieldset>
            <div className="form__grid">
              <legend className="h3">Visible legend</legend>
              <Scale name="scaleField"
                label="Choose an answer"
                type="normal"
                worst="Terrible"
                best="Great"
                hasError={errors.scaleField}
                errorMsg={errors.scaleField?.message}
                customMsg="Please choose an option on the scale"
                register={register} 
                required={true} />
              <Scale name="happinessField"
                label="Happiness scale"
                type="emoji"
                hasError={errors.happinessField}
                errorMsg={errors.happinessField?.message}
                customMsg="Please choose an emoji"
                register={register} 
                required={true} />
              <Checkbox name="checkboxField"
                text="Checkbox"
                hasError={errors.checkboxField}
                register={register} />
              <Checkbox name="termsField"
                text="Terms"
                hasError={errors.termsField}
                errorMsg={errors.termsField?.message}
                customMsg="Please agree to the terms and conditions"
                register={register} 
                required={true} />
              <RadioButtons name="radioField"
                label="Group of radio buttons"
                options={options}
                hasError={errors.radioField}
                errorMsg={errors.radioField?.message}
                customMsg="Please choose an option yo!"
                register={register} 
                required={true} />
              <Toggle name="isAnonymous"
                text="Make all responses anonymous"
                hasError={errors.anonymous}
                register={register}
                preselect={false} />
            </div>
          </fieldset>
          <fieldset>
            <div className={styles.range}>
              <legend className="h3">Date range</legend>
              <Controller name="dateRangeField"
                control={control}
                defaultValue=""
                rules={{ required: 'Select a couple of dates' }}
                render={({ onChange, value }) => (
                  <DateRange onChange={onChange}
                    value={value}
                    label="Date range"
                    hasError={errors.dateRangeField}
                    errorMsg={errors.dateRangeField?.message} />
                )} />
            </div>
          </fieldset>
          <Button text="Submit form"
            type="submit"
            prominence="primary" />
        </form>
      </div>
    </section>
  );

};

export default Forms;
