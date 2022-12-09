import { useForm } from 'react-hook-form';
import { Button, Checkboxes, Input, RadioButtons, Scale, Textarea } from '_atoms';
import styles from './Surveys.module.scss';

const radioOptions: IOption[] = [
  {
    text: 'Option 1',
    value: 'option-1'
  },
  {
    text: 'Option 2',
    value: 'option-2'
  },
  {
    text: 'Option 3',
    value: 'option-3'
  },
  {
    text: 'Option 4',
    value: 'option-4'
  }
];

const checkboxOptions: IOptionCheckboxes[] = [
  {
    text: 'Choice 1',
    value: 'choice-1'
  },
  {
    text: 'Choice 2',
    value: 'choice-2'
  },
  {
    text: 'Choice 3',
    value: 'choice-3'
  },
  {
    text: 'Choice 4',
    value: 'choice-4'
  }
];

// used to render an example survey, containing all the different question types
const Surveys = () => {

  const { register, watch, errors, handleSubmit } = useForm({ mode: 'onSubmit' });
  
  const onSubmit = (data: any) => console.log(data);

  return (
    <section className={`${styles.root} section employee`}>
      <div className="inner">
        <h2>Surveys</h2>
        <form className="form form--survey"
          onSubmit={handleSubmit(onSubmit)}>
          <fieldset>
            <header className="form--survey__header">
              <legend className="h3">First quarterly employee survey, 2021</legend>
              <p className="text--small">Survey description lorem ipsum dolor sit</p>
            </header>
            <div className="form--survey__section">
              <Scale name="scaleField"
                heading="Question 1"
                label="How has the last 3 months at the business been for you?"
                type="normal"
                worst="Terrible"
                best="Great"
                hasError={errors.scaleField}
                errorMsg={errors.scaleField?.message}
                customMsg="Please choose an option on the scale"
                register={register} 
                required={true} />
            </div>
            <div className="form--survey__section">
              <Textarea name="textareaField"
                heading="Question 2"
                label="What should we start doing?"
                placeholder="Type a response"
                hasError={errors.textareaField}
                errorMsg={errors.textareaField?.message}
                customMsg="Please let us know"
                register={register} 
                required={true} />
            </div>
            <div className="form--survey__section">
              <Input name="textField"
                type="text"
                heading="Question 3"
                label="What should we stop doing?" 
                placeholder="Type a response"
                hasError={errors.textField}
                errorMsg={errors.textField?.message}
                customMsg="Please let us know"
                register={register} 
                required={true} />
            </div>
            <div className="form--survey__section">
              <RadioButtons name="radioField"
                options={radioOptions}
                heading="Question 4"
                label="Question text lorem ipsum dolor sit amet consectetur adipiscing elit sed" 
                hasError={errors.radioField}
                errorMsg={errors.radioField?.message}
                customMsg="Please choose an option"
                register={register} 
                required={true} />
            </div>
            <div className="form--survey__section">
              <Scale name="happinessField"
                heading="Question 5"
                label="How has the last 3 months at the business been for you?"
                type="emoji"
                hasError={errors.happinessField}
                errorMsg={errors.happinessField?.message}
                customMsg="Please choose an emoji"
                register={register} 
                required={true} />
            </div>
            <div className="form--survey__section">
              <Checkboxes name="checkboxField"
                options={checkboxOptions}
                heading="Question 6"
                label="Question text lorem ipsum dolor sit amet consectetur adipiscing elit sed" 
                customMsg="Please select at least one option"
                register={register} 
                required={true}
                watch={watch} />
            </div>
          </fieldset>
          <div className="form--survey__section">
            <Button text="Send answers"
              type="submit"
              prominence="primary" />
          </div>
        </form>
      </div>
    </section>
  );

};

export default Surveys;
