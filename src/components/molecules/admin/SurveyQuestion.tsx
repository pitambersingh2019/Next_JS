import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input, Select } from '_atoms';
import Expander from './../global/Expander';
import SurveyChoices from './SurveyChoices';
import { Bin } from '_vectors';
import { delay } from '_utils';
import styles from './SurveyQuestion.module.scss';

interface IProps {
  item: IQuestion;
  index: number;
  total: number;
  omitCorrect: boolean;
  defaultChoices: number;
  surveyType: SurveyType;
  answerTypes: SurveyAnswerType[];
  companyValues: ICompanyValue[];
  emitInvalid: (i: number) => void;
  emitRemove: (i: number) => void;
  emitValid: (question: IQuestion, i: number) => void;
}

interface IAnswerTypeOption {
  text: string;
  value: SurveyAnswerType;
}

// array of options for the question type dropdown
const answerTypeOptions: IAnswerTypeOption[] = [
  {
    text: 'Multiple choice',
    value: 1
  },
  {
    text: 'Short text answer',
    value: 2
  },
  {
    text: 'Long text answer',
    value: 3
  },
  {
    text: 'Check boxes',
    value: 4
  },
  {
    text: 'Rating scale',
    value: 5
  },
  {
    text: 'Emoji scale',
    value: 6
  }
];

// default company value option (used in happiness surveys)
const defaultCompanyValue= { text: 'Choose a value', value: '' };

// used in survey creation to render each individual question 
const SurveyQuestion = ({ item, index, total, omitCorrect, defaultChoices, surveyType, answerTypes, companyValues, emitInvalid, emitRemove, emitValid }: IProps) => {

  const { register, errors, watch } = useForm({ mode: 'onBlur' });
  const { questionId, question, type, choices, companyValueId } = item;
  const [shown, setShown] = useState<boolean>(false);
  const [destroyed, setDestroyed] = useState<boolean>(false);
  const [canRemove, setCanRemove] = useState<boolean>(index === 0 || total > 1);
  const [answerType, setAnswerType] = useState<SurveyAnswerType>(type);
  const [companyValueOptions, setCompanyValueOptions] = useState<IOption[]>([defaultCompanyValue]);
  const [selectedCompanyValue, setSelectedCompanyValue] = useState<string | null>(companyValueId ?? null);
  const [completedChoices, setCompletedChoices] = useState<ISurveyChoice[] | null>(null);
  const questionVal = watch('question', '');
  const isMulti = answerType === 1;
  const isCheck = answerType === 4;
  const isRating = answerType === 5;

  // different survey types have different permitted question type (e.g. learning surveys only have multiple choice; happiness surveys have multiple choice, rating & emoji; standard surveys have all six). This creates an array of permitted options for the dropdown 
  const options = answerTypeOptions.filter(({ value }) => answerTypes.includes(value)).map(({ text, value }) => ({
    text,
    value: value.toString()
  }));

  // used to emit either question data to the parent component (SurveyCreate), or the index if the question isn't valid
  const handleEmit = (valid: boolean) => {

    // only emit for active question that haven't been removed
    if (!destroyed) {

      // if the question is valid we want to emit the whole completed question object, otherwise just an index
      if (valid) {

        // create question data object
        const data: IQuestion = {
          questionId,
          question: questionVal,
          type: answerType,
          companyValueId: selectedCompanyValue
        };
  
        // if we have choices to store, add them to the data object
        if (completedChoices) data.choices = completedChoices;
  
        // emit the object along with the index
        emitValid(data, index);
  
      } else {
  
        // emit the index 
        emitInvalid(index);
  
      }

    }

  };

  const handleRemove = (i: number) => {

    // tell the parent component that the question has been removed
    emitRemove(i);
    // animate question out
    setShown(false);

    // keep track of state locally
    delay(300).then(() => setDestroyed(true));

  };

  useEffect(() => {

    // happiness surveys allow an optional company value to be assigned to each question. Here we create an array of options for the dropdown
    const companyValueMapped = companyValues.map(({ id, name }) => ({
      text: name,
      value: id
    }));

    // store array locally
    setCompanyValueOptions([defaultCompanyValue, ...companyValueMapped]);
  
  }, [companyValues]);

  useEffect(() => {

    // there must be at least one question per survey, so here we decide whether to should show the remove button 
    delay(300).then(() => total > 1 ? setCanRemove(true) : setCanRemove(false));

  }, [total]);

  useEffect(() => {

    const isValidQuestionText = questionVal?.length > 0;

    // here we subscribe to all changes in the question (as well as choices if there are any) & emit to the parent component (SurveyCreate) so it's always up to date. 
    if (isMulti || isCheck || isRating) {

      // validate all choice text as well as question text
      (isValidQuestionText && !!completedChoices)
        ? handleEmit(true)
        : handleEmit(false);

    } else {

      // just validate question text
      isValidQuestionText
        ? handleEmit(true)
        : handleEmit(false);

    }

  }, [questionVal, answerType, completedChoices, selectedCompanyValue]);

  useEffect(() => {

    // on load, store answer type
    setAnswerType(type);
    // then animate question in
    setShown(true);

  }, []);

  return (
    !destroyed ? (
      <Expander expanded={shown}>
        <div className={`${styles.root}${canRemove ? ' ' + styles.removal : ''}`}>
          <Input name="question" 
            label="Question" 
            type="text" 
            autocomplete={'off'}
            prefill={question} 
            hasError={errors.question} 
            errorMsg={errors.question?.message} 
            register={register} 
            required={true} />
          {canRemove && (
            <button className={styles.remove}
              type="button"
              aria-label="Remove"
              onClick={() => handleRemove(index)}>
              <Bin />
            </button>
          )}
          <Select name="type"
            label="Answer type"
            showDisabled={false}
            selected={type ? type.toString() : undefined}
            options={options}
            disabled={options.length < 2}
            hasError={errors.type}
            register={register}
            emitChange={(value) => setAnswerType(typeof value === 'string' ? parseInt(value) : value)} />
          <SurveyChoices key="multi" 
            active={isMulti}
            questionType="multi"
            omitCorrect={omitCorrect}
            defaultChoices={defaultChoices}
            surveyType={surveyType}
            options={isMulti && choices?.length ? choices : []}
            emitComplete={(data) => setCompletedChoices(data)}
            emitIncomplete={() => setCompletedChoices(null)} />
          <SurveyChoices key="check"
            active={isCheck}
            questionType="check"
            defaultChoices={defaultChoices}
            surveyType={surveyType}
            options={isCheck && choices?.length ? choices : []}
            emitComplete={(data) => setCompletedChoices(data)}
            emitIncomplete={() => setCompletedChoices(null)} />
          <SurveyChoices key="rating"
            active={isRating}
            questionType="rating"
            label="Number labels"
            defaultChoices={defaultChoices}
            surveyType={surveyType}
            options={isRating && choices?.length ? choices : []}
            emitComplete={(data) => setCompletedChoices(data)}
            emitIncomplete={() => setCompletedChoices(null)} />
          {surveyType === 'Happiness' && (
            <Select name="type"
              label="Company value (optional)"
              showDisabled={false}
              tooltip="Company values can help to filter or categorise happiness surveys"
              selected={companyValueId ? companyValueId : undefined}
              options={companyValueOptions}
              disabled={companyValues.length < 1}
              hasError={errors.type}
              register={register}
              emitChange={(value) => setSelectedCompanyValue(value)} />
          )}
        </div>
      </Expander>
    ) : null
  );

};

export default SurveyQuestion;
