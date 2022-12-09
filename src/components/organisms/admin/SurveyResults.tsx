import { Fragment, useContext, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { SurveyIndividual, SurveyResend, SurveyRespondees, SurveyResponse, SurveyStats, Tab } from '_molecules';
import { SpaceContext } from '_context';
import { useFetch, useRefresh, useTabs } from '_hooks';
import { delay, getEndpoint, getLabel, getRoute, sortStrings, sortUsers } from '_utils';
import styles from './SurveyResults.module.scss';

interface IProps {
  surveyId?: string | string[];
  surveyType: SurveyType;
}

const Modal = dynamic(import('./../../molecules/global/Modal'));

// used to render the results screen for an individual survey (all three types). There's a header which shows some general stats about the survey & some buttons to launch modals with a breakdown of who's responded & the option to resend the survey to employees who weren't an original recipient. There's also a tabbed section which shows the overall survey answers on one tab & individual answers on the other (this has the option to be deep linked into via query string). This second tab is disabled on anonymouse surveys or for those without any responses yet
const SurveyResults = ({ surveyId, surveyType }: IProps) => {

  const router = useRouter();
  const { query } = router;
  const deepLinkMember = query.member;
  const { env, error, fetchData } = useFetch();
  const { wrapperRef, tabRefs, forward, activeTab, activateTab } = useTabs(2, 'summary');
  const { refresh, bumpRefresh } = useRefresh();
  const { space } = useContext(SpaceContext);
  const [survey, setSurvey] = useState<ISurveyResults | null>(null);
  const [responses, setResponses] = useState<ISurveyResponse[]>([]);
  const [unsentMembers, setUnsentMembers] = useState<IUserResend[]>([]);
  const [errorModalOpen, setErrorModalOpen] = useState<boolean>(false);
  const [resendModalOpen, setResendModalOpen] = useState<boolean>(false);
  const [respondeesModalOpen, setRespondeesModalOpen] = useState<boolean>(false);
  const [isAnonymous, setAnonymous] = useState<boolean>(false);
  const isLearning = surveyType === 'Learning';
  const noneResponded = survey?.haveResponded.length === 0;
  const dashboardUrl = `/admin/${getRoute(surveyType)}`;

  // launch the print window dialog 
  const printResults = () => window?.print();

  // hide the resend modal, then wait for the animation to play before manually refreshing the content for next time
  const handleResend = () => {
    
    setResendModalOpen(false);
    delay(300).then(() => bumpRefresh());

  };

  useEffect(() => {

    // fetch the aurvey results 
    if (env) {

      fetchData(`/${getEndpoint(surveyType)}/results/${surveyId}`).then(response => {

        // if the survey doesn't exist, show the error modal - otherwise format & sort the response before storing locally 
        if (response === 404) {

          delay(500).then(() => setErrorModalOpen(true));

        } else {

          const { responses, isAnonymous } = response;

          if (responses) {

            const { haveResponded, notResponded } = response;

            const sortedResponse = {
              ...response,
              haveResponded: sortStrings(haveResponded),
              notResponded: sortStrings(notResponded)
            };
  
            setSurvey(sortedResponse);
            setResponses(responses);
  
          }

          setAnonymous(isAnonymous);

          // deep link into individual tab if the query string exists
          if (deepLinkMember && deepLinkMember.length && !isAnonymous) activateTab('individual', 1);

        }

        // check if there are any employees who weren't sent the survey originally. If so, we show the button to launch the resend modal 
        fetchData(`/${getEndpoint(surveyType)}/results/resend/${surveyId}`).then(response => {

          response?.members?.length > 0
            ? setUnsentMembers(sortUsers(response.members))
            : setUnsentMembers([]);
    
        });

      });

    }

  }, [env, refresh]);

  return (
    <>
      <section className={`${styles.root} dashboard-single card card--table spinner${!survey && (!error || error === 404) ? ' spinning' : ''}`}>
        <header className={styles.header}>
          <h1 className="h4">{ survey?.name }</h1>
          <p>{ survey?.description }</p>
          <div className="card__tasks">
            <button className="widget-link text--small"
              onClick={printResults}>
              Print
            </button>
          </div>
        </header>
        {survey && (
          <SurveyStats survey={survey}
            surveyType={surveyType}
            hasUnsentMembers={unsentMembers.length > 0}
            emitOpenResend={() => setResendModalOpen(true)}
            emitOpenRespondees={() => setRespondeesModalOpen(true)} />
        )}
        <nav className={`${styles.tabs} padded`}>
          <ul>
            <li>
              <button className={`${styles.tab}${activeTab === 'summary' ? ' ' + styles.active : ''} text--small`}
                onClick={() => activateTab('summary', 0)}>
                Summary
              </button>
            </li>
            {(surveyType === 'Learning' || !isAnonymous ) && (
              <li>
                <button className={`${styles.tab}${activeTab === 'individual' ? ' ' + styles.active : ''}${noneResponded ? 'disabled--text' : ''} text--small`}
                  disabled={noneResponded}
                  onClick={() => activateTab('individual', 1)}>
                  Individual responses 
                </button>
              </li>
            )}
          </ul>
        </nav>
        <div ref={wrapperRef} 
          className={styles.wrapper}>
          <Tab wrapper={wrapperRef}
            tab={tabRefs.current[0]}
            hide={activeTab !== 'summary'}
            forward={forward}
            first={true}>
            <div ref={tabRefs.current[0]} 
              className={`${styles.summary} tab`}>
              {responses.map((response, i) => {

                const { question, type, incorrect } = response;
                const gapInKnowledge = incorrect && survey && ((incorrect.length / survey.haveResponded.length) > 0.75);

                return (
                  <SurveyResponse key={`${question.split(' ')[0]}-${i}`}
                    response={response}
                    noneResponded={noneResponded}
                    isSummary={true}
                    classes={styles.response}>
                    {type === 1 && surveyType === 'Learning' && !noneResponded && (
                      <div className={`${styles.incorrect}${incorrect?.length === 0 ? ' ' + styles.hidden : ''}`}>
                        {gapInKnowledge && <span className={styles.gap}>Gap in knowledge</span>}
                        <h4 className="text--small">{ incorrect?.length } employee{incorrect?.length !== 1 ? 's' : ''} answered incorrectly</h4>
                        <ul>
                          {incorrect?.map((name, i) => <li key={`${name}-${i}`}>{ name }</li>)}
                        </ul>
                      </div>
                    )}
                    {((type === 2 || type === 3) && noneResponded) && <small className="text--small">No-one has responded to the survey yet</small>}
                  </SurveyResponse>
                );
              
              })}
            </div>
          </Tab>
          <Tab wrapper={wrapperRef}
            tab={tabRefs.current[1]}
            hide={activeTab !== 'individual'}
            forward={forward}>
            <div ref={tabRefs.current[1]} 
              className={`${styles.individual} tab`}>
              <SurveyIndividual surveyId={surveyId}
                surveyType={surveyType}
                deepLinkedMember={deepLinkMember ?? ''} />
            </div>
          </Tab>
        </div>
      </section>
      {survey?.haveResponded && survey?.notResponded && !survey?.isAnonymous && (
        <SurveyRespondees launch={respondeesModalOpen}
          haveResponded={survey?.haveResponded}
          notResponded={survey?.notResponded}
          emitClose={() => setRespondeesModalOpen(false)} />
      )}
      <Fragment key={refresh}>
        <SurveyResend launch={resendModalOpen}
          surveyId={surveyId}
          surveyType={surveyType}
          unsentMembers={unsentMembers}
          emitClose={() => setResendModalOpen(false)}
          emitResend={handleResend} />
      </Fragment>
      <Modal launch={errorModalOpen}
        classes="modal"
        emitClose={() => router.push(dashboardUrl)}>
        <h2 className="h4">Hi { space.user.firstName }</h2>
        <p className="text--small">This { getLabel(surveyType, true) }{isLearning ? ' survey' : ''} doesn't yet exist. If it's currently in draft form, please publish it. Or, <Link href={`${dashboardUrl}/create`}><a className="widget-link">create a new { getLabel(surveyType, true) }{isLearning ? ' survey' : ''}</a></Link>.</p>
      </Modal>
    </>
  );

};

export default SurveyResults;
