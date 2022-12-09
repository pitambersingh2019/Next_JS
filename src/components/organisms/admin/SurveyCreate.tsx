import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { Button, Error, Input, Select, Textarea, Toggle } from '_atoms';
import { Expander, PublishedSurvey, SelectRecipients, SurveyQuestion, Tab } from '_molecules';
import { useFetch, useRefresh, useTabs, useWindow } from '_hooks';
import { delay, getEndpoint, getLabel, getRoute } from '_utils';
import styles from './SurveyCreate.module.scss';

interface ITrackedQuestion extends IQuestion {
  valid?: boolean;
  removed?: boolean;
}

interface IProps {
  surveyId?: string | string[];
  surveyType: SurveyType;
  answerTypes: SurveyAnswerType[];
}

const selectTopic = 'Choose a topic';
const defaultTopic = { text: selectTopic, value: '' };

// used to handle the entire survey creation functionality; handles new & draft (identified with surveyId prop) surveys for all three survey types
const SurveyCreate = ({ surveyId, surveyType, answerTypes }: IProps) => {

  const router = useRouter();
  const { draft, scroll } = router.query;
  const { register, errors, watch, handleSubmit, formState: { submitCount } } = useForm({ mode: 'onSubmit' });
  const { env, error, errorMessage, setSubmitted, fetchData, postData } = useFetch();
  const { wrapperRef, tabRefs, forward, activeTab, activateTab } = useTabs(2, 'questions');
  const { refresh, bumpRefresh } = useRefresh();
  const { hasWindow } = useWindow();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [draftSurvey, setDraftSurvey] = useState<ISurvey | null>(null);
  const [editTitle, setEditTitle] = useState<boolean>(!!surveyId);
  const [editDescription, setEditDescription] = useState<boolean>(!!surveyId);
  const [companyValues, setCompanyValues] = useState<ICompanyValue[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [topics, setTopics] = useState<ITopic[]>([]);
  const [topicOptions, setTopicOptions] = useState<IOption[]>([defaultTopic]);
  const [questions, setQuestions] = useState<ITrackedQuestion[]>([]);
  const [questionCount, setQuestionCount] = useState<number>(0);
  const [trigger, setTrigger] = useState<number>(0);
  const [isValid, setIsValid] = useState<boolean>(false);
  const [recipients, setRecipients] = useState<number[]>([]);
  const [sentToAll, setSentToAll] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [draftSaved, setDraftSaved] = useState<boolean>(false);
  const isHappiness = surveyType === 'Happiness';
  const isLearning = surveyType === 'Learning';
  const isSurvey = surveyType === 'Surveys';
  const name = watch('name');
  const surveyDescription = watch('description');

  const introLabel = isSurvey 
    ? 'Create surveys to gain insight from your employees, surveys enable you to receive open ended answers'
    : 'Create happiness trackers to gain measurable insight from your employees';

  const defaultQuestion: ITrackedQuestion = {
    questionId: 0,
    question: '',
    type: answerTypes[0],
    valid: false,
    removed: false
  };  
  
  // store the selected recipients & whether the survey was sent globally (to all employees )
  const handleRecipients = (recipients: number[], isGlobal: boolean): void => {

    setRecipients(recipients);
    setSentToAll(isGlobal);

  };

  // called when survey data is successfully stored 
  const handleSave = (savedSurveyId: number, start: boolean, reload = false) => {

    setIsDisabled(false);

    if (start) {

      // the survey was published live (not a draft), so we take the user to the survey results page 
      router.push(`/admin/${getRoute(surveyType)}/${savedSurveyId}`);

    } else {

      // the survey was published as a draft (not live), so we either need to reload the page to contain the survey ID & then anchor the user back down to where they were - or just store this locally to show the confirmation message 
      reload 
        ? router.push(`/admin/${getRoute(surveyType)}/create/${savedSurveyId}?draft=true${hasWindow ? '&scroll=' + window.scrollY : ''}`)
        : setDraftSaved(true);

    }

  };

  // handle submit of form (either to publish live or save as draft)
  const onSubmit = (submitted: ISurveyBase, start = true) => {

    setSubmitted(true);

    // disable submit buttons to avoid multiple clicking & therefore API calls 
    if (!start) setIsDisabled(true);

    const formatted = questions.filter(question => !question.removed).map(({ valid, removed, ...keep }) => keep); // eslint-disable-line

    // format data for API 
    const data = {
      ...submitted,
      start,
      questions: formatted,
      recipients,
      sentToAll,
      createdByProsperEx: draftSurvey?.createdByProsperEx
    };

    // either add the selected topic to the data or remove the prop from the object (BE was mangled so we had to handle this in the FE) 
    isLearning && selectedTopic !== ''
      ? data.topicId = selectedTopic
      : delete data.topicId;

    if (surveyId) {

      // if we have an ID already the survey exists so we need to call the edit endpoint to overwrite the data 
      postData(`/${getEndpoint(surveyType)}/edit/${surveyId}`, data).then(response => {

        const editedSurveyId = response?.edited?.id;
  
        // handle successful API response  
        if (editedSurveyId) handleSave(editedSurveyId, start);
  
      });

    } else {

      // otherwise we need to call the add endpoint to create a new survey entry  
      postData(`/${getEndpoint(surveyType)}/add`, data).then(response => {

        const newSurveyId = response?.added?.id;
  
        // handle successful API response  
        if (newSurveyId) handleSave(newSurveyId, start, true);
  
      });

    }

  };

  // bump the number of question so that our below effect hook adds a new question to the array 
  const addQuestion = () => setQuestionCount(questionCount + 1);

  // this is called whenever a question changes, handling the three scenarios of validated, invalidated or removed 
  const handleQuestionUpdate = (i: number, valid: boolean, removed: boolean, question: IQuestion | null) => {

    // make a copy of the current questions array
    const updated: ITrackedQuestion[] = questions;

    // this is when the question is validated, so we want to overwrite the existing question at the target index 
    if (question) updated[i] = question;

    // updated the valid prop for the existing question at the target index 
    updated[i].valid = valid;
    // updated the removed prop for the existing question at the target index 
    updated[i].removed = removed;

    // overwrite the questions array with our updated & formatted data 
    setQuestions(updated);
    // bump the trigger value in order to potentially enable buttons or hide confirmation messages 
    setTrigger(trigger + 1);

  };

  // fetch the company values from the API, which are optionally applied to each question for happiness surveys. Ideally would've done this in the SurveyQuestion component but that would've a new API call for every question
  const getCompanyValues = () => {

    fetchData('/company-values/all').then(response => {
  
      if (response?.length) setCompanyValues(response);

    });

  };

  // fetch the learning topics from the API, which are optionally applied to each survey for learning surveys
  const getLearningTopics = () => {

    fetchData('/training-topics/all').then(response => {

      if (response?.length) setTopics(response);

    });

  };

  useEffect(() => {

    // this gets triggered when a user tries to submit the form, and haven't entered a survey title or description
    if (submitCount > 0) {

      // wait for the browser to scroll back to the top, then expand the text input animations
      delay(210).then(() => {

        setEditTitle(true);
        setEditDescription(true);

      });

    }

  }, [submitCount]);

  useEffect(() => {

    // the user has clicked the add question button, so we want to add a new blank question to the array. This is mapped in the JSX so will automatically animate into the UI
    setQuestions([...questions, defaultQuestion]);

  }, [questionCount]);

  useEffect(() => {

    // when the questions array changes, or we want to manually trigger button validation
    const existingQuestions = questions.filter(({ removed }) => removed === false).length;
    const validQuestions = questions.filter(({ valid }) => valid === true).length;
    const isValidSurvey = existingQuestions > 0 && validQuestions > 0 && existingQuestions === validQuestions;

    // if the survey is valid we can enable the submit button 
    setIsValid(isValidSurvey);

  }, [questions, trigger]);

  useEffect(() => {

    // this handles the scenario where the survey was published as a draft for the first time, which causes a page reload & then anchors the user back to the scroll position they were at so they can see the confirmation message
    if (draft === 'true') {

      // wait for all element to load & animate in
      delay(500).then(() => {

        // show confirmation message 
        setDraftSaved(true);
        // replace the current URL to get rid of the query string (which isn't needed any more)
        router.replace(`/admin/${getRoute(surveyType)}/create/${surveyId}`);

        // if we're in the browser environment, scroll the user back to where they were when they clicked save
        if (typeof scroll === 'string' && hasWindow) delay(500).then(() => window.scrollTo({ top: parseInt(scroll), left: 0, behavior: 'smooth' }));

      });
  
    }

  }, [questions]);

  useEffect(() => {

    // if there is a draft saved confirmation message visible, we want to then hide it whenever the user interacts with the form again 
    if (draftSaved) setDraftSaved(false);

  }, [activeTab, name, surveyDescription, isAnonymous, questions, trigger, selectedTopic, recipients]);

  useEffect(() => {

    // if we have learning topics, format the options for the dropdown
    if (topics.length) {

      const mapped: IOption[] = topics.map(({ id, name }) => ({
        text: name,
        value: id.toString()
      }));

      setTopicOptions([defaultTopic, ...mapped]);

    }

  }, [topics]);

  useEffect(() => {

    if (env) {

      // happiness surveys have company values, so fetch these from the API
      if (isHappiness) getCompanyValues();

      // learning surveys have learning topics, so fetch these from the API
      if (isLearning) getLearningTopics();

      // if the draft of the survey exists, fetch the current data from the API to be prefilled in the form fields 
      if (surveyId) {

        fetchData(`/${getEndpoint(surveyType)}/get/${surveyId}`).then(response => {

          if (response?.name && response?.description) {

            const { questions, topicId, status, isAnonymous } = response;

            setDraftSurvey(response);
            setQuestions(questions);
            setIsAnonymous(isAnonymous);
            setIsLoading(false);

            if (topicId) setSelectedTopic(topicId);

            if (status !== 'Draft') delay(1000).then(() => setModalOpen(true));

            bumpRefresh();

          }
  
        });

      } else {

        setIsLoading(false);

      }

    }

  }, [env]);

  return (
    <section className={`${styles.root} dashboard-single card spinner${isLoading ? ' spinning' : ''}`}>
      {!isLearning && <p className="text--small">{ introLabel }</p>}
      <form className="form form--standard"
        onSubmit={(e) => {

          e.preventDefault();
          handleSubmit((data: ISurveyBase) => onSubmit(data, true))();

        }}>
        <fieldset>
          <div className="form__grid">
            <legend>Learning information</legend>
            <article>
              <Expander expanded={!editTitle}>
                <h1 className="h4">
                  <button className="widget-link"
                    type="button"
                    onClick={() => setEditTitle(true)}>
                    Untitled { getLabel(surveyType, true) }
                  </button>
                </h1>
              </Expander>
              <Expander expanded={editTitle}>
                <Input name="name"
                  label={`${getLabel(surveyType)} title`} 
                  type="text"
                  autocomplete={'off'}
                  prefill={draftSurvey?.name}
                  hasError={errors.name}
                  errorMsg={errors.name?.message}
                  register={register} 
                  required={true} />
              </Expander>
            </article>
            <article>
              <Expander expanded={!editDescription}>
                <h2 className="text--small">
                  <button className="widget-link"
                    type="button"
                    onClick={() => setEditDescription(true)}>
                    Edit { getLabel(surveyType, true) } description
                  </button>
                </h2>
              </Expander>
              <Expander expanded={editDescription}>
                <Textarea name="description"
                  label={`${getLabel(surveyType)} description`} 
                  prefill={draftSurvey?.description}
                  hasError={errors.description}
                  errorMsg={errors.description?.message}
                  register={register} 
                  required={true} />
              </Expander>
            </article>
            {!isLearning && (
              <article>
                <Toggle name="isAnonymous"
                  text="Make all responses anonymous"
                  hasError={errors.isAnonymous}
                  register={register}
                  preselect={isAnonymous} />
              </article>
            )}
          </div>
        </fieldset>
        <article ref={wrapperRef} 
          className={styles.wrapper}>
          <Tab wrapper={wrapperRef}
            tab={tabRefs.current[0]}
            hide={activeTab !== 'questions'}
            forward={forward}
            first={true}>
            <div ref={tabRefs.current[0]} 
              className="tab">
              {isLearning && (
                <fieldset className={styles.topics}>
                  <legend>Select topic</legend>
                  <Select name="topicId"
                    label="Topic (optional)"
                    selected={topicOptions.find(({ value }) => value === draftSurvey?.topicId)?.value || selectTopic}
                    showDisabled={false}
                    tooltip="Topics can help to filter or categorise learning surveys"
                    options={topicOptions}
                    hasError={errors.topicId}
                    register={register}
                    emitChange={(value) => setSelectedTopic(value)} />
                </fieldset>
              )}
              <fieldset>
                <legend>Add questions</legend>
                <div key={refresh}
                  className={`${styles.body} ${styles.questions}`}>
                  {questions.map((item, i) => (
                    <SurveyQuestion key={`${item.questionId}-${i}`}
                      item={item}
                      index={i}
                      total={questions.length - questions.filter(({ removed }) => removed === true).length}
                      answerTypes={answerTypes}
                      omitCorrect={!isLearning}
                      defaultChoices={isHappiness ? 5 : 2}
                      surveyType={surveyType}
                      companyValues={companyValues}
                      emitInvalid={(i) => handleQuestionUpdate(i, false, false, null)}
                      emitRemove={(i) => handleQuestionUpdate(i, false, true, null)}
                      emitValid={(question, i) => handleQuestionUpdate(i, true, false, question)} />
                  ))}
                </div>
              </fieldset>
              <div className={styles.add}>
                <button className="widget-link"
                  type="button"
                  onClick={addQuestion}>
                  Add a question
                </button>
              </div>
              <div className={`${styles.actions} actions`}>
                <Button text="Choose recipients"
                  prominence="primary"
                  classes={isValid ? '' : 'disabled disabled--block'}
                  disabled={!isValid}
                  emitClick={() => activateTab('recipients', 1)} />
                <Button text="Save draft"
                  classes={isDisabled ? styles.disabled : undefined}
                  disabled={isDisabled}
                  emitClick={() => handleSubmit((data: ISurveyBase) => onSubmit(data, false))()} />
              </div>
              <Expander expanded={draftSaved}>
                <small className={styles.saved}>Draft saved!</small>
              </Expander>
            </div>
          </Tab>
          <Tab wrapper={wrapperRef}
            tab={tabRefs.current[1]}
            hide={activeTab !== 'recipients'}
            forward={forward}>
            <div ref={tabRefs.current[1]} 
              className="tab">
              <div className={styles.return}>
                <button className="widget-link"
                  type="button"
                  onClick={() => activateTab('questions', 0)}>
                  Back to questions
                </button>
              </div>
              <fieldset>
                <legend>Add recipients</legend>
                <SelectRecipients classes={`${styles.body} ${styles.recipients}`} 
                  draftSurvey={draftSurvey || undefined}
                  filterInactive={false}
                  emitComplete={(recipients, isGlobal) => handleRecipients(recipients, isGlobal)} />
              </fieldset>
              <div className={`${styles.actions} actions`}>
                <Button text="Send survey"
                  type="submit"
                  classes={recipients.length === 0 ? styles.disabled : ''}
                  disabled={recipients.length === 0}
                  prominence="primary" />
                <Button text="Save draft"
                  classes={isDisabled ? styles.disabled : undefined}
                  disabled={isDisabled}
                  emitClick={() => handleSubmit((data: ISurveyBase) => onSubmit(data, false))()} />
              </div>
              <Expander expanded={draftSaved}>
                <small className={styles.saved}>Draft saved!</small>
              </Expander>
            </div>
          </Tab>
        </article>
        <Error message={`${errorMessage} (${error})`}
          expanded={!!error} />
      </form>
      <PublishedSurvey launch={modalOpen}
        surveyId={surveyId}
        surveyStatus={draftSurvey?.status}
        surveyType={surveyType} />
    </section>
  );

};

export default SurveyCreate;
