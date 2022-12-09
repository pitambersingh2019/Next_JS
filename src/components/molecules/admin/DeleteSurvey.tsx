import { useContext } from 'react';
import dynamic from 'next/dynamic';
import { Button, Error } from '_atoms';
import { LoadingContext } from '_context';
import { useFetch } from '_hooks';
import { getEndpoint } from '_utils';
import styles from './DeleteModal.module.scss';

interface IProps {
  survey: ISelectedSurvey;
  surveyType: SurveyType;
  launch: boolean;
  emitClose: (deleted: boolean) => void;
}

const Modal = dynamic(import('./../global/Modal'));

// modal component used in various places to delete a survey from the platform 
const DeleteSurvey = ({ survey, surveyType, launch, emitClose }: IProps) => {

  const { isLoading } = useContext(LoadingContext);
  const { error, errorMessage, postData } = useFetch();
  const { id: surveyId, name } = survey;

  // the user has confirmed that they really want to delete the survey, so we post the ID to the API 
  const deleteSurvey = () => {

    const data = {
      surveyId
    };

    postData(`/${getEndpoint(surveyType)}/delete`, data).then(response => {

      if (response?.deleted) emitClose(true);

    });

  };

  return (
    <Modal launch={launch} 
      classes={`${styles.root} modal`}
      emitClose={() => emitClose(false)}>
      <h2 className="h4">Are you sure you want to delete this survey?</h2>
      <p className="text--small">Deleting "{ name }" will affect reporting data and cannot be undone.</p>
      <div className="actions">
        <Button text="Delete"
          prominence="primary"
          emitClick={deleteSurvey}
          disabled={isLoading} />
        <Button text="Cancel"
          emitClick={() => emitClose(false)} />
      </div>
      <Error message={`${errorMessage} (${error})`}
        expanded={!!error} />
    </Modal>
  );

};

export default DeleteSurvey;