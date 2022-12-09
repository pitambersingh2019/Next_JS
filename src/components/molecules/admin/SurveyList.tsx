import { Fragment, useEffect, useState } from 'react';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import DeleteSurvey from './DeleteSurvey';
import SortableTable from './../global/SortableTable';
import { Pagination } from '_navigation';
import { useFetch, useRefresh, useSlider, useTable } from '_hooks';
import { delay, getEndpoint, getRoute } from '_utils';
import styles from './SurveyList.module.scss';

interface IProps {
  section: SurveyType;
  surveys: ISurveyListing[];
  controls: IControl[];
  order: ISurveyListingOrder | IOrder;
  isPercent: boolean;
  memberId?: string | string[];
  emitRefresh: () => void;
}

interface IActions {
  status?: SurveyStatusType;
  editLink?: string;
  emitEnd: () => void;
  emitDelete?: () => void;
}

interface ITable {
  rows: IRow[][];
  route: string;
  memberId?: string | string[];
  emitEnd: (id: number) => void;
  emitDelete: (id: number) => void;
}

// blank object to use as default
const defaultSurvey: ISelectedSurvey = {
  id: 0,
  name: ''
};

// paginate table after ten items
const chunkSize = 10;
// name used to sort the table by default
const defaultMethod = 'name';

// extracted out as the actions either appear in the first cell (on smaller screens) or as the last cell (on larger screens). Events emitted to be handled in parent component
const Actions = ({ status, editLink, emitEnd, emitDelete }: IActions) => (  
  <div className="table-actions">
    {status === 'Active' && (
      <button className="widget-link"
        onClick={emitEnd}>
        End
      </button>
    )}
    {status === 'Draft' && editLink && (
      <Link href={editLink}>
        <a className="widget-link">Edit</a>
      </Link>
    )}
    <button className="widget-link"
      onClick={emitDelete}>
        Delete
    </button>
  </div>
);

// extracted out as there can be either a single table or a table per slide  
const Table = ({ rows, route, memberId, emitEnd, emitDelete }: ITable) => (
  <tbody>
    {rows.map((row, i) => (
      <tr key={`${row[0].type}-${i}`}>
        {row.map(({ id, type, content, createdByProsperEx, status }, j) => {

          const isDraft = status === 'Draft';
          const isNumber = type === 'number';
          const isPercent = type === 'percent';
          const isFirst = j === 0;
          const isLast = j === row.length - 1;
          const editLink = isDraft ? `/admin/${route}/create/${id}` : undefined;
          const viewLink = memberId ? `/admin/${route}/${id}/?member=${memberId}` : `/admin/${route}/${id}/`;
          
          return (
            <td key={`${type}-${j}`}
              className={`${type === 'overflow' ? 'overflow-cell ' : ''}text--small`}>
              {isFirst && (
                <>
                  {isDraft ? (
                    <span className="text--medium">{ content }</span>
                  ) : (
                    <Link href={viewLink}>
                      <a className="text--medium">{ content }</a>
                    </Link>
                  )}
                  <div className={styles.info}>
                    {createdByProsperEx && <small>Created by Prosper EX</small>}
                    {status && <small className={styles.status}>{ status }</small>}
                  </div>
                  <Actions status={status} 
                    editLink={editLink}
                    emitEnd={() => id && emitEnd(parseInt(id))}
                    emitDelete={() => id && emitDelete(parseInt(id))} />
                </>
              )}
              {isLast && (
                <Actions status={status}
                  editLink={editLink}
                  emitEnd={() => id && emitEnd(parseInt(id))} 
                  emitDelete={() => id && emitDelete(parseInt(id))} />
              )}
              {!isFirst && !isLast && (
                isNumber || isPercent ? (
                  <>
                    {isDraft && '-'}
                    {!isDraft && (
                      isPercent ? `${Math.round(content)}%` : content
                    )}
                  </>
                ) : content
              )}
            </td>
          );

        })}
      </tr>
    ))}
  </tbody>
);

