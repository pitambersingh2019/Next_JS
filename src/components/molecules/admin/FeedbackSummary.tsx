import { Fragment, useEffect } from 'react';
import Link from 'next/link';
import dayjs from 'dayjs';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Card, Error } from '_atoms';
import SortableTable from './../global/SortableTable';
import { Pagination } from '_navigation';
import { useFetch, useRefresh, useSlider, useTable } from '_hooks';
import { globals } from '_utils';
import styles from './FeedbackSummary.module.scss';

interface ITable {
  rows: IRow[][];
}

interface IProps {
  classes?: string;
}

// configure table head, specifying the string to display as well as the sorting metric & method
const controls: IControl[] = [
  {
    text: 'Message',
    metric: 'message',
    method: 'order'
  },
  {
    text: 'Employee',
    metric: 'employee',
    method: 'order'
  },
  {
    text: 'Date',
    metric: 'date',
    method: 'date'
  }
];

// values for this can be anything as the keys are just used to order the object (using Object.assign)
const objectOrder = {
  message: null,
  employee: null,
  date: null
};

const { shortDate } = globals;

// date used to sort the table by default
const defaultMethod = 'date';

// extracted out as there can be either a single table or a table per slide  
const Table = ({ rows }: ITable) => (
  <tbody>
    {rows.map((row, i) => (
      <tr key={`${row[0].type}-${i}`}>
        {row.map(({ type, content, link }, j) => (
          <td key={`${type}-${j}`}
            className={`${type === 'overflow' ? 'overflow-cell ' : ''}text--small`}>
            {link ? (
              <Link href={link}>
                <a>{ content }</a>
              </Link>
            ) : (
              type === 'date' ? dayjs(content).format(shortDate) : (
                <>
                  { content }{type === 'percent' ? '%' : ''}
                </>
              )
            )}
          </td>
        ))}
      </tr>
    ))}
  </tbody>
);

// table component used to display feedback in the manager dashboard. If there are more than five items, the table is paginated into a slider
const FeedbackSummary = ({ classes }: IProps) => {

  const { env, error, errorMessage, fetchData } = useFetch();
  const { slider, activeSlide, atStart, atEnd, setSlider, setActiveSlide, setAtStart, setAtEnd, handleSlideChange } = useSlider();
  const { rows, isChunked, chunks, active, ascending, needToChunk, sortRows } = useTable(defaultMethod, true);
  const { refresh, bumpRefresh } = useRefresh();

  // this is where we format the data from the API
  const formatRows = (response: ISuggestion[]): void => {

    // map over each item, formatting data for the table & filtering out obsolete bits
    const mapped = response.map((object: ISuggestion) => {
      
      // reorder the object so the cells appear correctly in each row
      const ordered = Object.assign(objectOrder, object);
      // put the object into an array & then map over the props to format them to pass to our table 
      const formatted = Object.entries(ordered).filter(([key, _]) => key !== 'id').map(([key, val]): IRow => {

        let format = 'normal';

        switch (true) {

          // we need the message text to overflow with an ellipsis if it's too long 
          case key === 'message':
            format = 'overflow';
            break;

          // this is where we specify this column can be sorted by date 
          case key === 'date':
            format = 'date';
            break;

          default:
            break;

        }

        // the data for this feedback item is now ready to be returned to the parent array 
        return {
          type: format,
          content: val,
          metric: key
        };
      
      });

      // the first cell needs a link so we provide the URL here
      formatted[0].link = `/admin/feedback/${object.id}`;

      // return the complete formatted data to be sorted & rendered into the table 
      return formatted;

    });

    // work out whether we need a slider to paginate the data 
    const chunking = needToChunk(response.length);

    chunking 
      ? sortRowsAndReset(defaultMethod, 'date', mapped)
      : sortRows(defaultMethod, 'date', mapped);

  };

  // if the table is paginated into a slider, we need to first sort & then reset the slider to start at the beginning 
  const sortRowsAndReset = (metric: string, method: SortMethodType = 'order', toSort: IRow[][] = rows) => {

    sortRows(metric, method, toSort).then(() => {

      bumpRefresh();

      setActiveSlide(0);
      setAtStart(true);
      setAtEnd(false);

    });

  };

  useEffect(() => {

    // get all feedback items & then format the data into tables 
    if (env) fetchData('/feedback/all').then(response => {

      if (response && typeof response !== 'number') formatRows(response);

    });

  }, [env]);

  return (
    <Card heading="Open suggestions and feedback"
      icon="feedback"
      loading={!rows}
      error={false}
      classes={`${styles.root}${rows.length === 0 ? ' ' + styles.empty : ''}${classes ? ' ' + classes : ''} card--table`}>
      <>
        {rows && rows.length > 0 ? (
          !isChunked ? (
            <SortableTable key={refresh}
              controls={controls}
              active={active}
              ascending={ascending}
              emitSort={(metric, method) => sortRows(metric, method)}>
              <Table rows={rows} />
            </SortableTable>
          ) : (
            <Fragment key={refresh}>
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
                          emitSort={(metric, method) => sortRowsAndReset(metric, method)}>
                          <Table rows={chunk} />
                        </SortableTable>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </Fragment>
          )
        ) : <p>No-one has submitted any feedback yet</p>}
        <Error message={`${errorMessage} (${error})`}
          expanded={!!error} />
      </>
    </Card>
  );

};

export default FeedbackSummary;
