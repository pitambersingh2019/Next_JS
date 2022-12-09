import { Fragment, useContext, useEffect } from 'react';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Card, NumberChip } from '_atoms';
import { FilterContext } from '_context';
import SortableTable from './../global/SortableTable';
import { Pagination } from '_navigation';
import { useFetch, useRefresh, useSlider, useTable } from '_hooks';
import { filterDraftSurveys } from '_utils';
import styles from './SurveysSummary.module.scss';

interface ITable {
  rows: IRow[][];
}

interface IProps {
  classes?: string;
}

// configure table head, specifying the string to display as well as the sorting metric & method
const controls: IControl[] = [
  {
    text: 'Survey name',
    metric: 'name',
    method: 'order'
  },
  {
    text: 'Response rate',
    metric: 'responseRate',
    method: 'order'
  }
];

// values for this can be anything as the keys are just used to order the object (using Object.assign)
const objectOrder = {
  name: null,
  responseRate: null
};

// survey name used to sort the table by default
const defaultMethod = 'name';

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
              <NumberChip number={content} />
            )}
          </td>
        ))}
      </tr>
    ))}
  </tbody>
);

// used to display standard survey data in the manager dashboard. If there are more than five items, the listing table is paginated into a slider 
const SurveysSummary = ({ classes }: IProps) => {

  const { env, error, success, postData } = useFetch();
  const { dates } = useContext(FilterContext);
  const { slider, activeSlide, atStart, atEnd, setSlider, setActiveSlide, setAtStart, setAtEnd, handleSlideChange } = useSlider();
  const { rows, isChunked, chunks, active, ascending, needToChunk, sortRows } = useTable(defaultMethod, true);
  const { refresh, bumpRefresh } = useRefresh();

  // this is where we format the data from the API
  const formatRows = (response: ISurveyListing[]): void => {

    // map over each item, formatting data for the table & filtering out obsolete bits
    const mapped = response.map((object: ISurveyListing) => {
      
      // reorder the object so the cells appear correctly in each row
      const ordered = Object.assign(objectOrder, object);
      // put the object into an array & then map over the props to format them to pass to our table 
      const formatted = Object.entries(ordered).filter(([key, _]) => key === 'name' || key === 'responseRate').map(([key, val]): IRow => {

        let format = 'normal';

        // we need the survey name text to overflow with an ellipsis if it's too long 
        if (key === 'name') format = 'overflow';

        // the data for this feedback item is now ready to be returned to the parent array
        return {
          type: format,
          content: val,
          metric: key
        };
      
      });

      // the first cell needs a link so we provide the URL here
      formatted[0].link = `/admin/surveys/${object.id}`;

      // return the complete formatted data to be sorted & rendered into the table 
      return formatted;

    });

    // work out whether we need a slider to paginate the data
    const chunking = needToChunk(response.length);

    chunking 
      ? sortRowsAndReset(defaultMethod, 'order', mapped)
      : sortRows(defaultMethod, 'order', mapped);

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

    // get all standard survey summary data for the target date range & then format the data for display
    if (env) {

      const data = { dates };

      postData('/standard/summary', data).then(response => {

        if (response?.list) formatRows(filterDraftSurveys(response.list));
  
      });
  
    }
  
  }, [env, dates]);

  return (
    <Card heading="Surveys"
      icon="survey"
      loading={!success && !error}
      error={!!error}
      classes={`${classes ? classes + ' ' : ''}card--table`}>
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
            <Pagination slider={slider}
              length={chunks.length}
              active={activeSlide}
              atStart={atStart}
              atEnd={atEnd}
              classes={styles.pagination} /> 
          </Fragment>
        )
      ) : <p className="padded">No-one has completed a survey in this date range</p>}
      <div className={`${styles.actions} card__actions`}>
        <Link href="/admin/surveys"> 
          <a className="widget-link">View all surveys</a>
        </Link>
      </div>
    </Card>
  );

};

export default SurveysSummary;
