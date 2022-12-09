import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '_atoms';
import { Cross } from '_vectors';
import { useRefresh } from '_hooks';
import styles from './SurveyChoices.module.scss';

interface IProps {
  surveyType: SurveyType;
  active: boolean;
  questionType: 'multi' | 'check' | 'rating';
  options: ISurveyChoice[];
  label?: string;
  omitCorrect?: boolean;
  defaultChoices?: number;
  emitComplete: (data: ISurveyChoice[]) => void;
  emitIncomplete: () => void;
}

// default shared choice object properties 
const defaultChoiceProps = { 
  choiceId: 0, 
  order: 0 
};

// checkbox choices have a 'text' property
const defaultCheckboxChoice: ISurveyChoice = {
  ...defaultChoiceProps,
  text: ''
};

// multiple choices have a 'text' & 'correct' property
const defaultMultipleChoice: ISurveyChoice = {
  ...defaultChoiceProps,
  text: '',
  correct: false
};

// rating choices have a 'start' & 'end' property
const defaultRatingChoice: ISurveyChoice = {
  ...defaultChoiceProps,
  start: '',
  end: ''
};

// used in survey creation to render the text inputs for different choice options in three of the survey question types - rating, checkbox & multiple choice. By default there are at least two choices, with the user having the ability to add or remove as they please. However, for happiness surveys there are five choices & the user doesn't have the ability to add or remove any as this would skew the data (happiness scoring assigns a numerical value for each of the five options)
const SurveyChoices = ({ surveyType, active, questionType, options, label, omitCorrect = false, defaultChoices = 2, emitComplete, emitIncomplete }: IProps) => {
  
  const { register, errors, formState: { isValid } } = useForm({ mode: 'onBlur' });
  const { refresh, bumpRefresh } = useRefresh();
  const [shown, setShown] = useState<boolean>(false);
  const [choices, setChoices] = useState<ISurveyChoice[]>(options);
  const [count, setCount] = useState<number>(options?.length ? options.length : defaultChoices);
  const [total, setTotal] = useState<number>(options?.length ? options.length : defaultChoices);
  const exactChoices = defaultChoices === 5;
  const isMulti = questionType === 'multi';
  const isRating = questionType === 'rating';
  const isCheck = questionType === 'check';

  // finds a choice by an index to returning either the matched choice or simply an object with the order matching the total number of choices. Extracted here as used by two methods below
  const findChoice = (index: number): ISurveyChoice => choices.find(({ order }) => order === index) ?? { order: total };

  // filters an array of choices to return an array that excludes an index. Extracted here as used by two methods below 
  const filterChoices = (toFilter: ISurveyChoice[], index: number): ISurveyChoice[] => toFilter.filter(({ order }) => order !== index);

  // sorts an array of choices by the order value of each object. Extracted here as used by two methods below 
  const sortChoices = (toSort: ISurveyChoice[]): ISurveyChoice[] => toSort.sort((a, b) => a.order < b.order ? -1 : 1);

  // need to keep everything in sync every time a choice's text value changes
  const handleChange = (value: string, index: number) => {

    const isFirst = index === 0;
    // get the target choice via its index 
    const targetChoice = findChoice(index);
    // create an updated choice object, using logic to take into account the fact rating choices have a 'start' & 'end' property instead of 'text' 
    const updatedChoice = isRating ? { ...targetChoice, start: isFirst ? value : '', end: isFirst ? '' : value } : { ...targetChoice, text: value };
    // create a new array of choices, filtering out the target choice & adding in our updated one
    const updatedChoices = [...filterChoices(choices, index), updatedChoice];
    // sort the array so everything is in the correct order
    const sortedChoices = sortChoices(updatedChoices);

    // store the new choices locally 
    setChoices(sortedChoices);
    // manually bump the refresh which will emit the new choices array to the parent component (SurveyQuestion) via the useEffect hook below 
    bumpRefresh();

  };

  // learning survey questions always have exactly one correct answer, so make sure we keep track of which one it is
  const handleCorrect = (index: number) => {

    // get the target choice via its index 
    const targetChoice = findChoice(index);
    // copy the rest of the properties whilst setting the 'correct' property to true
    const updatedChoice = { ...targetChoice, correct: true };
    // create an array of the rest of the choices, then map over each item to set the 'correct' property to false
    const updatedChoices = [...filterChoices(choices, index).map(item => ({ ...item, correct: false })), updatedChoice];
    // sort the array so everything is in the correct order
    const sortedChoices = sortChoices(updatedChoices);

    // store the new choices locally 
    setChoices(sortedChoices);
    // manually bump the refresh which will emit the new choices array to the parent component (SurveyQuestion) via the useEffect hook below 
    bumpRefresh();

  };

  // this method handles the addition or removal of a choice 
  const editChoiceCount = (add: boolean, reassign: boolean, index = 0) => {

    // create an array of the rest of the choices
    const filteredChoices = filterChoices(choices, index);

    // update the count & total values 
    if (isMulti || isCheck || isRating) {

      setCount(count + 1);
      setTotal(total + 1);

    }

    switch (true) {

      // when removing a choice, we need to check if it's the 'correct' answer (for learning surveys) & set the correct choice to be the first item in the array. Otherwise, just set it to be the filtered array 
      case !add:
        setChoices(reassign ? filteredChoices.map((item, i) => ({ ...item, correct: i === 0 })) : filteredChoices);
        setCount(count - 1);
        break;

      // when adding a new multiple choice option, add a new blank multiple choice object to the local choices array
      case isMulti:
        setChoices([...choices, { ...defaultMultipleChoice, order: total }]);
        break;

      // when adding a new checkbox choice option, add a new blank checkbox choice object to the local choices array
      case isCheck:
        setChoices([...choices, { ...defaultCheckboxChoice, order: total }]);
        break;

      // when adding a new rating choice option, add a new blank rating choice object to the local choices array
      case isRating:
        setChoices([...choices, { ...defaultRatingChoice, order: total }]);
        break;

      default:
        break;

    }

  };

  useEffect(() => {

    // on load, we need to know if there are extsintign choices (from a draft survey) or if we need to create an array of blank ones (for a new survey question)
    const shouldCreateChoices = options.length === 0;

    switch (true) {

      case (isMulti && shouldCreateChoices): {

        // create an array of x number (either 5 or 2 depending on whether it's a happiness survey or not) of multiple choice objects
        const multiChoices = Array(defaultChoices).fill('').map((_, i) => ({
          ...defaultMultipleChoice,
          correct: i === 0,
          order: i
        }));

        // store the array locally
        setChoices(multiChoices);
        break;

      }

      case (isCheck && shouldCreateChoices): {
        
        // create an array of 2 checkbox choice objects
        const checkChoices = Array(2).fill('').map((_, i) => ({
          ...defaultCheckboxChoice,
          order: i
        }));

        // store the array locally
        setChoices(checkChoices);
        break;
      
      }

      case (isRating && shouldCreateChoices): {

        // create an array of 2 rating choice objects
        const ratingChoices = Array(2).fill('').map((_, i) => ({
          ...defaultRatingChoice,
          order: i
        }));

        // store the array locally
        setChoices(ratingChoices);
        break;

      }

      default:
        break;

    }

    // show the options to the user 
    setShown(true);

  }, []);

  useEffect(() => {

    // all three sets of choices for the different question type are rendered, with inactive ones hidden. This if block ensures we don't emit unneccessary data to the parent component (SurveyQuestion)
    if (active) {

      // choose which method to emit (based on whether all required fields are validated), which informs whether the submit button is enabled in SurveyCreate
      (isValid && shown) 
        ? emitComplete(choices)
        : emitIncomplete();

    }

  }, [isValid, shown, count, refresh]);

  return (
    <div className={`${styles.root}${!active ? ' ' + styles.inactive : ''}${shown ? ' ' + styles.shown : ''}`}>
      <span className="label text--small">{label ? label : 'Answers'}</span>
      <ul>
        {choices.map(({ choiceId, text, start, end, order, correct }, j) => {

          const isFirst = j === 0;
          const isLast = choices.length - 1 === j;
          let choiceName = `choice-${j}`;
          let choiceLabel = `Choice ${j + 1}`;
          let choicePrefill = text;

          if (isMulti && surveyType === 'Happiness') {

            switch (true) {

              case isFirst:
                choiceLabel = 'Least happy choice';
                break;

              case isLast:
                choiceLabel = 'Most happy choice';
                break;

              default:
                choiceLabel = `Choice ${j + 1}`;
                break;

            }

          }

          if (isRating) {

            choiceName = isFirst
              ? 'start'
              : 'end';

            choiceLabel = isFirst
              ? 'Worst rating'
              : 'Best rating';

            choicePrefill = isFirst
              ? start
              : end;

          }

          return (
            <li key={`choice-${choiceId}-${order}-${j}`} 
              className={`${styles.choice} ${styles[questionType]}${!isRating && count > defaultChoices ? ' ' + styles.removal : ''}`}>
              <Input name={choiceName} 
                label={choiceLabel} 
                type="text" 
                prefill={choicePrefill} 
                placeholder={choiceLabel} 
                hasError={errors[choiceName]} 
                errorMsg={errors[choiceName]?.message} 
                register={register} 
                required={true}
                emitChange={(value) => handleChange(value, order)} />
              {!isRating && count > defaultChoices && (
                <button className={styles.remove}
                  type="button"
                  aria-label="Remove"
                  onClick={() => editChoiceCount(false, !!correct, order)}>
                  <Cross /> 
                </button>
              )}
              {(isMulti && !omitCorrect) && (
                <button className={`${styles.correct} text--small widget-link`}
                  type="button"
                  disabled={correct}
                  onClick={() => handleCorrect(order)}>
                  {correct ? 'Correct answer' : 'Mark as correct answer'}
                </button>
              )}
            </li>
          );

        })}
      </ul>
      {(!isRating && !exactChoices) && ( 
        <button className={`${styles.add} widget-link`}
          type="button"
          onClick={() => editChoiceCount(true, false)}>
          Add an option
        </button>
      )}
    </div>
  );

};

export default SurveyChoices;
