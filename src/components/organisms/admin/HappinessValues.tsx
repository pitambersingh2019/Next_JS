import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Error, Input } from '_atoms';
import { DeleteValue, EditValue, SortableTable } from '_molecules';
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
    text: 'Question count'
  },
  {
    text: 'Actions'
  }
];

const defaultCompanyValue: ICompanyValue = {
  id: '',
  name: ''
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

// used to add, edit & remove company values 
const HappinessValues = () => {

  const { register, errors, handleSubmit } = useForm({ mode: 'onSubmit' });
  const { env, error, errorMessage, fetchData, postData } = useFetch();
  const { active, ascending, toggleAscending, sortArray } = useTable('name', false);
  const { refresh, refetch, bumpRefresh, bumpRefetch } = useRefresh();
  const [rows, setRows] = useState<ICompanyValue[]>([]);
  const [values, setValues] = useState<ICompanyValue[]>([]);
  const [selectedCompanyValue, setSelectedCompanyValue] = useState<ICompanyValue>(defaultCompanyValue);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);

  // handle submit event, to add a new value via the API 
  const onSubmit = (submitted: ICompanyValue) => {

    postData('/company-values/add', submitted).then(response => {

      if (response?.added.id) {

        bumpRefetch();
        bumpRefresh();

      }

    });

  };

  // handle company value deletion (in a modal). This method stores the data for the selected company value & then launches the modal 
  const deleteValue = (value: ICompanyValue): void => {

    setSelectedCompanyValue(value);
    setDeleteModalOpen(true);

  };

  // handle company value editing (in a modal). This method stores the data for the selected company value & then launches the modal 
  const editValue = (value: ICompanyValue): void => {

    setSelectedCompanyValue(value);
    setEditModalOpen(true);

  };

  // once the edit or delete modal is closed, wait for the animation to play before removing the stored value data & manually refreshing 
  const revertValue = () => delay(250).then(() => {

    setSelectedCompanyValue(defaultCompanyValue);
    bumpRefetch();
    bumpRefresh();

  });

  // sort company values by name for list
  const sortValues = (toSort: ICompanyValue[]): ICompanyValue[] => toSort.sort((a, b) => sortArray(b.name, a.name));

  // apply selected sorting method to table rows; toggling direction, updating stored rows array & then manually refreshing 
  const sortRows = (): void => {

    toggleAscending();

    setRows(sortValues(rows));

    bumpRefresh();

  };

  useEffect(() => {

    // call revert method when delete modal is closed
    if (!deleteModalOpen) revertValue();

  }, [deleteModalOpen]);

  useEffect(() => {

    // call revert method when edit modal is closed
    if (!editModalOpen) revertValue();

  }, [editModalOpen]);

  useEffect(() => {

    // store the API response locally
    setRows(values);

  }, [values]);

  useEffect(() => {

    // fetch the company values from the API 
    if (env) {

      fetchData('/company-values/all').then(response => {

        if (response?.length) {

          setValues(sortValues(response));

        } else {

          setRows([]);
          bumpRefresh();

        }

      });

    }

  }, [env, refetch]);

  return (
    <>
      <section className={`${styles.root} dashboard-single card card--table`}>
        <h1 className="h4">Manage company values</h1>
        <article className={styles.table}>
          {rows.length > 0 ? (
            <SortableTable key={refresh * 2}
              controls={controls}
              active={active}
              ascending={ascending}
              emitSort={sortRows}>
              <tbody>
                {rows.map((row, i) => {

                  const { name, questionCount } = row;
                  
                  return (
                    <tr key={`${name}-${i}`}>
                      <td className="text--medium">
                        <div>{ name }</div>
                        <Actions emitDelete={() => deleteValue(row)}
                          emitEdit={() => editValue(row)} />
                      </td>
                      <td className="text--small">{ questionCount } question{questionCount !== 1 && 's'}</td>
                      <td className="text--small">
                        <Actions emitDelete={() => deleteValue(row)}
                          emitEdit={() => editValue(row)} />
                      </td>
                    </tr>
                  );

                })}
              </tbody>
            </SortableTable>
          ) : <p className="text--medium">Create a value below</p>}
        </article>
        <article className={styles.add}>
          <h2 className="text--medium">Add a new value</h2>
          <form className="form form--standard"
            onSubmit={handleSubmit(onSubmit)}>
            <fieldset>
              <legend>Form group</legend>
              <Input key={refresh * 3}
                name="name"
                label="Company value name" 
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
        </article>
      </section>
      <DeleteValue key={refresh * 5}
        companyValue={selectedCompanyValue}
        launch={deleteModalOpen}
        emitClose={() => setDeleteModalOpen(false)} />
      <EditValue key={refresh * 7}
        companyValue={selectedCompanyValue}
        launch={editModalOpen}
        emitClose={() => setEditModalOpen(false)} />
    </>
  );

};

export default HappinessValues;
