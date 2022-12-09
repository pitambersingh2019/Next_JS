import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Error, Input } from '_atoms';
import { DeleteTopic, EditTopic, SortableTable, TabbedForm } from '_molecules';
import { useFetch, useRefresh, useTable } from '_hooks';
import { delay } from '_utils';
import styles from './ManageValues.module.scss';

interface IActions {
  emitDelete: () => void;
  emitEdit: () => void;
}

// configure table head, specifying the string to display as well as the sorting metric & method
const controls: IControl[] = [
  {
    text: 'Name',
    metric: 'name',
    method: 'order'
  },
  {
    text: 'Survey count'
  },
  {
    text: 'Actions'
  }
];

const defaultTopic: ITopic = {
  id: '',
  name: '',
  active: 0,
  ended: 0
};

// extracted here as the buttons appear in two places depending on screen size 
const Actions = ({ emitDelete, emitEdit }: IActions) => (
  <div className={styles.actions}>
    <button className="widget-link"
      onClick={emitEdit}>
      Edit
    </button>
    <button className="widget-link"
      onClick={emitDelete}>
      Delete
    </button>
  </div>
);

// used to add, edit & remove learning topics 
const LearningTopics = () => {

  const { register, errors, handleSubmit } = useForm({ mode: 'onSubmit' });
  const { env, error, errorMessage, submitted, setSubmitted, postData, fetchData } = useFetch();
  const { active, ascending, toggleAscending, sortArray } = useTable('name', false);
  const { refresh, refetch, bumpRefresh, bumpRefetch } = useRefresh();
  const [rows, setRows] = useState<ITopic[]>([]);
  const [topics, setTopics] = useState<ITopic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<ITopic>(defaultTopic);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);

  // handle submit event, to add a new topic via the API 
  const onSubmit = (submitted: ITopicUpdate) => {

    postData('/training-topics/add', submitted).then(response => {

      if (response?.id) {

        // show confirmation message
        setSubmitted(true);
        bumpRefetch();
        
        // after 3s, hide the confirmation message & revert the UI 
        delay(3000).then(() => {

          bumpRefresh();
          setSubmitted(false);

        });

      }

    });

  };

  // handle learning topic deletion (in a modal). This method stores the data for the selected learning topic & then launches the modal 
  const deleteTopic = (topic: ITopic): void => {

    setSelectedTopic(topic);
    setDeleteModalOpen(true);

  };

  // handle learning topic editing (in a modal). This method stores the data for the selected learning topic & then launches the modal 
  const editTopic = (topic: ITopic): void => {

    setSelectedTopic(topic);
    setEditModalOpen(true);

  };

  // once the edit or delete modal is closed, wait for the animation to play before removing the stored value data & manually refreshing 
  const revertTopic = () => delay(250).then(() => {

    setSelectedTopic(defaultTopic);
    bumpRefetch();
    bumpRefresh();

  });

  // sort company values by name for list
  const sortTopics = (toSort: ITopic[]): ITopic[] => toSort.sort((a, b) => sortArray(b.name, a.name));

  // apply selected sorting method to table rows; toggling direction, updating stored rows array & then manually refreshing 
  const sortRows = (): void => {

    toggleAscending();

    setRows(sortTopics(rows));

    bumpRefresh();

  };

  useEffect(() => {

    // call revert method when delete modal is closed
    if (!deleteModalOpen) revertTopic();

  }, [deleteModalOpen]);

  useEffect(() => {

    // call revert method when edit modal is closed
    if (!editModalOpen) revertTopic();

  }, [editModalOpen]);

  useEffect(() => {

    // store the API response locally
    setRows(topics);

  }, [topics]);

  useEffect(() => {

    // fetch the learning topics from the API 
    if (env) {

      fetchData('/training-topics/all').then(response => {

        if (response?.length) setTopics(response);

      });

    }

  }, [env, refetch]);

  return (
    <>
      <section className={`${styles.root} dashboard-single card card--table`}>
        <h1 className="h4">Manage learning topics</h1>
        <article className={styles.table}>
          {rows?.length > 0 ? (
            <SortableTable key={refresh * 2}
              controls={controls}
              active={active}
              ascending={ascending}
              emitSort={sortRows}>
              <tbody>
                {rows.map((row, i) => {

                  const { name, active, ended } = row;

                  return (
                    <tr key={`${name}-${i}`}>
                      <td className="text--medium">
                        <div>{ name }</div>
                        <Actions emitDelete={() => deleteTopic(row)}
                          emitEdit={() => editTopic(row)} />
                      </td>
                      <td className="text--small">{ active } active, { ended } ended</td>
                      <td className="text--small">
                        <Actions emitDelete={() => deleteTopic(row)}
                          emitEdit={() => editTopic(row)} />
                      </td>
                    </tr>
                  );

                })}
              </tbody>
            </SortableTable>
          ) : <p className="text--medium">Create a topic below</p>}
        </article>
        <article className={styles.add}>
          <h2 className="text--medium">Add a new topic</h2>
          <TabbedForm success={submitted}
            info="Your topic has been added">
            <form className="form form--standard"
              onSubmit={handleSubmit(onSubmit)}>
              <fieldset>
                <legend>Form group</legend>
                <Input key={refresh * 3}
                  name="name"
                  label="Topic name" 
                  type="text"
                  hasError={errors.name}
                  errorMsg={errors.name?.message}
                  register={register} 
                  required={true} />
              </fieldset>
              <Button text="Add"
                type="submit"
                prominence="primary" />
              <Error message={`${errorMessage} (${error})`}
                expanded={!!error} />
            </form>
          </TabbedForm>
        </article>
      </section>
      <DeleteTopic key={refresh * 5}
        all={topics}
        topic={selectedTopic}
        launch={deleteModalOpen}
        emitClose={() => setDeleteModalOpen(false)} />
      <EditTopic key={refresh * 7}
        topic={selectedTopic}
        launch={editModalOpen}
        emitClose={() => setEditModalOpen(false)} />
    </>
  );

};

export default LearningTopics;