// used to display survey listings in the manager dashboard. If there are more than ten items, the listing table is paginated into a slider 
const SurveyList = ({ section, surveys, controls, order, isPercent, memberId, emitRefresh }: IProps) => {

  const { env, fetchData } = useFetch();
  const { slider, activeSlide, atStart, atEnd, setSlider, setActiveSlide, setAtStart, setAtEnd, handleSlideChange } = useSlider();
  const { rows, isChunked, chunks, active, ascending, needToChunk, sortRows, setActive, toggleAscending } = useTable('', false, chunkSize);
  const { refresh, refetch, bumpRefresh, bumpRefetch } = useRefresh();
  const sectionClass = section.toLowerCase();
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [selectedSurvey, setSelectedSurvey] = useState<ISelectedSurvey>(defaultSurvey);
  
  // used to end a survey, i.e. change its status from 'Active' to 'Ended'
  const handleEnd = (id: number): void => {

    if (env) {

      fetchData(`/${getEndpoint(section)}/end/${id}`).then(response => {

        if (response?.ended) emitRefresh();

      });

    }
    
  };

  // used when the delete survey modal is closed - the passed boolean lets us know whether to refresh the data or simply to close the modal 
  const handleClose = (deleted: boolean): void => {

    deleted
      ? emitRefresh()
      : setDeleteModalOpen(false);

  };

  // used to launch the delete survey modal
  const handleDelete = (id: number): void => {

    // get survey data by its ID 
    const selectedSurveyFromId = surveys.find(survey => id === survey.id);
    // get the survey name for the modal
    const name = selectedSurveyFromId?.name;
    // assign ID and name into object
    const survey = { id, name };

    // launch modal 
    setDeleteModalOpen(true);
    // save selected survey locally 
    setSelectedSurvey(survey);

  };

  // this is where we format the data from the API
  const formatRows = (response: ISurveyListing[]): void => {

    // map over each item, formatting data for the table & filtering out obsolete bits
    const mapped = response.map((object: ISurveyListing) => {

      const { id, createdByProsperEx, status } = object;

      // reorder the object so the cells appear correctly in each row
      const ordered = Object.assign(order, object);

      // put the object into an array, then map over the props to filter & format them to pass to our table 
      const formatted = Object.entries(ordered)
        .filter(([key, _]) => key !== 'id' && key !== 'createdOn' && key !== 'isAnonymous')
        .map(([key, val]): IRow => {

          let format = 'normal';

          switch (true) {

            // we need the survey name text to overflow with an ellipsis if it's too long 
            case key === 'name':
              format = 'overflow';
              break;

            // we need the survey score to be a number if it isn't a percentage
            case key === 'averageScore' && !isPercent:
              format = 'number';
              break;

            // we need the survey score or response rate to be a percentage 
            case key === 'averageScore' 
            || key === 'responseRate'
            || key === 'mark':
              format = 'percent';
              break;

            default:
              break;

          }

          // the data for this survey listing item is now ready to be returned to the parent array
          return {
            id: id.toString(),
            type: format,
            content: val,
            metric: key,
            status
          };

        });

      // the first cell needs a link so we provide the URL here
      formatted[0].link = `/admin/${getRoute(section)}/${id}`;

      // the first cell needs an optional message if it was created globally in Umbraco, so we define that here
      if (createdByProsperEx) formatted[0].createdByProsperEx = createdByProsperEx;

      // return the complete formatted data to be sorted & rendered into the table 
      return formatted;

    });

    // work out whether we need a slider to paginate the data
    const chunking = needToChunk(response.length);

    chunking 
      ? sortRowsAndReset(defaultMethod, 'order', mapped, true, true)
      : sortRows(defaultMethod, 'order', mapped, true, true);

  };

  // if the table is paginated into a slider, we need to first sort & then reset the slider to start at the beginning 
  const sortRowsAndReset = (metric: string, method: SortMethodType = 'order', toSort: IRow[][] = rows, maintain = true, avoidSort = true) => {

    sortRows(metric, method, toSort, maintain, avoidSort).then(() => {

      bumpRefresh();

      setActiveSlide(0);
      setAtStart(true);
      setAtEnd(false);

    });

  };

  useEffect(() => {

    // when the surveys passed in from the parent component change, we want to format the data into our table
    formatRows(surveys);
    // we also want to reset the table sorting method 
    setActive('');
    
    // make sure we keep track of the direction of sorting method 
    if (active !== '') toggleAscending();

    // if this was triggered by a data refresh, close the survey delete modal as the survey was sucessfully deleted 
    delay(250).then(() => setDeleteModalOpen(false));

  }, [surveys]);

  useEffect(() => {

    // when the survey delete modal is closed, wait for the animtion to play & then reset it for next time
    if (!deleteModalOpen) delay(250).then(() => bumpRefetch());

  }, [deleteModalOpen]);

  return (
    <>
      <div className={`${styles.root}${styles[sectionClass] ? ' ' + styles[sectionClass] : ''}`}>
        {rows && rows.length > 0 && (
          !isChunked ? (
            <SortableTable key={refresh * 3}
              controls={controls}
              active={active}
              ascending={ascending}
              emitSort={(metric, method) => sortRows(metric, method)}>
              <Table rows={rows}
                route={getRoute(section)}
                memberId={memberId}
                emitEnd={(id) => handleEnd(id)}
                emitDelete={(id) => handleDelete(id)} />
            </SortableTable>
          ) : (
            <Fragment key={refresh * 5}>
              <Pagination slider={slider}
                length={chunks.length}
                active={activeSlide}
                atStart={atStart}
                atEnd={atEnd}
                classes={styles.pagination} /> 
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
                          emitSort={(metric, method) => sortRowsAndReset(metric, method, rows, false, false)}>
                          <Table rows={chunk}
                            route={getRoute(section)}
                            memberId={memberId}
                            emitEnd={(id) => handleEnd(id)}
                            emitDelete={(id) => handleDelete(id)} />
                        </SortableTable>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </Fragment>
          )
        )}
      </div>
      <DeleteSurvey key={refetch}
        survey={selectedSurvey}
        launch={deleteModalOpen}
        surveyType={section}
        emitClose={(deleted) => handleClose(deleted)} />
    </>
  );

};

export default SurveyList;
