import { useContext } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { SpaceContext } from '_context';
import { getLabel, getRoute } from '_utils';

interface IProps {
  surveyId?: string | string[];
  surveyStatus?: SurveyStatusType;
  surveyType: SurveyType;
  launch: boolean;
}

const Modal = dynamic(import('./../global/Modal'));

// modal component used by the parent component (SurveyCreate) to alert a user if the survey they're trying to edit is active or ended  
const PublishedSurvey = ({ surveyId, surveyStatus, surveyType, launch }: IProps) => {

  const router = useRouter();
  const { space } = useContext(SpaceContext);
  const dashboardUrl = `/admin/${getRoute(surveyType)}`;

  // build out message string for user 
  const getModalMessage = (): string => {

    let message = `This ${getLabel(surveyType, true)}`;

    if (surveyStatus === 'Active') message += ` is active`;

    if (surveyStatus === 'Ended') message += ` has ended`;

    return message;

  };

  return (
    <Modal launch={launch}
      classes="modal"
      emitClose={() => router.push(dashboardUrl)}>
      <h2 className="h4">Hi { space.user.firstName }</h2>
      <p className="text--small">{ getModalMessage() } so can no longer be edited. Would you like to see the <Link href={`${dashboardUrl}/${surveyId}`}><a className="widget-link">responses</a></Link> or return to the { getLabel(surveyType, true) } <Link href={dashboardUrl}><a className="widget-link">dashboard</a></Link>?</p>
    </Modal>
  );

};

export default PublishedSurvey;
