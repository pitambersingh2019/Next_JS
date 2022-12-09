import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Button, Card, Error, Input } from '_atoms';
import { DeleteEmployee, SortableTable } from '_molecules';
import { Pagination } from '_navigation';
import { defaultUser } from '_context';
import { useFetch, useRefresh, useSlider, useTable } from '_hooks';
import { delay } from '_utils';
import styles from './TeamList.module.scss';

interface IActions {
  memberId: string;
  emitDelete: () => void;
}

interface ITable {
  rows: IRow[][];
  emitDelete: (id: string) => void;
}

// configure table head, specifying the string to display as well as the sorting metric & method
const controls: IControl[] = [
  {
    text: 'Name',
    metric: 'name',
    method: 'order'
  },
  {
    text: 'Team',
    metric: 'department',
    method: 'order'
  },
  {
    text: 'Role',
    metric: 'roles',
    method: 'order'
  },
  {
    text: 'Actions'
  }
];

// values for this can be anything as the keys are just used to order the object (using Object.assign)
const order = {
  name: null,
  department: null,
  roles: null,
  actions: null
};

const chunkSize = 20;

const defaultMethod = 'name';

// extracted out as the actions either appear in the first cell (on smaller screens) or as the last cell (on larger screens). Event emitted to be handled in parent component
const Actions = ({ memberId, emitDelete }: IActions) => (
  <div className="table-actions">
    <Link href={`/admin/praise?member=${memberId}`}>
      <a className="widget-link text--medium">Give praise</a>
    </Link>
    <button className="widget-link"
      onClick={emitDelete}>
      Delete
    </button>
  </div>
);

// extracted out as there can be either a single table or a table per slide  
const Table = ({ rows, emitDelete }: ITable) => (
  <tbody>
    {rows.map((row, i) => (
      <tr key={`${row[0].type}-${i}`}>
        {row.map(({ id, type, content, link }, j) => {

          const isFirst = j === 0;
          const isLast = j === row.length - 1;

          return (
            <td key={`${type}-${j}`}
              className={`${type === 'overflow' ? 'overflow-cell ' : ''}text--small`}>
              {isFirst && link && (
                <>
                  <Link href={link}>
                    <a className="text--medium">{ content }</a>
                  </Link>
                  {id && (
                    <Actions memberId={id}
                      emitDelete={() => emitDelete(id)} />
                  )}
                </>
              )}
              {!isFirst && !isLast && (
                content 
                  ? content 
                  : '-'
              )}
              {isLast && id && (
                <Actions memberId={id}
                  emitDelete={() => emitDelete(id)} />
              )}
            </td>
          );

        })}
      </tr>
    ))}
  </tbody>
);

