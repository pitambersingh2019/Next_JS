import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Swiper, SwiperSlide } from 'swiper/react';
import { AverageScore, Button, Card, Category, Error, NotFound, Scale } from '_atoms';
import TabbedForm from './../global/TabbedForm';
import { Pagination } from '_navigation';
import { useFetch, useSlider } from '_hooks';
import { getRoute } from '_utils';
import styles from './PromptWidget.module.scss';

interface IPromptSurvey {
  id: number;
  surveyId: number;
  questionId: number;
  name: string;
  isAnonymous: boolean;
  type?: 'rating' | 'emoji' | 'prompt';
  title: string;
  topicName?: string;
  category: string;
  createdOn?: Date;
  worst?: string;
  best?: string;
  date?: Date;
}

interface IProps {
  classes?: string;
  widgetType: 'learning' | 'happiness';
}

interface IPrompt {
  item: IPromptSurvey;
}

// used for surveys of more than one question, displaying the title & a button to link to the survey completion page
const Prompt = ({ item }: IPrompt) => {

  const { id, name, topicName, createdOn, isAnonymous } = item;
  
  return (
    <div className={styles.slide}>
      <h4>{ name }</h4>
      <Category anonymous={isAnonymous}
        category={topicName}
        date={createdOn} />
      <Button target={`/dashboard/learning/${id}`}
        text="Complete learning"
        classes={styles.button} />
    </div>
  );

};

// used for single question surveys to allow the employee to answer directly in the dashboard (if the question type allows)
const Survey = ({ item }: IPrompt) => {

  const { type } = item;
  
  return (
    <div className={styles.slide}>
      {(type === 'rating' || type === 'emoji') && <HappinessScale item={item} />}
      {type === 'prompt' && <HappinessPrompt item={item} />}
    </div>
  );

};

// used to render the five options for a single question survey where the question type is emoji or rating
const HappinessScale = ({ item }: IPrompt) => {

  const { register, watch, errors } = useForm({ mode: 'onSubmit' });
  const { error, errorMessage, submitted, setSubmitted, postData } = useFetch();
  const { surveyId, questionId, title, type, isAnonymous, category, date, worst, best } = item;
  const stringId = questionId.toString();
  const value = watch(stringId);
  const isEmoji = type === 'emoji';
  
  useEffect(() => {
  
    // if we have a selected value, format it & post to the API
    if (value) {
  
      const data = {
        questions: [
          {
            questionId,
            answer: parseInt(value)
          }
        ]
      };
  
      postData(`/${getRoute(category)}/complete/completed/${surveyId}`, data).then(response => {
  
        if (response?.completed) setSubmitted(true);
    
      });
  
    }
  
  }, [value]);
  
  return (
    <TabbedForm success={submitted}
      info="Your choice has been submitted!">
      <h3 className={`${styles.question} h4`}>{ title }</h3>
      <form className={styles.form}>
        <fieldset>
          <Scale name={stringId}
            heading={`Your voice ${isEmoji ? 'emoji' : 'scale'} question`}
            label={title}
            type={isEmoji ? 'emoji' : 'normal'}
            worst={worst}
            best={best}
            hasError={errors[stringId]}
            errorMsg={errors[stringId]?.message}
            customMsg={`Please choose an ${isEmoji ? 'emoji' : 'option on the scale'}`}
            register={register} 
            required={true} />
        </fieldset>
        <Error message={`${errorMessage} (${error})`}
          expanded={!!error} />
      </form>
      <Category anonymous={isAnonymous}
        category={category}
        date={date}
        classes={styles.category} />
    </TabbedForm>  
  );

};

// used to render a prompt & link to survey completion page 
const HappinessPrompt = ({ item }: IPrompt) => {

  const { surveyId, isAnonymous, title, category, date } = item;
  
  return (
    category ? (
      <>
        <h3 className="h4">{ title }</h3>
        <Category anonymous={isAnonymous}
          category={category}
          date={date} />
        <Button target={`/dashboard/${getRoute(category)}/${surveyId}`}
          text="Take part"
          classes={styles.button} />
      </>
    ) : null
  );

};

// used by the first two widgets in the employee dashboard, code was combined as there was a lot of similarity 
const PromptWidget = ({ classes, widgetType }: IProps) => {

  const [average, setAverage] = useState<number | null>(null);
  const { env, error, fetchData } = useFetch();
  const [surveys, setActiveSurveys] = useState<IPromptSurvey[] | null>(null);
  const { slider, activeSlide, atStart, atEnd, setSlider, setAtStart, setAtEnd, handleSlideChange } = useSlider();
  const isHappiness = widgetType === 'happiness';
  const isLearning = widgetType === 'learning';
  
  useEffect(() => {
  
    // fetch data from the API, using different endpoint depending on whether it's the learning widget or the happiness widget
    if (env && isLearning) {
  
      fetchData(`/training/widget`).then(response => {

        if (response) {
    
          const { averageScore, surveys } = response;

          if (typeof averageScore === 'number') setAverage(averageScore);

          if (surveys) setActiveSurveys(surveys);
    
        }
    
      });
  
    } else if (env && isHappiness) {

      fetchData(`/survey/voice`).then(response => {

        if (response?.surveys) setActiveSurveys(response.surveys);
    
      });

    }
  
  }, [env]);
  
  return (
    <Card heading={isHappiness? 'Your voice counts' : 'Learning'}
      icon={widgetType}
      loading={!surveys}
      error={!!error}
      classes={`${styles.root} ${styles[widgetType]}${surveys?.length === 1 ? ' ' + styles.single : ''}${classes ? ' ' + classes : ''}`}>
      {surveys ? (
        <>
          {isLearning && typeof average === 'number' && average >= 0 && (
            <AverageScore number={average}
              visible="Knowledge score"
              hidden="This is your average learning survey score over the past year"
              classes={styles.score} />
          )} 
          {surveys.length === 0 ? (
            <p className="nothing">You don’t have any new {isLearning && 'training'}{isHappiness && 'happiness'} questions</p>
          ) : (
            <>
              {surveys.length > 1 && (
                <Pagination slider={slider}
                  length={surveys.length}
                  active={activeSlide}
                  atStart={atStart}
                  atEnd={atEnd}
                  classes={styles.pagination} />
              )}
              {surveys.length === 1 ? (
                isHappiness ? <Survey item={surveys[0]} /> : <Prompt item={surveys[0]} />
              ) : (
                <div className={styles.slider}>
                  <Swiper onInit={(slider) => setSlider(slider)}
                    onSlideChange={(slider) => handleSlideChange(slider)}
                    onReachBeginning={() => setAtStart(true)}
                    onReachEnd={() => setAtEnd(true)}>
                    {surveys.map((slide, i) => (
                      <SwiperSlide key={`slide-${i}`}>
                        {isHappiness ? <Survey item={slide} /> : <Prompt item={slide} />}
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              )}
            </>
          )}
        </>
      ) : (
        <NotFound />
      )}
    </Card>
  );

};
  
export default PromptWidget;
