import { useContext, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { Advert, Button, Card, Category, Checkboxes, Error, Input, RadioButtons, Scale, Textarea } from '_atoms';
import { SurveyResponse, Tab } from '_molecules';
import { SpaceContext } from '_context';
import { useFetch, useTabs } from '_hooks';
import { delay, getEndpoint, getLabel } from '_utils';
import styles from './EmployeeSurvey.module.scss';

interface ISurveyUserAnswer {
  choiceId?: number;
  userAnswered: boolean;
}

interface ISurveyUserResponse {
  questionId: number;
  answer?: string | number;
  answers?: ISurveyUserAnswer[];
}

interface IProps {
  surveyId?: string | string[];
  surveyType: SurveyType;
}

const Modal = dynamic(import('./../../molecules/global/Modal'));

const dashboardUrl = '/dashboard';
const placeholder = 'Type a response';
const validate = `You haven't answered this question`;

// used to render a survey for an employee to complete. Handles any possible combination of questions for any survey type. A confirmation tab is shown after successful submit, which also has a breakdown of correct answers for learning surveys
const EmployeeSurvey = ({ surveyId, surveyType }: IProps) => {
  
  const router = useRouter();
  const { register, watch, errors, handleSubmit } = useForm({ mode: 'onSubmit' });
  const { wrapperRef, tabRefs, forward, activeTab, activateTab } = useTabs(2, 'form');
  const { env, error, errorMessage, fetchData, postData } = useFetch();
  const { space } = useContext(SpaceContext);
  const [survey, setSurvey] = useState<ISurvey | null>(null);
  const [answers, setAnswers] = useState<ISurveyResponse[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const isLearning = surveyType === 'Learning';

  // handle survey submission 
  const onSubmit = (submitted: any) => {

    if (survey) {

      // truen submitted object into array to allow easier logic & formatting
      const answers = Object.entries(submitted).map(([key, val]) => {

        const parsedKey = parseInt(key);
        const { questions } = survey;
        const answerType = questions.find(({ questionId }) => questionId === parsedKey)?.type;
        const isMulti = answerType === 1;
        const isCheck = answerType === 4;

        // construct object to return for each question
        const returnObj: ISurveyUserResponse = {
          questionId: parsedKey
        };
 
        if (isMulti || isCheck) {

          // for multiple choice or checkbox questions, we need to work out which choice(s) the user selected
          const questionChoices = questions.find(({ questionId }) => questionId === parsedKey)?.choices;
          // map through the choices to work out which ones were selected
          const formattedChoices = questionChoices?.map(({ choiceId, text }) => {

            let userAnswered = false;

            // for multiple choices, there's only one selected so we just need to match the option text to the value of the current item in the submitted data  
            if (isMulti) userAnswered = val === text;

            // for checkboxes there could be several selected so we need to directly query the submitted object in order to check other options outside of the current loop index
            if (isCheck) userAnswered = submitted[`${parsedKey}-${choiceId}`] === true;

            // return the current choice ID along with whether it was selected by the user
            return {
              choiceId,
              userAnswered
            };

          });

          // assign our formatted choice data to the master object to return to the parent function
          returnObj.answers = formattedChoices;

        }

        // for short & long text answers, we just need to set the answer to the submitted value string
        if ((answerType === 2 || answerType === 3) && typeof val === 'string') returnObj.answer = val;

        // for rating & emoji answers, we just need to set the answer to the parsed submitted value (1 to 5)
        if ((answerType === 5 || answerType === 6) && typeof val === 'string') returnObj.answer = parseInt(val);

        return returnObj;

      });

      const data = {
        // filter out unique questionId's - using Checkboxes returns an item for each option
        questions: answers.filter((e, i) => answers.findIndex(a => a['questionId'] === e['questionId']) === i)
      };

      // post our formatted survey data to the API
      postData(`/${getEndpoint(surveyType)}/complete/completed/${surveyId}`, data).then(response => {

        const { completed } = response;

        if (completed) {

          // if it's a learning survey, store the answers from the API response
          if (isLearning) setAnswers(completed.questions);

          // show the success tab
          activateTab('success', 1);

        }
  
      });

    }

  };

  // work out what message to show in the error modal (e.g. if an employee revists a completed survey page, or somehow visits the URL of a survey which doesn't exist yet)
  const getModalMessage = (): string => {

    let message = `This ${getLabel(surveyType, true)}`;

    if (survey) {

      const { status, hasAnswered } = survey;

      switch (true) {

        case hasAnswered:
          message = `You've already completed this ${getLabel(surveyType, true)}.`;
          break;

        case status === 'Draft':
          message += ` is a draft so can't be completed yet.`;
          break;

        case status === 'Ended':
          message += ` has ended so can't be completed any more.`;
          break;

        default:
          break;

      }

    }

    return message;

  };

  useEffect(() => {

    if (env) {

      // get the survey data via survey ID
      fetchData(`/${getEndpoint(surveyType)}/complete/questions/${surveyId}`).then(response => {

        if (response) {

          const { name, status, hasAnswered } = response;
  
          // store data locally
          if (name) setSurvey(response);
  
          // show the error modal if the survey isn't active or the user has already completed it
          if (status !== 'Active' || hasAnswered) delay(1000).then(() => setModalOpen(true));

        }

      });

      // for learning surveys, we have response rate metrics which are based on how many times surveys are opened without completion - so we need to call the API if we've visited a learning survey page
      if (isLearning) fetchData(`/${getEndpoint(surveyType)}/complete/opened/${surveyId}`);

    }

  }, [env]);

  return (
    <section className={`${styles.root} dashboard-grid inner`}>
      <Advert classes={styles.advert} />
      <div className={styles.survey}>
        {survey && (
          <Card heading={survey.name}
            loading={false}
            classes={styles.card}>
            <div ref={wrapperRef} 
              className={styles.wrapper}>
              <Tab wrapper={wrapperRef}
                tab={tabRefs.current[0]}
                hide={activeTab !== 'form'}
                forward={forward}
                first={true}>
                <article ref={tabRefs.current[0]} 
                  className="tab">
                  <form className="form form--survey"
                    onSubmit={handleSubmit(onSubmit)}>
                    <fieldset>
                      <header className="form--survey__header">
                        <legend className="h3">{ survey.name }</legend>
                        <p className="text--small">{ survey.description }</p>
                        {survey.isAnonymous && (
                          <Category anonymous={true}
                            classes={styles.anonymous} />
                        )}
                      </header>
                      {survey.questions && survey.questions.length && (
                        <>
                          {survey.questions.map((item, i) => {

                            const { questionId, type, choices, question } = item;
                            const heading = `Question ${i + 1}`;
                            const id = questionId?.toString();

                            const options = choices?.map(({ choiceId, text }: any) => ({
                              choiceId,
                              text,
                              value: text
                            }));

                            const scale = choices?.map(({ start, end }: any) => ({
                              start,
                              end
                            }));

                            return (
                              <div key={`${id}-${i}`}
                                className="form--survey__section">
                                {type === 1 && options && id && (
                                  <RadioButtons key={`${question}-${i}`}
                                    name={id}
                                    options={options}
                                    heading={heading}
                                    label={question}
                                    hasError={errors[id]}
                                    errorMsg={errors[id]?.message}
                                    customMsg={validate}
                                    register={register} 
                                    required={true} />
                                )}
                                {type === 2 && id && (
                                  <Input name={id}
                                    type="text"
                                    heading={heading}
                                    label={question}
                                    placeholder={placeholder}
                                    hasError={errors[id]}
                                    errorMsg={errors[id]?.message}
                                    customMsg={validate}
                                    register={register} 
                                    required={true} />
                                )}
                                {type === 3 && id && (
                                  <Textarea name={id}
                                    heading={heading}
                                    label={question}
                                    placeholder={placeholder}
                                    hasError={errors[id]}
                                    errorMsg={errors[id]?.message}
                                    customMsg={validate}
                                    register={register} 
                                    required={true} />
                                )}
                                {type === 4 && id && options && (
                                  <Checkboxes name={id}
                                    options={options}
                                    heading={heading}
                                    label={question}
                                    customMsg={validate}
                                    register={register} 
                                    required={true}
                                    watch={watch} />
                                )}
                                {type === 5 && id && scale && (
                                  <Scale name={id}
                                    heading={heading}
                                    label={question}
                                    type="normal"
                                    worst={scale[0]?.start}
                                    best={scale[1]?.end}
                                    hasError={errors[id]}
                                    errorMsg={errors[id]?.message}
                                    customMsg={validate}
                                    register={register} 
                                    required={true} />
                                )}
                                {type === 6 && id && (
                                  <Scale name={id}
                                    heading={heading}
                                    label={question}
                                    type="emoji"
                                    hasError={errors[id]}
                                    errorMsg={errors[id]?.message}
                                    customMsg={validate}
                                    register={register} 
                                    required={true} />
                                )}
                              </div>
                            );

                          })}
                        </>
                      )}
                    </fieldset>
                    <div className="form--survey__section">
                      <Button text="Send answers"
                        type="submit"
                        prominence="primary" />
                      <Error message={error === 401 ? `Sorry, we were unable to submit your response(s). Are you sure you're a recipient of this ${ getLabel(surveyType, true) }${isLearning ? ' survey' : '' }?` : `${errorMessage} (${error})`}
                        expanded={!!error} />
                    </div>
                  </form>
                </article>
              </Tab>
              <Tab wrapper={wrapperRef} 
                tab={tabRefs.current[1]} 
                hide={activeTab !== 'success'} 
                forward={forward}>
                <div ref={tabRefs.current[1]} 
                  className="tab">
                  <article className={`success${isLearning ? ' success--slimline' : ''}`}>
                    <h2>Thank you</h2>
                    <p className="text--medium">Your {isLearning ? 'response has' : 'answers have'} been submitted</p>
                    <Button target="/dashboard"
                      prominence="primary"
                      text="Go to your dashboard" />
                  </article>
                  {isLearning && answers?.length && (
                    <div className="success__answers">
                      <h3 className="h4">Let's see how you did</h3>
                      {answers.map((response, i) => (
                        <SurveyResponse key={`${response.question.split(' ')[0]}-${i}`}
                          response={response} />
                      ))}
                    </div>
                  )}
                </div>
              </Tab>
            </div>
          </Card>
        )}
        <Modal launch={modalOpen}
          classes="modal"
          emitClose={() => router.push(dashboardUrl)}>
          <h2 className="h4">Hi { space.user.firstName }</h2>
          <p className="text--small">{ getModalMessage() } Please return to your <Link href={dashboardUrl}><a className="widget-link">dashboard</a></Link> to see active or outstanding { getLabel(surveyType, true) }{ isLearning ? ' survey' : '' }s</p>
        </Modal>
      </div>
    </section>
  );

};

export default EmployeeSurvey;