// used to display a table list of all employees in the manager dashboard. If there are more than ten items, the listing table is paginated into a slider 
const TeamList = () => {

  const { register, errors, watch } = useForm({ mode: 'onSubmit' });
  const { slider, activeSlide, atStart, atEnd, setSlider, setActiveSlide, setAtStart, setAtEnd, handleSlideChange } = useSlider();
  const { env, error, errorMessage, fetchData } = useFetch();
  const { rows, isChunked, chunks, active, ascending, needToChunk, sortRows } = useTable(defaultMethod, true, chunkSize);
  const { refresh, refetch, bumpRefresh, bumpRefetch } = useRefresh();
  const [members, setMembers] = useState<IUser[] | null>(null);
  const [mapped, setMapped] = useState<IRow[][]>([]);
  const [typed, setTyped] = useState<boolean>(false);
  const [selectedMember, setSelectedMember] = useState<IUser>(defaultUser);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const typedName = watch('name', '');

  // handle opening of delete modal 
  const handleClose = () => setModalOpen(false);

  // handle closing of delete modal 
  const handleDelete = () => {

    handleClose();

    delay(250).then(() => bumpRefetch());

  };

  const deleteMember = (id: string): void => {

    const target = members?.find(item => item.id === parseInt(id));

    // if we've found their data via the ID, store locally & launch delete modal
    if (target) {
      
      setSelectedMember(target);
      setModalOpen(true);
    
    }

  };

  // this is where we format the data from the API
  const formatRows = (response: IUser[]): void => {

    // map over each item, formatting data for the table & filtering out obsolete bits
    const mapped = response.map(({ id, name, department, roles }: IUser) => {

      const object = {
        id,
        name,
        department,
        roles: Array.isArray(roles) ? roles[roles.length - 1] : roles
      };

      // reorder the object so the cells appear correctly in each row
      const ordered = Object.assign(order, object);

      // put the object into an array, then map over the props to filter & format them to pass to our table 
      const formatted = Object.entries(ordered).filter(([key, _]) => key !== 'id').map(([key, val]): IRow => {

        let format = 'normal';

        // we need the employee name text to overflow with an ellipsis if it's too long 
        if (key === 'name') format = 'overflow';

        // the data for this employee listing item is now ready to be returned to the parent array
        return {
          id: id.toString(),
          type: format,
          content: val,
          metric: key
        };

      });

      // the first cell needs a link so we provide the URL here
      formatted[0].link = `/admin/team/${id}`;

      // return the complete formatted data to be sorted & rendered into the table 
      return formatted;

    });

    // store the raw formatted data locally (before the chunking etc) so we can use for live text filtering 
    setMapped(mapped);

    // work out whether we need a slider to paginate the data
    const chunking = needToChunk(response.length);

    chunking 
      ? sortRowsAndReset(defaultMethod, 'order', mapped)
      : sortRows(defaultMethod, 'order', mapped);

  };

  // if the table is paginated into a slider, we need to first sort & then reset the slider to start at the beginning 
  const sortRowsAndReset = (metric: string, method: SortMethodType = 'order', toSort: IRow[][] = rows, maintain = false) => {

    sortRows(metric, method, toSort, maintain).then(() => {

      bumpRefresh();

      setActiveSlide(0);
      setAtStart(true);
      setAtEnd(false);

    });

  };

  useEffect(() => {

    // when we get our data, format it to be rendered into the table
    if (members?.length) formatRows(members);

  }, [members]);

  useEffect(() => {

    // when the delete modal is closed, wait for animation to play then reset the data & manually refresh the content
    if (!modalOpen) delay(250).then(() => {

      setSelectedMember(defaultUser);
      bumpRefresh();

    });

  }, [modalOpen]);

  useEffect(() => {

    // we have live text filtering on the table, so when the text field value changes we want to filter the members arra & then use that to sort & render in our table - otherwise reset it to use the raw employee list
    if (typedName.length > 0) {

      setTyped(true);

      const filtered = mapped.filter(item => item[0].content.toLowerCase().includes(typedName.toLowerCase()));

      sortRowsAndReset(defaultMethod, 'order', filtered, true);

    } else {

      if (typed) sortRowsAndReset(defaultMethod, 'order', mapped, true);

    }

  }, [typedName]);

  useEffect(() => {

    // fetch our employee data, either on mount or when manually triggered (e.g. after a member is deleted)
    if (env) {

      fetchData('/members/all').then(response => {

        if (Array.isArray(response)) setMembers(response);

      });

    }

  }, [env, refetch]);

  return (
    <>
      <Card heading="Team"
        icon="team"
        loading={members === null}
        classes="dashboard-single card--table">
        <header className={styles.header}>
          <Button text="Add employees"
            target="/admin/team/add"
            prominence="primary" />
          <form className="form form--standard">
            <fieldset>
              <legend>Find an employee</legend>
              <Input name="name"
                label="Name"
                type="text"
                placeholder="Search for an employee"
                hideLabel={true}
                hasError={errors.name}
                errorMsg={errors.name?.message}
                register={register} 
                required={true} />
            </fieldset>
          </form>
        </header>
        <article key={refresh * 3} 
          className={styles.table}>
          <h3 className="text--medium">List of employees</h3>
          {rows && rows.length > 0 ? (
            !isChunked ? (
              <SortableTable controls={controls}
                active={active}
                ascending={ascending}
                emitSort={(metric, method) => sortRows(metric, method)}>
                <Table rows={rows}
                  emitDelete={(id) => deleteMember(id)} />
              </SortableTable>
            ) : (
              <>
                {rows.length > chunkSize && (
                  <Pagination slider={slider}
                    length={chunks.length}
                    active={activeSlide}
                    atStart={atStart}
                    atEnd={atEnd}
                    classes={styles.pagination} /> 
                )}
                <div className={styles.slider}>
                  <Swiper onInit={(slider) => setSlider(slider)}
                    onSlideChange={(slider) => handleSlideChange(slider)}
                    onReachBeginning={() => setAtStart(true)}
                    onReachEnd={() => setAtEnd(true)}>
                    {chunks?.map((chunk, i) => (
                      <SwiperSlide key={`chunk-${i}`}>
                        <div className={styles.slide}>
                          <SortableTable controls={controls}
                            active={active}
                            ascending={ascending}
                            emitSort={(metric, method) => sortRowsAndReset(metric, method)}>
                            <Table rows={chunk}
                              emitDelete={(id) => deleteMember(id)} />
                          </SortableTable>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              </>
            )
          ) : <p>No employees to show. {typedName.length > 0 ? 'Please widen your search or try again' : <Link href={`/admin/team/add`}><a className="widget-link">Add employees</a></Link>}</p>}
          <Error message={`${errorMessage} (${error})`}
            expanded={!!error}
            persist={true} />
        </article>
      </Card>
      <DeleteEmployee key={refresh * 5}
        employee={selectedMember}
        launch={modalOpen}
        emitClose={handleClose}
        emitDeleted={handleDelete} />
    </>
  );

};

export default TeamList;
