import { useCallback, useEffect, useState } from 'react';
import { chunk } from '_utils';
import dayjs from 'dayjs';

// this is used to handle the common state, logic & methods for components that contain sortable tables 
const useTable = (defaultMetric: string, defaultAscending: boolean, chunkSize = 5) => {

  const [rows, setRows] = useState<IRow[][]>([]);
  const [isChunked, setIsChunked] = useState<boolean>(false);
  const [chunks, setChunks] = useState<IRow[][][]>([]);
  const [active, setActive] = useState<string>(defaultMetric);
  const [ascending, setAscending] = useState<boolean>(defaultAscending);

  // toggle the ascending state (in order to tell which direction the button should appear), memoized in order to reduce performance impact
  const toggleAscending = useCallback(() => {

    setAscending(v => !v);

  }, []);

  // work out whether we need to chunk (paginate) the table
  const needToChunk = (total: number): boolean => {

    const chunked = total > chunkSize;

    if (chunked) setIsChunked(true);

    return chunked;

  };

  // used to sort an array, either alphabetically, numerically or via date
  const sortArray = (x: any, y: any, method = 'order'): number => {

    // if either value is 0 we make sure the other is 0.0001 in order for the sorting method to be effective (comparing 0 to 0 will result in the same order)
    const a = (x === 0) ? 0.0001 : x;
    const b = (y === 0) ? 0.0001 : y;
    // by default, both items are the same (not 1 or -1 which is what JS .sort() expects in a return)
    let returnValue = 0;
  
    // make sure we have two items to compare
    if (a && b) {

      if (method === 'date') {

        // if we're comparing dates, dayjs has a real easy way of working out which is before the other
        returnValue = ascending 
          ? dayjs(a).isBefore(dayjs(b)) ? 1 : -1
          : dayjs(b).isBefore(dayjs(a)) ? 1 : -1;

      } else {

        // if we're comparing number it's just a simple subtraction - otherwise the JS util localeCompare() returns a number for string order
        (typeof a === 'number' && typeof b === 'number')
          ? returnValue = ascending 
            ? a - b
            : b - a
          : returnValue = ascending 
            ? a.localeCompare(b) 
            : b.localeCompare(a);

      }

    }

    // return the value to be used in the parent .sort() method
    return returnValue;

  };

  // sort the rows of the table, this is often used directly in components
  const sortRows = (metric: string, method: SortMethodType = 'order', toSort: IRow[][] = rows, maintain = false, avoidSort = false): Promise<void> => {

    return new Promise<void>(resolve => {

      if (avoidSort) {

        // sometimes we just want the data in the same order as the API returns it 
        setRows(toSort);

      } else {

        if (!maintain) {

          // store the active sorting metric locally
          setActive(metric);
          // toggle boolean
          toggleAscending();
  
          // sort the table with the desired method & metric
          const sorted = sortTable([...toSort], metric, method);
  
          // store the sorted rows locally 
          setRows(sorted);
  
        } else {
  
          // sometimes we want to maintain the order without toggling ascending boolean
          setRows(toSort);
  
        }

      }

      resolve();
  
    });

  };

  // the actual method that sorts the table, only used in this hook & not in components 
  const sortTable = (rows: IRow[][], metric: string, method: SortMethodType = 'order'): IRow[][] => rows.sort((a, b) => {
  
    // get the content value of the two objects to sort (found via the target metric) 
    const thisObj = a.find(item => item.metric === metric)?.content;
    const thatObj = b.find(item => item.metric === metric)?.content;

    // pass these to the above method to be sorted 
    return sortArray(thisObj, thatObj, method);

  });

  useEffect(() => {

    // make sure we keep on top of chunks & pagination 
    if (isChunked) setChunks(chunk(rows, chunkSize));

  }, [isChunked, rows]);

  return {
    rows,
    isChunked,
    chunks,
    active,
    ascending,
    toggleAscending,
    needToChunk,
    setActive,
    sortArray,
    sortRows
  };

};

export default useTable;